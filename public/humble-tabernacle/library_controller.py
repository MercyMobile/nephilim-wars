
class LibraryController:
    def __init__(self, tabernacle_manager):
        self.tabernacle = tabernacle_manager
        
    def display_category(self, category_name):
        contents = self.tabernacle.get_category_contents(category_name)
        # Render UI for category view
        return contents
        
    def display_resource_details(self, resource_name):
        # Show detailed information about specific text
        pass
        
    def search_resources(self, query):
        return self.tabernacle.search_resources(query)