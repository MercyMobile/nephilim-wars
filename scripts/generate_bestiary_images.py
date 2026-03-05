#!/usr/bin/env python3
"""
Nephilim Wars - Bestiary Image Generator
Uses FLUX.2-klein-4B (GGUF) via stable-diffusion.cpp for bulk image generation

FLUX.2 PROMPTING GUIDE:
- CFG scale: 1.0 (FLUX works well with low CFG)
- Steps: 4 (FLUX.2-klein is distilled, works with very few steps)
- Scheduler: euler (default for FLUX models)
- Negative prompts: Not used (constraints go in positive prompt)
- Prompt length: 80-250 words optimal
- Structure: [Shot & subject] + [Appearance] + [Clothing] + [Environment] +
             [Lighting] + [Mood] + [Style] + [Quality constraints]

Usage:
    python generate_bestiary_images.py [--start INDEX] [--count N] [--category CATEGORY]

Examples:
    python generate_bestiary_images.py                    # Generate all
    python generate_bestiary_images.py --start 0 --count 5 # Generate first 5
    python generate_bestiary_images.py --category fallen    # Fallen demons only

Hardware:
    Set GGML_VK_VISIBLE_DEVICES=1 for Radeon VII (device 0=890M iGPU, 1=Radeon VII, 2=RTX 4070)
"""

import subprocess
import argparse
import os
from pathlib import Path
from datetime import datetime

# ============================================================================
# CONFIGURATION
# ============================================================================

# Paths - FLUX.2-klein-4B with Qwen3 text encoder
SD_CLI_PATH = Path(r"C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe")
DIFFUSION_MODEL = Path(r"C:\Users\velez\Downloads\flux-2-klein-4b-Q8_0.gguf")
VAE_MODEL = Path(r"C:\Users\velez\Downloads\ae.safetensors")
LLM_ENCODER = Path(r"C:\Users\velez\Downloads\qwen3-4b-abl-q4_0.gguf")
OUTPUT_DIR = Path(r"C:\Code\nephilim-wars\public\images\bestiary")

# Generation settings - OPTIMIZED for FLUX.2-klein-4B
DEFAULT_WIDTH = 1024
DEFAULT_HEIGHT = 640  # ~8:5 aspect ratio for card art
DEFAULT_STEPS = 4  # FLUX.2-klein is distilled, works with 4 steps
DEFAULT_CFG = 1.0  # FLUX works well with low CFG
DEFAULT_SEED = -1  # Random seed
SCHEDULER = "euler"  # FLUX models use euler scheduler

# Optimal args for Radeon VII 16GB - VAE tiling prevents memory issues
EXTRA_ARGS = ["--vae-tiling", "--diffusion-fa"]

# Negative prompt is not used by FLUX - constraints go in positive prompt
NEGATIVE_PROMPT = ""

CATEGORIES = [
    "archangel",
    "high_angel",
    "angel_of_death",
    "fallen",
    "combat",
    "legendary",
    "corrupted",
]

# ============================================================================
# BESTIARY PROMPTS
# Following Z-Image Turbo structure:
# [Shot & subject] + [Appearance] + [Clothing] + [Environment] +
# [Lighting] + [Mood] + [Style] + [Quality constraints]
# ============================================================================

BESTIARY_PROMPTS = {
    # =====================
    # ARCHANGELS - Holy Divine Warriors
    # Z-Image Turbo prompt structure: [Shot & subject] + [Appearance] + [Clothing/armor]
    # + [Environment] + [Lighting] + [Mood] + [Style] + [Quality constraints]
    # Key: Explicit "no horns, no demonic features, angelic not demonic" for angels
    # =====================
    "michael": {
        "name": "Michael - Archangel Warrior",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Michael as a holy 
divine warrior, adult male angelic figure with pristine silver-white armor, massive flaming 
sword raised triumphantly, large feathered wings spread wide behind him, bright blue eyes 
with holy intensity, short silver hair swept back, handsome heroic face, descending through 
storm clouds with golden divine light breaking through, heavenly battlefield in background, 
dramatic heroic lighting with bright highlights and deep shadows, epic divine warrior mood, 
highly detailed oil painting style, sharp focus on face and sword, no blur, no grain, no 
watermark, no text, no logos, no horns, no demonic features, angelic not demonic, holy 
warrior aesthetic""",
        "category": "archangel",
        "filename": "Michael.png",
    },
    "gabriel": {
        "name": "Gabriel - Divine Herald",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Gabriel as a holy 
divine herald, adult male angelic figure with gleaming silver-white armor and ornate trumpet, 
serene noble expression, long flowing golden-white hair, large feathered wings spread behind, 
handsome radiant face, standing before celestial gates with divine golden light breaking 
through clouds, dramatic heroic lighting, heavenly messenger mood, highly detailed oil painting 
style, sharp focus on face and trumpet, no blur, no grain, no watermark, no text, no logos, 
no horns, no demonic features, angelic not demonic, holy herald aesthetic""",
        "category": "archangel",
        "filename": "Gabriel.png",
    },
    "raphael": {
        "name": "Raphael - Celestial Healer",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Raphael as a holy 
celestial healer, adult male angelic figure in flowing green and white robes, golden staff 
with coiled serpent healing symbol, gentle compassionate expression, large feathered wings 
folded peacefully behind, handsome serene face, standing by healing waters with soft divine 
light, warm caring atmosphere, highly detailed oil painting style, sharp focus on face and 
staff, no blur, no grain, no watermark, no text, no logos, no horns, no demonic features, 
angelic not demonic, holy healer aesthetic""",
        "category": "archangel",
        "filename": "Raphael.png",
    },
    "uriel": {
        "name": "Uriel - Angel of Light",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Uriel as a holy 
guardian of Eden, adult male angelic figure with entire form radiating divine fire, massive 
flaming sword held before him, intense wise gaze, short golden hair, large feathered wings 
wreathed in light behind, handsome powerful face, standing before Eden's gates with flames, 
dramatic divine fire lighting, fierce guardian mood, highly detailed oil painting style, sharp 
focus on face and sword, no blur, no grain, no watermark, no text, no logos, no horns, no 
demonic features, angelic not demonic, holy guardian aesthetic""",
        "category": "archangel",
        "filename": "Uriel.png",
    },
    "sariel": {
        "name": "Sariel - Angel of Judgment",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Sariel as a holy 
judge of souls, adult male angelic figure in silver robes with moon symbols, holding scales 
of judgment, stern but fair expression, large feathered wings against night sky behind, 
handsome dignified face, standing in judgment with silver starlight, cold moonlit atmosphere, 
highly detailed oil painting style, sharp focus on face and scales, no blur, no grain, no 
watermark, no text, no logos, no horns, no demonic features, angelic not demonic, holy judge 
aesthetic""",
        "category": "archangel",
        "filename": "Sariel.png",
    },
    "raguel": {
        "name": "Raguel - Angel of Justice",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Raguel as a holy 
enforcer of divine order, adult male angelic figure in judicial robes of deep blue and gold, 
holding balanced scales, stern impartial expression, large feathered wings spread behind, 
handsome authoritative face, standing amid cosmic order with sun moon and stars, royal justice 
lighting, highly detailed oil painting style, sharp focus on face and scales, no blur, no 
grain, no watermark, no text, no logos, no horns, no demonic features, angelic not demonic, 
holy justice aesthetic""",
        "category": "archangel",
        "filename": "Raguel.png",
    },
    "remiel": {
        "name": "Remiel - Angel of Resurrection",
        "prompt": """A medium-shot fantasy card art portrait of Archangel Remiel as a holy 
herald of resurrection, adult male angelic figure in white robes, trumpet of resurrection 
at side, gentle compassionate expression, large feathered wings spread behind, handsome 
hopeful face, watching over rising souls with dawn light breaking through, transcendent 
reassurance mood, highly detailed oil painting style, sharp focus on face, no blur, no 
grain, no watermark, no text, no logos, no horns, no demonic features, angelic not demonic, 
holy resurrection aesthetic""",
        "category": "archangel",
        "filename": "Remiel.png",
    },
    # =====================
    # HIGH ANGELS
    # =====================
    "metatron": {
        "name": "Metatron - Celestial Scribe",
        "prompt": """A medium-shot fantasy card art portrait of Metatron the celestial scribe, 
adult male angelic transformed Enoch figure radiating transcendent wisdom, seated beside 
heavenly throne writing in massive celestial book, multiple large feathered wings spread 
majestically behind, crown of light upon head, handsome wise face, sapphire blue and brilliant 
white robes, heavenly academy atmosphere with mystic light, highly detailed oil painting 
style, sharp focus on face and book, no blur, no grain, no watermark, no text, no logos, no 
horns, no demonic features, angelic not demonic, holy scribe aesthetic""",
        "category": "high_angel",
        "filename": "Metatron.png",
    },
    "razie": {
        "name": "Raziel - Keeper of Mysteries",
        "prompt": """A medium-shot fantasy card art portrait of Raziel the angel of divine 
secrets, adult male angelic figure partially veiled in light, holding sealed tome, profound 
esoteric knowledge in eyes, large feathered wings behind, handsome mysterious face, standing 
near divine throne, deep purple and midnight blue robes with golden symbols, cryptic 
celestial writing in background, highly detailed oil painting style, sharp focus on face and 
tome, no blur, no grain, no watermark, no text, no horns, no demonic features, angelic not 
demonic, holy mystery aesthetic""",
        "category": "high_angel",
        "filename": "Raziel.png",
    },
    # =====================
    # ANGEL OF DEATH
    # =====================
    "azrael": {
        "name": "Azrael - Soul Separator",
        "prompt": """A medium-shot fantasy card art portrait of Azrael the angel of death, 
adult male angelic figure with massive solemn presence, enormous dark feathered wings 
spanning wide, sword of separation at side, scroll of names in hand, compassionate yet 
inevitable expression, handsome face both stern and kind, standing at threshold between 
worlds, deep blacks and grey with silver moonlight, respectful holy portrayal, highly 
detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, no text, 
no logos, no horns, no demonic features, angelic not demonic""",
        "category": "angel_of_death",
        "filename": "Azrael.png",
    },
    # =====================
    # DEMONS AND FALLEN - Dark aesthetic is intended here
    # =====================
    "sammael": {
        "name": "Satan - The Adversary",
        "prompt": """A medium-shot fantasy card art portrait of Satan the adversary, adult 
male once-beautiful archangel now fallen, powerful masculine dark angelic form with corrupted 
golden wings, strong angular masculine face with prideful defiant expression, standing in 
heavenly court pointing accusing finger, black and deep red with traces of former glory, 
courtroom of heaven background with divine light opposing him, adversarial atmosphere, 
highly detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, 
no text, no logos, no feminine features, no makeup, masculine male only, dark fallen angel 
aesthetic""",
        "category": "fallen",
        "filename": "Sammael.png",
    },
    "semyaza": {
        "name": "Semyaza - Fallen Watcher Leader",
        "prompt": """A medium-shot fantasy card art portrait of Semyaza the fallen Watcher 
leader, adult male fallen angel with rugged masculine weathered face, strong angular 
jawline, rough stubble, piercing grey sunken eyes, short messy dark hair, broad 
muscular male warrior physique, standing on Mount Hermon peak at twilight, massive 
tattered dark grey wings spread behind him, divine golden chains binding his wrists 
together, wearing torn remnants of celestial silver robes charred and darkened, storm 
clouds gathering in amber twilight sky, ancient bronze mountain rocks beneath his feet, 
imposing masculine presence of the angel who led 200 Watchers into rebellion, harsh 
dramatic side lighting casting deep shadows, dark biblical fantasy card art style, 
sharp focus on his stern masculine face, no blur, no grain, no watermark, no text, no 
logos, no horns, no feminine features, no makeup, no female face, no soft features, 
masculine male man only""",
        "category": "fallen",
        "filename": "Semyaza.png",
    },
    "azazel": {
        "name": "Azazel - Scapegoat Demon",
        "prompt": """A medium-shot fantasy card art portrait of Azazel bound in desert 
wilderness, adult male fallen angel with rugged masculine face chained in rugged canyon of 
Dudael, sharp jagged rocks surrounding in darkness, goat-like features emerging on masculine 
face, artisan of weapons with swords and shields scattered nearby, harsh desert colors of 
rust brown ochre and black, eternal punishment atmosphere, highly detailed oil painting 
style, sharp focus on face, no blur, no grain, no watermark, no text, no logos, no feminine 
features, no makeup, masculine male only, dark demon aesthetic""",
        "category": "fallen",
        "filename": "Azazel.jpg",
    },
    "lilith": {
        "name": "Lilith - Night Demon Queen",
        "prompt": """A medium-shot fantasy card art portrait of Lilith the queen of night 
demons, adult female with beautiful seductive appearance, owl wings spread against moon, 
long flowing dark hair, predatory alluring expression, standing in desert night wilderness, 
midnight blue and black with silver moonlight, pre-Raphaelite dark fantasy style, sharp 
focus on face, no blur, no grain, no watermark, no text, no logos, dark demon queen 
aesthetic""",
        "category": "fallen",
        "filename": "Lilith.png",
    },
    "asmodeus": {
        "name": "Asmodeus - Destroyer of Marriages",
        "prompt": """A medium-shot fantasy card art portrait of Asmodeus the demon of lust, 
adult male handsome yet sinister figure with strong masculine features, three heads visible 
(bull ram and man central masculine face), riding dragon, holding cup of wine, fiery breath 
visible, sensual red purple and gold color scheme, dangerous seduction atmosphere, highly 
detailed oil painting style, sharp focus on central male face, no blur, no grain, no 
watermark, no text, no logos, no feminine features, no makeup, masculine male only, dark 
demon aesthetic""",
        "category": "fallen",
        "filename": "Asmodeus.png",
    },
    "belial": {
        "name": "Belial - Spirit of Lawlessness",
        "prompt": """A medium-shot fantasy card art portrait of Belial the prince of 
lawlessness, adult male elegant fallen angel with smooth deceptive masculine beauty, strong 
jaw and handsome masculine features, courtier's appearance seated on throne of counsel, empty 
worthless scales in hand, two-faced nature with outward beauty but inner corruption showing, 
false white fading to grey, corrupt court atmosphere, highly detailed oil painting style, 
sharp focus on masculine face, no blur, no grain, no watermark, no text, no logos, no 
feminine features, no makeup, masculine male only, dark demon aesthetic""",
        "category": "fallen",
        "filename": "Belial.png",
    },
    "mastema": {
        "name": "Mastema - Accuser of Spirits",
        "prompt": """A medium-shot fantasy card art portrait of Mastema the prince of evil 
spirits, adult male prosecutorial demon figure with sharp masculine features standing in 
judgment, pointing with accusing finger, holding ledger of sins, commanding hosts of evil 
spirits, dark formal masculine appearance, dark red and black with pale accusation colors, 
adversarial justice theme, highly detailed oil painting style, sharp focus on male face, 
no blur, no grain, no watermark, no text, no logos, no feminine features, no makeup, 
masculine male only""",
        "category": "fallen",
        "filename": "Mastema.png",
    },
    "abaddon": {
        "name": "Abaddon - Angel of the Abyss",
        "prompt": """A medium-shot fantasy card art portrait of Abaddon the angel of the 
bottomless pit, adult male terrifying figure with masculine angular features emerging from 
smoke, key to abyss in hand, leading army of locust creatures with scorpion stingers behind, 
crown upon head, smoke and sulphur atmosphere, black smoke grey and locust brown with sulphur 
yellow, apocalyptic horror scene, highly detailed oil painting style, sharp focus on male 
face, no blur, no grain, no watermark, no text, no logos, no feminine features, masculine 
male only, dark demonic aesthetic""",
        "category": "fallen",
        "filename": "Abaddon.png",
    },
    "gadreel": {
        "name": "Gadreel - Serpent Tempter",
        "prompt": """A medium-shot fantasy card art portrait of Gadreel the tempter and 
weapons teacher, adult male deceptive angelic beauty with handsome masculine features, strong 
jaw and alluring masculine expression, serpent imagery woven throughout, standing in Eden 
offering forbidden fruit, tools of corruption and deception surrounding, tarnished gold and 
serpent scales with deceptive green, betrayal and corruption themes, highly detailed oil 
painting style, sharp focus on masculine face and hand with fruit, no blur, no grain, no 
watermark, no text, no logos, no feminine features, no makeup, masculine male only, dark 
fallen angel aesthetic""",
        "category": "fallen",
        "filename": "Gadreel.png",
    },
    "prince_of_persia": {
        "name": "Prince of Persia - Territorial Spirit",
        "prompt": """A medium-shot fantasy card art portrait of Prince of Persia the 
territorial spirit, adult male Persian king imagery with strong masculine jaw and demonic 
aspects, royal Persian regalia with crown and throne, warrior-demon of great power, spiritual 
battle scene, imperial purple and gold with crimson, spiritual warfare atmosphere, highly 
detailed oil painting style, sharp focus on masculine face, no blur, no grain, no watermark, 
no text, no logos, no feminine features, masculine male only, dark demon aesthetic""",
        "category": "fallen",
        "filename": "prince_persia.png",
    },
    # =====================
    # COMBAT CREATURES - NEPHILIM AND GIANTS
    # =====================
    "nephilim_warrior": {
        "name": "Nephilim Warrior",
        "prompt": """A full-body fantasy card art portrait of Nephilim Warrior, 12-15 foot 
tall giant offspring of Watchers and human women, immense muscular bronze-age warrior with 
brutal masculine features, wielding massive bronze greatsword with both hands, six-fingered 
hands visible, primitive bronze armor, wild predatory masculine expression, standing before 
ancient city walls, battlefield of ancient Canaan with dust and smoke, overwhelming physical 
presence, umber sienna and bronze palette, highly detailed oil painting style, sharp focus 
on face and sword, no blur, no grain, no watermark, no text, no logos, no feminine 
features, masculine male man warrior only""",
        "category": "combat",
        "filename": "nephilim_warrior.png",
    },
    "rephaim_champion": {
        "name": "Rephaim Champion",
        "prompt": """A full-body fantasy card art portrait of Rephaim Champion, ancient 
undying giant warrior from before Flood,ghostly pale emaciated but immensely powerful adult 
male with gaunt masculine features, ancient weathered armor, massive spiked war club resting 
on shoulder, spectral deathly aura with Spirit Sight glowing in eyes, standing among burial 
ruins, shadowy background, ashen grey and faded bronze with spectral white, highly detailed 
oil painting style, sharp focus on masculine face, no blur, no grain, no watermark, no text, 
no logos, no feminine features, masculine male only""",
        "category": "combat",
        "filename": "rephaim_champion.png",
    },
    "anakim_berserker": {
        "name": "Anakim Berserker",
        "prompt": """A full-body fantasy card art portrait of Anakim Berserker, 12-15 foot 
tall giant descendant of Anak, towering adult male warrior with fierce masculine features in 
battle frenzy, dual bronze axes raised, chains wrapped around arms, wild berserker masculine 
expression with madness in eyes, minimal armor battle-crazed, standing in mountain fortress, 
dark bronze rust and blood colors, uncontrollable battle rage, highly detailed oil painting 
style, sharp focus on masculine face, no blur, no grain, no watermark, no text, no logos, 
no feminine features, masculine male only""",
        "category": "combat",
        "filename": "anakim_berserker.png",
    },
    "cainite_assassin": {
        "name": "Cainite Assassin",
        "prompt": """A full-body fantasy card art portrait of Cainite Assassin, adult male 
descendant of Cain with sharp masculine features marked by violence, stealthy dangerous male 
figure in shadow, poisoned daggers in hands, mark of Cain visible on forehead, slinking 
through ancient passages, shadow blacks and muted earth with poison green accents, predatory 
cunning assassin masculine pose, highly detailed oil painting style, sharp focus on masculine 
face, no blur, no grain, no watermark, no text, no logos, no feminine features, masculine 
male only""",
        "category": "combat",
        "filename": "cainite_assassin.png",
    },
    "sorcerer_priest": {
        "name": "Sorcerer-Priest of Babylon",
        "prompt": """A full-body fantasy card art portrait of Sorcerer-Priest of Babylon, 
adult male corrupted priest with angular masculine features channeling forbidden demonic 
power, elaborate Mesopotamian priestly robes with corrupted sacred symbols, holding staff 
of dark magic, channeling eldritch bolt, standing atop ziggurat under strange stars, corrupt 
purple and bloody red with midnight blue, highly detailed oil painting style, sharp focus 
on masculine face and staff, no blur, no grain, no watermark, no text, no logos, no feminine 
features, masculine male only""",
        "category": "combat",
        "filename": "sorcerer_priest.png",
    },
    "horim_tunneler": {
        "name": "Horim Tunneler",
        "prompt": """A full-body fantasy card art portrait of Horim Tunneler, adult male 
cave-dwelling warrior with rugged masculine features adapted to darkness, pale from 
underground life but wiry strong, stone mace raised, superior darkvision with glowing eyes, 
emerging from tunnel entrance, earth tones and pale flesh with mineral colors, subterranean 
predator atmosphere, highly detailed oil painting style, sharp focus on masculine face, no 
blur, no grain, no watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "combat",
        "filename": "horim_tunneler.png",
    },
    "gibborim_elite": {
        "name": "Gibborim Elite Guard",
        "prompt": """A full-body fantasy card art portrait of Gibborim Elite Guard, adult 
male mighty man of renown legendary warrior with heroic masculine bearing, battle-scarred 
veteran, elite bronze armor and heroic spear, standing guard at ancient citadel, battle-worn 
bronze and red with weathered leather, heroic gold accents, elite champion masculine presence, 
highly detailed oil painting style, sharp focus on masculine face, no blur, no grain, no 
watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "combat",
        "filename": "gibborim_elite.png",
    },
    "gammadim_tunneler": {
        "name": "Gammadim Tunnel-Fighter",
        "prompt": """A full-body fantasy card art portrait of Gammadim Tunnel-Fighter, 
small adult male fierce warrior with wiry masculine frame adapted for confined spaces, wiry 
agile frame, tunnel pick in hand sling at belt, fighting in narrow passage, earth tones and 
shadow with stone colors, David vs Goliath tactics, underdog warrior masculine atmosphere, 
highly detailed oil painting style, sharp focus on masculine face, no blur, no grain, no 
watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "combat",
        "filename": "gammadim_tunneler.png",
    },
    "rephaim_champion": {
        "name": "Rephaim Champion",
        "prompt": """A full-body fantasy card art portrait of Rephaim Champion, ancient 
undying giant warrior from before Flood, ghostly pale emaciated but immensely powerful 
adult male, ancient weathered armor, massive spiked war club resting on shoulder, spectral 
deathly aura with Spirit Sight glowing in eyes, standing among burial ruins, shadowy 
background, ashen grey and faded bronze with spectral white, highly detailed oil painting 
style, sharp focus on face, no blur, no grain, no watermark, no text, no logos""",
        "category": "combat",
        "filename": "rephaim_champion.png",
    },
    "anakim_berserker": {
        "name": "Anakim Berserker",
        "prompt": """A full-body fantasy card art portrait of Anakim Berserker, 12-15 foot 
tall giant descendant of Anak, towering adult male warrior in battle frenzy, dual bronze 
axes raised, chains wrapped around arms, wild berserker expression with madness in eyes, 
minimal armor battle-crazed, standing in mountain fortress, dark bronze rust and blood 
colors, uncontrollable battle rage, highly detailed oil painting style, sharp focus on 
face, no blur, no grain, no watermark, no text, no logos""",
        "category": "combat",
        "filename": "anakim_berserker.png",
    },
    "cainite_assassin": {
        "name": "Cainite Assassin",
        "prompt": """A full-body fantasy card art portrait of Cainite Assassin, adult male 
descendant of Cain marked by violence, stealthy dangerous figure in shadow, poisoned 
daggers in hands, mark of Cain visible on forehead, slinking through ancient passages, 
shadow blacks and muted earth with poison green accents, predatory cunning assassin pose, 
highly detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, 
no text, no logos""",
        "category": "combat",
        "filename": "cainite_assassin.png",
    },
    "sorcerer_priest": {
        "name": "Sorcerer-Priest of Babylon",
        "prompt": """A full-body fantasy card art portrait of Sorcerer-Priest of Babylon, 
adult male corrupted priest channeling forbidden demonic power, elaborate Mesopotamian 
priestly robes with corrupted sacred symbols, holding staff of dark magic, channeling 
eldritch bolt, standing atop ziggurat under strange stars, corrupt purple and bloody 
red with midnight blue, highly detailed oil painting style, sharp focus on face and staff, 
no blur, no grain, no watermark, no text, no logos""",
        "category": "combat",
        "filename": "sorcerer_priest.png",
    },
    "horim_tunneler": {
        "name": "Horim Tunneler",
        "prompt": """A full-body fantasy card art portrait of Horim Tunneler, adult male 
cave-dwelling warrior adapted to darkness, pale from underground life but wiry strong, 
stone mace raised, superior darkvision with glowing eyes, emerging from tunnel entrance, 
earth tones and pale flesh with mineral colors, subterranean predator atmosphere, highly 
detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, no 
text, no logos""",
        "category": "combat",
        "filename": "horim_tunneler.png",
    },
    "gibborim_elite": {
        "name": "Gibborim Elite Guard",
        "prompt": """A full-body fantasy card art portrait of Gibborim Elite Guard, adult 
male mighty man of renown legendary warrior, heroic bearing battle-scarred veteran, elite 
bronze armor and heroic spear, standing guard at ancient citadel, battle-worn bronze and 
red with weathered leather, heroic gold accents, elite champion presence, highly detailed 
oil painting style, sharp focus on face, no blur, no grain, no watermark, no text, no logos""",
        "category": "combat",
        "filename": "gibborim_elite.png",
    },
    "gammadim_tunneler": {
        "name": "Gammadim Tunnel-Fighter",
        "prompt": """A full-body fantasy card art portrait of Gammadim Tunnel-Fighter, 
small adult male fierce warrior adapted for confined spaces, wiry agile frame, tunnel 
pick in hand sling at belt, fighting in narrow passage, earth tones and shadow with stone 
colors, David vs Goliath tactics, underdog warrior atmosphere, highly detailed oil painting 
style, sharp focus on face, no blur, no grain, no watermark, no text, no logos""",
        "category": "combat",
        "filename": "gammadim_tunneler.png",
    },
    # =====================
    # LEGENDARY GIANTS
    # =====================
    "ohya": {
        "name": "Ohya - Son of Semyaza",
        "prompt": """A full-body fantasy card art portrait of Ohya firstborn son of Semyaza, 
immense wrathful giant adult male with brutal masculine features and raging expression, 
prophetic dreaming of coming flood, massive bronze-age warrior towering over battlefield, 
battling Leviathan in storm, wrathful masculine expression haunted by prophetic doom, ancient 
warrior regalia, apocalyptic dreamscape with waters rising, wrath red and bronze with stormy 
sky, highly detailed oil painting style, sharp focus on masculine face, no blur, no grain, no 
watermark, no text, no logos, no feminine features, masculine male giant only""",
        "category": "legendary",
        "filename": "Ohya.png",
    },
    "hahya": {
        "name": "Hahya the Contemplative",
        "prompt": """A full-body fantasy card art portrait of Hahya brother of Ohya, massive 
but contemplative giant adult male with thoughtful masculine features, receiving dream visions, 
seated in mountain meditation, dreamy masculine expression with visions, gentler than his 
wrathful brother, mountain retreat background, muted bronze and earth tones with dreamlike 
blue shadows, highly detailed oil painting style, sharp focus on masculine face, no blur, no 
grain, no watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "legendary",
        "filename": "Hahya.png",
    },
    "mahway": {
        "name": "Mahway the Winged",
        "prompt": """A full-body fantasy card art portrait of Mahway the winged giant, adult 
male son of Barakel with masculine angular features, messenger with flight capability, angelic 
heritage visible in wings, carrying message through sky, soaring between heaven and earth, 
messenger scroll in hand, sky tones earth brown with messenger white, aerial freedom urgent 
mission atmosphere, highly detailed oil painting style, sharp focus on masculine face, no 
blur, no grain, no watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "legendary",
        "filename": "Mahway.png",
    },
    "gilgamesh": {
        "name": "Gilgamesh",
        "prompt": """A full-body fantasy card art portrait of Gilgamesh legendary king of Uruk, 
adult male two-thirds divine hero of epic fame with heroic masculine features, wrestling stance 
ready for combat, heroic physique beyond mortal men, strong masculine jaw and powerful build, 
holding lion under arm in traditional imagery, wilderness of ancient Mesopotamia background, 
heroic gold and royal blue with white, highly detailed oil painting style, sharp focus on 
masculine face, no blur, no grain, no watermark, no text, no logos, no feminine features, 
masculine male only""",
        "category": "legendary",
        "filename": "Gilgamesh.png",
    },
    # =====================
    # CORRUPTED HUMANITY
    # =====================
    "baal_priest": {
        "name": "Baal-Priest",
        "prompt": """A medium-shot fantasy card art portrait of Baal-Priest performing blood 
sacrifice, adult male corrupted priest with angular masculine features in Canaanite ritual 
robes, standing before pagan altar with fire and blood, knife raised in dark worship, high 
place with idol behind, blood red and corrupted gold with burnt-black, false priesthood 
atmosphere, highly detailed oil painting style, sharp focus on masculine face and knife, no 
blur, no grain, no watermark, no text, no logos, no feminine features, masculine male only""",
        "category": "corrupted",
        "filename": "baal_priest.png",
    },
    "lamech_avenger": {
        "name": "Lamech the Avenger",
        "prompt": """A medium-shot fantasy card art portrait of Lamech the Cainite king, adult 
male seventh generation from Cain with strong masculine face and royal bearing, marked 
descendant with masculine features, seated on throne of violence, bronze blade at side, 
boasting of vengeance, Cainite city background, royal purple and stained blood red with 
weathered bronze, inherited curse vendetta king masculine atmosphere, highly detailed oil 
painting style, sharp focus on masculine face, no blur, no grain, no watermark, no text, no 
logos, no feminine features, masculine male only""",
        "category": "corrupted",
        "filename": "Lamech.png",
    },
    "hahya": {
        "name": "Hahya the Contemplative",
        "prompt": """A full-body fantasy card art portrait of Hahya brother of Ohya, massive 
but contemplative giant adult male, receiving dream visions, seated in mountain meditation, 
dreamy expression with visions, gentler than his wrathful brother, mountain retreat 
background, muted bronze and earth tones with dreamlike blue shadows, highly detailed oil 
painting style, sharp focus on face, no blur, no grain, no watermark, no text, no logos""",
        "category": "legendary",
        "filename": "Hahya.png",
    },
    "mahway": {
        "name": "Mahway the Winged",
        "prompt": """A full-body fantasy card art portrait of Mahway the winged giant, adult 
male son of Barakel, messenger with flight capability, angelic heritage visible in wings, 
carrying message through sky, soaring between heaven and earth, messenger scroll in hand, 
sky tones earth brown with messenger white, aerial freedom urgent mission atmosphere, 
highly detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, 
no text, no logos""",
        "category": "legendary",
        "filename": "Mahway.png",
    },
    "gilgamesh": {
        "name": "Gilgamesh",
        "prompt": """A full-body fantasy card art portrait of Gilgamesh legendary king of Uruk, 
adult male two-thirds divine hero of epic fame, wrestling stance ready for combat, heroic 
physique beyond mortal men, holding lion under arm in traditional imagery, wilderness of 
ancient Mesopotamia background, heroic gold and royal blue with white, highly detailed oil 
painting style, sharp focus on face, no blur, no grain, no watermark, no text, no logos""",
        "category": "legendary",
        "filename": "Gilgamesh.png",
    },
    # =====================
    # CORRUPTED HUMANITY
    # =====================
    "baal_priest": {
        "name": "Baal-Priest",
        "prompt": """A medium-shot fantasy card art portrait of Baal-Priest performing blood 
sacrifice, adult male corrupted priest in Canaanite ritual robes, standing before pagan 
altar with fire and blood, knife raised in dark worship, high place with idol behind, 
blood red and corrupted gold with burnt-black, false priesthood atmosphere, highly detailed 
oil painting style, sharp focus on face and knife, no blur, no grain, no watermark, no 
text, no logos""",
        "category": "corrupted",
        "filename": "baal_priest.png",
    },
    "lamech_avenger": {
        "name": "Lamech the Avenger",
        "prompt": """A medium-shot fantasy card art portrait of Lamech the Cainite king, adult 
male seventh generation from Cain, marked descendant with royal bearing, seated on throne 
of violence, bronze blade at side, boasting of vengeance, Cainite city background, royal 
purple and stained blood red with weathered bronze, inherited curse vendetta king atmosphere, 
highly detailed oil painting style, sharp focus on face, no blur, no grain, no watermark, 
no text, no logos""",
        "category": "corrupted",
        "filename": "Lamech.png",
    },
}

# ============================================================================
# FUNCTIONS
# ============================================================================


def ensure_output_dir():
    """Create output directories for each category."""
    for category in CATEGORIES:
        (OUTPUT_DIR / category).mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_image(
    key: str,
    prompt_data: dict,
    seed: int = -1,
    steps: int = None,
    width: int = None,
    height: int = None,
) -> bool:
    """Generate a single image using sd-cli and Z-Image Turbo."""

    output_path = OUTPUT_DIR / prompt_data["category"] / prompt_data["filename"]

    # Z-Image Turbo command - uses --diffusion-model, --vae, --llm syntax
    # Key settings per official docs: cfg-scale 1.0, steps 8, no negative prompt
    cmd = [
        str(SD_CLI_PATH),
        "--diffusion-model",
        str(DIFFUSION_MODEL),
        "--vae",
        str(VAE_MODEL),
        "--llm",
        str(LLM_ENCODER),
        "-p",
        prompt_data["prompt"],
        "-o",
        str(output_path),
        "-W",
        str(width or DEFAULT_WIDTH),
        "-H",
        str(height or DEFAULT_HEIGHT),
        "--steps",
        str(steps or DEFAULT_STEPS),
        "--cfg-scale",
        str(DEFAULT_CFG),
        "--scheduler",
        SCHEDULER,
        "-s",
        str(seed) if seed >= 0 else str(DEFAULT_SEED),
    ] + EXTRA_ARGS

    print(f"\n{'=' * 60}")
    print(f"Generating: {prompt_data['name']}")
    print(f"Category: {prompt_data['category']}")
    print(f"Output: {output_path}")
    print(f"{'=' * 60}")

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        if result.returncode == 0:
            print(f"[OK] SUCCESS: {prompt_data['filename']}")
            return True
        else:
            print(f"[FAIL] FAILED: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print(f"[FAIL] TIMEOUT: Generation took too long")
        return False
    except Exception as e:
        print(f"[FAIL] ERROR: {e}")
        return False


def generate_batch(
    start: int = 0,
    count: int = None,
    category: str = None,
    seed: int = -1,
    steps: int = None,
):
    """Generate a batch of images."""

    ensure_output_dir()

    # Filter by category if specified
    items = list(BESTIARY_PROMPTS.items())
    if category:
        items = [(k, v) for k, v in items if v["category"] == category]

    # Apply start/count
    if count:
        items = items[start : start + count]
    else:
        items = items[start:]

    print(f"\n{'#' * 60}")
    print(f"NEPHILIM WARS - BESTIARY IMAGE GENERATOR")
    print(f"Model: Z-Image Turbo Q4_K_M")
    print(
        f"Settings: CFG={DEFAULT_CFG}, Steps={steps or DEFAULT_STEPS}, Flash Attention"
    )
    print(f"Images to generate: {len(items)}")
    print(f"{'#' * 60}\n")

    successes = 0
    failures = 0

    for i, (key, data) in enumerate(items, 1):
        print(f"\n[{i}/{len(items)}] Processing: {key}")

        if generate_image(key, data, seed=seed, steps=steps):
            successes += 1
        else:
            failures += 1

    print(f"\n{'#' * 60}")
    print(f"BATCH COMPLETE")
    print(f"Successes: {successes}")
    print(f"Failures: {failures}")
    print(f"{'#' * 60}\n")

    return successes, failures


def list_characters():
    """List all available characters."""
    print("\n" + "=" * 60)
    print("NEPHILIM WARS BESTIARY - AVAILABLE CHARACTERS")
    print("=" * 60)

    for category in CATEGORIES:
        chars = [
            (k, v) for k, v in BESTIARY_PROMPTS.items() if v["category"] == category
        ]
        if chars:
            print(f"\n[{category.upper().replace('_', ' ')}] ({len(chars)} characters)")
            for key, data in chars:
                print(f"  • {key}: {data['name']}")

    print(f"\nTotal: {len(BESTIARY_PROMPTS)} characters")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Nephilim Wars Bestiary Image Generator (Z-Image Turbo)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python generate_bestiary_images.py                       # Generate all
    python generate_bestiary_images.py --list                 # List characters
    python generate_bestiary_images.py --start 0 --count 3    # First 3
    python generate_bestiary_images.py --category fallen      # Fallen only
    python generate_bestiary_images.py --seed 42              # Fixed seed
    python generate_bestiary_images.py --steps 8              # 8 steps (default)

Hardware:
    Set GGML_VK_VISIBLE_DEVICES=1 for Radeon VII
        """,
    )

    parser.add_argument("--start", type=int, default=0, help="Start index (default: 0)")
    parser.add_argument(
        "--count", type=int, default=None, help="Number of images to generate"
    )
    parser.add_argument(
        "--category",
        type=str,
        default=None,
        choices=CATEGORIES,
        help="Generate only this category",
    )
    parser.add_argument(
        "--seed", type=int, default=-1, help="Random seed (-1 for random)"
    )
    parser.add_argument(
        "--steps", type=int, default=None, help="Number of steps (default: 8)"
    )
    parser.add_argument("--width", type=int, default=None, help="Image width")
    parser.add_argument("--height", type=int, default=None, help="Image height")
    parser.add_argument("--list", action="store_true", help="List all characters")

    args = parser.parse_args()

    if args.list:
        list_characters()
    else:
        generate_batch(
            start=args.start,
            count=args.count,
            category=args.category,
            seed=args.seed,
            steps=args.steps,
        )
