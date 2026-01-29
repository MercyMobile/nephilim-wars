#!/usr/bin/env python3
"""
NPU-Orchestrated Vulkan Upscaling Workflow
Hardware: Strix Point NPU + Radeon VII 16GB + RTX 4070
Uses: Phi-3.5 NPU for orchestration, Radeon VII for Vulkan upscaling
"""

import os
import sys
import time
import json
import subprocess
import requests
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
from queue import Queue
import hashlib

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    # Paths
    "SD_OUTPUT_DIR": r"C:\Users\velez\Desktop\AI_Tools\SD\outputs",
    "UPSCALE_OUTPUT_DIR": r"C:\Users\velez\Desktop\AI_Tools\SD\outputs\upscaled",
    "PROCESSED_LOG": r"C:\Users\velez\Desktop\AI_Tools\SD\outputs\.processed_images.json",
    
    # NPU Server (Phi-3.5)
    "NPU_SERVER": "http://127.0.0.1:8080",
    "NPU_ENABLED": True,  # Set to False to run without NPU orchestration
    
    # Upscaling Settings
    "REALESRGAN_PATH": r"C:\Users\velez\Desktop\AI_Tools\realesrgan-ncnn-vulkan.exe",
    "VULKAN_DEVICE_ID": 1,  # Radeon VII (confirmed by device test)
    "UPSCALE_SCALE": 4,  # 2x or 4x
    "MODEL_NAME": "realesrgan-x4plus",  # or "realesrgan-x4plus-anime"
    
    # Processing Options
    "AUTO_WATCH": True,  # Automatically process new images
    "BATCH_SIZE": 5,  # Process N images at once
    "MIN_FILE_SIZE_KB": 10,  # Ignore tiny files
    "SUPPORTED_FORMATS": [".png", ".jpg", ".jpeg", ".webp"],
    
    # NPU Intelligence Features
    "USE_NPU_ANALYSIS": True,  # Let NPU analyze images before upscaling
    "NPU_DECIDES_SETTINGS": False,  # Let NPU choose upscale settings (experimental)
}

# ============================================================================
# NPU CLIENT - Phi-3.5 Orchestration
# ============================================================================

class NPUOrchestrator:
    """Uses Phi-3.5 NPU server for intelligent workflow orchestration"""
    
    def __init__(self, server_url: str):
        self.server_url = server_url
        self.available = self._check_availability()
    
    def _check_availability(self) -> bool:
        """Check if NPU server is running"""
        try:
            response = requests.get(f"{self.server_url}/health", timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def analyze_image_batch(self, image_paths: List[str]) -> Dict:
        """Ask NPU to analyze a batch of images for processing decisions"""
        if not self.available or not CONFIG["USE_NPU_ANALYSIS"]:
            return {"recommendation": "process_all", "priority": "normal"}
        
        prompt = f"""You are an image processing orchestrator. Analyze this batch of {len(image_paths)} images:

Files: {', '.join([Path(p).name for p in image_paths])}

Provide a brief analysis:
1. Should all images be upscaled? (yes/no/selective)
2. Recommended processing priority (high/normal/low)
3. Any special considerations?

Be concise - one sentence per point."""

        try:
            response = requests.post(
                f"{self.server_url}/v1/chat/completions",
                json={
                    "model": "phi-3.5",
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 150,
                    "temperature": 0.3
                },
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                analysis = result["choices"][0]["message"]["content"]
                return {
                    "recommendation": "process_all",
                    "priority": "normal",
                    "npu_analysis": analysis
                }
        except Exception as e:
            print(f"[NPU] Analysis failed: {e}")
        
        return {"recommendation": "process_all", "priority": "normal"}
    
    def log_activity(self, message: str):
        """Send activity log to NPU for context building"""
        if not self.available:
            return
        
        try:
            requests.post(
                f"{self.server_url}/v1/chat/completions",
                json={
                    "model": "phi-3.5",
                    "messages": [{"role": "system", "content": f"Activity Log: {message}"}],
                    "max_tokens": 1
                },
                timeout=2
            )
        except:
            pass

# ============================================================================
# UPSCALING ENGINE - Vulkan Real-ESRGAN
# ============================================================================

class VulkanUpscaler:
    """Handles Vulkan-based upscaling on Radeon VII"""
    
    def __init__(self):
        self.realesrgan_path = Path(CONFIG["REALESRGAN_PATH"])
        self.device_id = CONFIG["VULKAN_DEVICE_ID"]
        self.scale = CONFIG["UPSCALE_SCALE"]
        self.model = CONFIG["MODEL_NAME"]
        
        if not self.realesrgan_path.exists():
            print(f"[ERROR] Real-ESRGAN not found at: {self.realesrgan_path}")
            print("[INFO] Download from: https://github.com/xinntao/Real-ESRGAN/releases")
            sys.exit(1)
    
    def upscale_image(self, input_path: str, output_path: str) -> bool:
        """Upscale a single image using Vulkan"""
        try:
            cmd = [
                str(self.realesrgan_path),
                "-i", input_path,
                "-o", output_path,
                "-s", str(self.scale),
                "-n", self.model,
                "-g", str(self.device_id),  # Vulkan device ID
                "-f", "png"  # Output format
            ]
            
            print(f"[UPSCALE] Processing: {Path(input_path).name}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300
            )
            
            if result.returncode == 0 and Path(output_path).exists():
                print(f"[SUCCESS] Upscaled: {Path(output_path).name}")
                return True
            else:
                print(f"[ERROR] Upscale failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            print(f"[ERROR] Upscale timeout: {Path(input_path).name}")
            return False
        except Exception as e:
            print(f"[ERROR] Upscale exception: {e}")
            return False
    
    def batch_upscale(self, image_paths: List[str], output_dir: str) -> List[str]:
        """Upscale multiple images"""
        results = []
        for img_path in image_paths:
            input_file = Path(img_path)
            output_file = Path(output_dir) / f"{input_file.stem}_upscaled.png"
            
            if self.upscale_image(str(input_file), str(output_file)):
                results.append(str(output_file))
        
        return results

# ============================================================================
# WORKFLOW MANAGER
# ============================================================================

class UpscalingWorkflow:
    """Main workflow orchestrator"""
    
    def __init__(self):
        self.sd_output_dir = Path(CONFIG["SD_OUTPUT_DIR"])
        self.upscale_output_dir = Path(CONFIG["UPSCALE_OUTPUT_DIR"])
        self.processed_log_path = Path(CONFIG["PROCESSED_LOG"])
        
        # Create output directory
        self.upscale_output_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize components
        self.npu = NPUOrchestrator(CONFIG["NPU_SERVER"]) if CONFIG["NPU_ENABLED"] else None
        self.upscaler = VulkanUpscaler()
        self.processed_images = self._load_processed_log()
        self.processing_queue = Queue()
        
        print("\n" + "="*70)
        print("NPU-ORCHESTRATED VULKAN UPSCALING WORKFLOW")
        print("="*70)
        print(f"[CONFIG] SD Output: {self.sd_output_dir}")
        print(f"[CONFIG] Upscale Output: {self.upscale_output_dir}")
        print(f"[CONFIG] NPU Server: {'CONNECTED' if self.npu and self.npu.available else 'OFFLINE'}")
        print(f"[CONFIG] Vulkan Device: {CONFIG['VULKAN_DEVICE_ID']} (Radeon VII)")
        print(f"[CONFIG] Upscale Scale: {CONFIG['UPSCALE_SCALE']}x")
        print(f"[CONFIG] Model: {CONFIG['MODEL_NAME']}")
        print("="*70 + "\n")
    
    def _load_processed_log(self) -> Dict:
        """Load log of already processed images"""
        if self.processed_log_path.exists():
            try:
                with open(self.processed_log_path, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {}
    
    def _save_processed_log(self):
        """Save processed images log"""
        with open(self.processed_log_path, 'w') as f:
            json.dump(self.processed_images, f, indent=2)
    
    def _get_file_hash(self, filepath: str) -> str:
        """Get MD5 hash of file"""
        md5 = hashlib.md5()
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                md5.update(chunk)
        return md5.hexdigest()
    
    def _is_processed(self, filepath: str) -> bool:
        """Check if image was already processed"""
        file_hash = self._get_file_hash(filepath)
        return file_hash in self.processed_images
    
    def _mark_processed(self, filepath: str, output_path: str):
        """Mark image as processed"""
        file_hash = self._get_file_hash(filepath)
        self.processed_images[file_hash] = {
            "original": str(filepath),
            "upscaled": str(output_path),
            "timestamp": datetime.now().isoformat(),
            "scale": CONFIG["UPSCALE_SCALE"]
        }
        self._save_processed_log()
    
    def scan_for_new_images(self) -> List[str]:
        """Scan output directory for unprocessed images"""
        new_images = []
        
        for ext in CONFIG["SUPPORTED_FORMATS"]:
            for img_path in self.sd_output_dir.glob(f"*{ext}"):
                # Skip if too small
                if img_path.stat().st_size < CONFIG["MIN_FILE_SIZE_KB"] * 1024:
                    continue
                
                # Skip if already processed
                if self._is_processed(str(img_path)):
                    continue
                
                # Skip if in upscaled subdirectory
                if "upscaled" in str(img_path):
                    continue
                
                new_images.append(str(img_path))
        
        return new_images
    
    def process_batch(self, image_paths: List[str]):
        """Process a batch of images with NPU orchestration"""
        if not image_paths:
            return
        
        print(f"\n[BATCH] Found {len(image_paths)} new images to process")
        
        # NPU Analysis
        if self.npu and self.npu.available:
            print("[NPU] Analyzing batch...")
            analysis = self.npu.analyze_image_batch(image_paths)
            if "npu_analysis" in analysis:
                print(f"[NPU] {analysis['npu_analysis']}")
        
        # Upscale images
        print(f"[UPSCALE] Starting batch upscale on Radeon VII (Vulkan device {CONFIG['VULKAN_DEVICE_ID']})")
        results = self.upscaler.batch_upscale(image_paths, str(self.upscale_output_dir))
        
        # Mark as processed
        for orig, upscaled in zip(image_paths, results):
            self._mark_processed(orig, upscaled)
        
        # Log to NPU
        if self.npu:
            self.npu.log_activity(f"Processed {len(results)} images successfully")
        
        print(f"[COMPLETE] Batch finished: {len(results)}/{len(image_paths)} successful\n")
    
    def run_once(self):
        """Process all existing images once"""
        print("[MODE] Running in single-pass mode...")
        new_images = self.scan_for_new_images()
        
        if not new_images:
            print("[INFO] No new images found to process")
            return
        
        # Process in batches
        for i in range(0, len(new_images), CONFIG["BATCH_SIZE"]):
            batch = new_images[i:i + CONFIG["BATCH_SIZE"]]
            self.process_batch(batch)
            time.sleep(1)  # Brief pause between batches
    
    def run_watch_mode(self):
        """Continuously watch for new images"""
        print("[MODE] Running in watch mode - monitoring for new images...")
        print("[INFO] Press Ctrl+C to stop\n")
        
        class ImageHandler(FileSystemEventHandler):
            def __init__(self, workflow):
                self.workflow = workflow
            
            def on_created(self, event):
                if event.is_directory:
                    return
                
                file_path = Path(event.src_path)
                if file_path.suffix.lower() in CONFIG["SUPPORTED_FORMATS"]:
                    print(f"[DETECTED] New image: {file_path.name}")
                    time.sleep(2)  # Wait for file to be fully written
                    if not self.workflow._is_processed(str(file_path)):
                        self.workflow.processing_queue.put(str(file_path))
        
        # Start file system observer
        event_handler = ImageHandler(self)
        observer = Observer()
        observer.schedule(event_handler, str(self.sd_output_dir), recursive=False)
        observer.start()
        
        # Processing loop
        try:
            batch = []
            while True:
                # Collect images for batch processing
                while not self.processing_queue.empty() and len(batch) < CONFIG["BATCH_SIZE"]:
                    batch.append(self.processing_queue.get())
                
                # Process batch
                if batch:
                    self.process_batch(batch)
                    batch = []
                
                time.sleep(2)
                
        except KeyboardInterrupt:
            print("\n[STOP] Shutting down...")
            observer.stop()
        
        observer.join()

# ============================================================================
# MAIN
# ============================================================================

def main():
    print("\n" + "="*70)
    print("NPU-ORCHESTRATED VULKAN UPSCALING SYSTEM")
    print("Strix Point NPU + Radeon VII 16GB + RTX 4070")
    print("="*70 + "\n")
    
    # Check Real-ESRGAN installation
    if not Path(CONFIG["REALESRGAN_PATH"]).exists():
        print("[ERROR] Real-ESRGAN not found!")
        print("\nTo install Real-ESRGAN (ncnn-vulkan):")
        print("1. Download from: https://github.com/xinntao/Real-ESRGAN/releases")
        print("2. Extract and update REALESRGAN_PATH in this script")
        print("3. Make sure you download the 'ncnn-vulkan' version (not CUDA)\n")
        return
    
    # Initialize workflow
    workflow = UpscalingWorkflow()
    
    # Choose mode
    if len(sys.argv) > 1 and sys.argv[1] == "--once":
        workflow.run_once()
    else:
        if CONFIG["AUTO_WATCH"]:
            workflow.run_watch_mode()
        else:
            workflow.run_once()

if __name__ == "__main__":
    main()
