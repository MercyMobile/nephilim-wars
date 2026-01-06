import json
import os

class HumbleTabernacle:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), 'data')
        self.library = self.load_library()
        
    def load_library(self):
        """Load all spiritual resources from JSON files"""
        library = {}
        try:
            # Load canonical library
            with open(os.path.join(self.data_dir, 'temple_library.json'), 'r', encoding='utf-8') as f:
                library['Canonical_Temple_Library'] = json.load(f)
            
            # Load liturgical texts
            with open(os.path.join(self.data_dir, 'liturgical_texts.json'), 'r', encoding='utf-8') as f:
                library['Liturgical_Ritual_Texts'] = json.load(f)
                
            # Load sectarian works
            with open(os.path.join(self.data_dir, 'sectarian_works.json'), 'r', encoding='utf-8') as f:
                library['Sectarian_Apocryphal_Works'] = json.load(f)
                
            # Load archaeology
            with open(os.path.join(self.data_dir, 'archaeology.json'), 'r', encoding='utf-8') as f:
                library['Archaeological_Corroboration'] = json.load(f)
                
        except Exception as e:
            print(f"Error loading library: {e}")
            print("Creating empty library as fallback...")
            # Return empty library if files missing or corrupted
            library = {
                'Canonical_Temple_Library': {},
                'Liturgical_Ritual_Texts': {},
                'Sectarian_Apocryphal_Works': {},
                'Archaeological_Corroboration': {}
            }
        return library
        
    def get_categories(self):
        return list(self.library.keys())
        
    def get_category_contents(self, category):
        return self.library.get(category, {})
        
    def search_resources(self, query):
        """Search across all categories for query"""
        results = []
        for category, contents in self.library.items():
            for resource_name, resource_data in contents.items():
                if query.lower() in resource_name.lower() or \
                   any(query.lower() in str(value).lower() for value in resource_data.values()):
                    results.append({
                        'category': category,
                        'resource': resource_name,
                        'data': resource_data
                    })
        return results