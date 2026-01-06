import json
import os

# Check if all data files exist and are valid
data_dir = "game/features/humble_tabernacle/data"

files_to_check = [
    "temple_library.json",
    "liturgical_texts.json", 
    "sectarian_works.json",
    "archaeology.json"
]

print("Checking data files...")
for filename in files_to_check:
    filepath = os.path.join(data_dir, filename)
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"✅ {filename}: Valid JSON ({len(data)} entries)")
        except Exception as e:
            print(f"❌ {filename}: Invalid JSON - {e}")
    else:
        print(f"❌ {filename}: File not found")

print("\nDirectory structure check:")
try:
    print(f"Data directory exists: {os.path.exists(data_dir)}")
    if os.path.exists(data_dir):
        contents = os.listdir(data_dir)
        print(f"Contents: {contents}")
except Exception as e:
    print(f"Error checking directory: {e}")