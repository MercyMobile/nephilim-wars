# game/features/humble_tabernacle/__init__.py
from .tabernacle_manager import HumbleTabernacle
from .library_controller import LibraryController

def initialize_humble_tabernacle():
    """Initialize the Humble Tabernacle feature"""
    tabernacle = HumbleTabernacle()
    controller = LibraryController(tabernacle)
    return controller