# AMD Ryzen™ AI Software Reference

> Source: https://github.com/dwithchenna/RyzenAI-SW
> Cloned from: https://github.com/amd/RyzenAI-SW

---

## Introduction

AMD Ryzen™ AI Software includes the tools and runtime libraries for optimizing and deploying AI inference on your [AMD Ryzen™ AI](https://www.amd.com/en/products/processors/consumer/ryzen-ai.html) based PC. It enables developers to quickly build and run a variety of AI applications for Ryzen™ AI. It is designed with high efficiency and ease-of-use in mind, unleashing the full potential of AI acceleration on Ryzen™ AI.

This repository contains the demos, examples and tutorials, demonstrating usage and capabilities of the Ryzen™ AI Software. It is a subset of the Ryzen™ AI Software release.

**Installation:** Follow the instructions at [Ryzen™ AI Software](https://ryzenai.docs.amd.com/en/latest/inst.html)

---

## Git LFS and Instructions to Clone

Due to the presence of large files in some examples/tutorials, Git Large File Storage (LFS) has been configured in this repository.

### Setup Instructions:

1. Install Git LFS by downloading it from the [official website](https://git-lfs.com/)

2. After installation, run the following command to set up Git LFS:
```bash
git lfs install
```

3. Clone the repository:
```bash
git clone https://github.com/amd/RyzenAI-SW.git
```

4. Pull the actual LFS files:
```bash
git lfs pull
```

---

## Getting Started Tutorials

| Tutorial | Path |
|----------|------|
| Fine-tuned ResNet model | `CNN-examples/getting_started_resnet` |
| Hello world jupyter notebook | `CNN-examples/hello_world` |
| ResNet50 example on iGPU | `CNN-examples/iGPU/getting_started` |

---

## LLM Flow

| Example | Path |
|---------|------|
| LLMs on RyzenAI with ONNX Runtime GenAI API | `LLM-examples/oga_api` |
| ONNX Runtime GenAI(OGA)‑based RAG LLM | `LLM-examples/RAG-OGA` |
| Vision Language Model (VLM) on RyzenAI NPU | `LLM-examples/VLM` |
| Running GPT-OSS-20B with chat template | `LLM-examples/oga_inference` |

---

## Examples

### BF16 Model Examples
- **Finetuned DistilBERT for Text Classification:** `Transformer-examples/DistilBERT_text_classification_bf16`
- **Image classification:** `CNN-examples/image_classification`

### Other Examples
- **Object detection with Yolov8 models:** `CNN-examples/object_detection`
- **Automatic Speech Recognition (Whisper-base on NPU):** `Transformer-examples/ASR/Whisper-AI`

---

## Demos

| Demo | Path |
|------|------|
| NPU-GPU pipeline on RyzenAI | `Demos/NPU-GPU-Pipeline` |
| Automatic Speech Recognition using OpenAI Whisper | `Demos/ASR/Whisper` |

---

## Other Tutorials

- **AMD Quark Quantization:** `CNN-examples/quark_quantization`
- **Ryzen AI CVML library application:** `Ryzen-AI-CVML-Library`
- **Torchvision models End-to-End inference:** `CNN-examples/torchvision_inference`

---

## Benchmarking

- **ONNX benchmark utilities:** `onnx-benchmark`

---

## Reference Links

- [Ryzen™ AI Developer Guide](https://ryzenai.docs.amd.com/en/latest)
- [ONNX Runtime Vitis-AI EP](https://onnxruntime.ai/docs/execution-providers/Vitis-AI-ExecutionProvider.html)
- [AMD AI Developer Forum](https://community.amd.com/t5/ai/ct-p/amd_ai)

---

## Relevance to Nephilim Wars Project

This reference is stored for potential integration with:

1. **NPU Acceleration** - Ryzen AI NPU can accelerate AI inference for:
   - Character image generation pipelines
   - Voice/speech processing for NPC dialogue
   - Real-time AI opponent decision-making

2. **LLM Integration** - The LLM examples could enable:
   - Dynamic NPC dialogue generation
   - Procedural quest generation
   - Interactive storytelling

3. **Vision Models (VLM)** - Could support:
   - Image analysis features
   - Visual content understanding

4. **ONNX Runtime** - For deploying optimized models in the game

### Your Hardware Context
Based on the system specifications:
- **AMD Ryzen NPU** - VitisAI Execution Provider available
- **AMD Radeon VII (16GB VRAM)** - DirectML support
- **NVIDIA RTX 4070 Laptop GPU** - CUDA support

This allows hybrid AI execution across multiple devices.

---

*Stored: 2025-02-28*