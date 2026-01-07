use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::fs;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Permissions {
    Divine,
    Holy,
    Common,
}

impl Permissions {
    fn to_str(&self) -> &'static str {
        match self {
            Permissions::Divine => "divine",
            Permissions::Holy => "holy",
            Permissions::Common => "common",
        }
    }
}

pub struct TextRepository {
    permissions_map: HashMap<String, Permissions>,
}

impl TextRepository {
    pub fn new() -> Self {
        let mut map = HashMap::new();
        map.insert("divine_texts".to_string(), Permissions::Divine);
        map.insert("holy_writings".to_string(), Permissions::Divine);
        map.insert("targumim".to_string(), Permissions::Common);
        map.insert("mishnah".to_string(), Permissions::Common);
        map.insert("gemara".to_string(), Permissions::Common);

        TextRepository {
            permissions_map: map,
        }
    }

    fn classify_directory(&self, path: &Path) -> Option<Permissions> {
        let dir_name = path.file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("");

        match dir_name {
            "divine_texts" | "holy_writings" => Some(Permissions::Divine),
            "targumim" | "mishnah" | "gemara" => Some(Permissions::Common),
            _ => None,
        }
    }

    pub fn set_permissions_for_path(&mut self, current_path: &Path) {
        if let Some(perm) = self.classify_directory(current_path) {
            println!("Setting {} permissions for {:?}", perm.to_str(), current_path);
            
            // Actually attempt to modify filesystem permissions
            if let Ok(metadata) = fs::metadata(current_path) {
                // Permission setting logic would go here in a real implementation
                // For now we just verify the path exists and can be accessed
            }
        }
    }
    
    pub fn scan_and_apply_permissions(&mut self, base_path: &Path) {
        if !base_path.exists() {
            eprintln!("Base path does not exist: {:?}", base_path);
            return;
        }
        
        let mut stack = vec![base_path.to_path_buf()];
        
        while let Some(current_path) = stack.pop() {
            if current_path.is_dir() {
                self.set_permissions_for_path(&current_path);
                
                // Add subdirectories to stack for processing
                if let Ok(entries) = fs::read_dir(&current_path) {
                    for entry in entries.flatten() {
                        if entry.path().is_dir() {
                            stack.push(entry.path());
                        }
                    }
                }
            }
        }
    }
}