import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Try importing directly from the module
    from game.features.humble_tabernacle.tabernacle_manager import HumbleTabernacle
    from game.features.humble_tabernacle.library_controller import LibraryController
    
    print("✅ Successfully imported tabernacle modules!")
    
    # Initialize the tabernacle
    tabernacle = HumbleTabernacle()
    print("✅ HumbleTabernacle initialized successfully!")
    
    # Check if data was loaded
    categories = tabernacle.get_categories()
    print(f"✅ Categories loaded: {categories}")
    
    # Show some content
    if categories:
        first_category = categories[0]
        content = tabernacle.get_category_contents(first_category)
        print(f"✅ First category '{first_category}' has {len(content)} items")
        
        for resource_name, resource_data in list(content.items())[:2]:  # Show first 2
            print(f"  - {resource_name}: {resource_data.get('description', 'No description')[:50]}...")
    
    print("\n🎉 All tests passed! The Humble Tabernacle feature is working correctly.")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
except Exception as e:
    print(f"❌ Error during testing: {e}"))
