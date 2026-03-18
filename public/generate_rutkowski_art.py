import os
import subprocess

SD_CLI_PATH = r"C:\Users\velez\Desktop\AI_Tools\SD\sd-cli.exe"
DIFFUSION_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\z-image-turbo-Q4_K_M.gguf"
VAE_MODEL = r"C:\Users\velez\Desktop\AI_Tools\SD\ae.safetensors"
LLM_ENCODER = r"C:\Users\velez\Desktop\AI_Tools\SD\Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf"
OUTPUT_DIR = r"C:\Code\nephilim-wars\public\images\rutkowski"

STYLE_SUFFIX = (
    "Greg Rutkowski style, epic fantasy oil painting, rich textures, detailed brushwork, "
    "atmospheric, cinematic composition, masterpiece, 8k resolution, sharp focus, no blur, no text."
)

PROMPT_LIBRARY = {
    # --- Archangels ---
    "michael": "A breathtaking epic fantasy oil painting of Archangel Michael, the Prince of Israel and Commander of the Heavenly Host. He is the 'Patient and Merciful One,' clad in immovable, mirror-like iron plate armor that reflects the uncreated light of God. He holds a massive sword of pure white fire, standing stoically over a defeated, multi-headed red dragon. His six vast wings are composed of blindingly white feathers. Background of a stormy celestial battlefield where the host of light meets the darkness. Masterful dramatic lighting, high contrast, divine radiance.",
    "gabriel": "A monumental epic fantasy oil painting of Archangel Gabriel, the Master of Paradise and the Serpents. He has a graceful yet terrifying appearance, wearing silver-gold mail and holding a long spear of crackling divine energy. He is surrounded by multi-winged, serpentine entities (Seraphim). He stands before the gates of the Celestial Garden, holding a silver lantern that reveals hidden truths. Background of a radiant, crystalline palace with intense rays of light. Ethereal lighting, high-contrast gold and white tones.",
    "raphael": "An atmospheric epic fantasy oil painting of Archangel Raphael, the Healer of the Earth and Binder of Azazel. He is depicted as a divine traveler in worn sandals and a travel-stained robe, carrying a staff of living wood. He holds a set of golden chains that pulse with binding power and a container of medicinal balm. Background of a lush, primordial biblical valley with a river flowing under a deep orange sunset. Warm golden hour lighting, peaceful yet powerful and resolute mood.",
    "uriel": "A terrifying and eldritch epic fantasy oil painting of Archangel Uriel, the Warden of Tartarus. He is the 'Executioner of Light,' with eyes like twin bolts of lightning and skin like hammered gold. He holds a flaming sword and a scroll of judgment. His wings are like white-hot plasma that scorches the air. Background of the edge of the Great Abyss (Tartarus), a place of smoke, fire, and thunder. Fierce, blinding high-contrast lighting, storm-wracked sky atmosphere.",
    "sariel": "A mysterious epic fantasy oil painting of Archangel Sariel (Saraqael), the Lunar Warden. He is the protector of the spirits who sin, clad in silver-white plate armor with lunar phases etched into the metal. He holds a massive silver shield that glows with a cool, pale light. He has twelve shimmering wings. Background of a vast starlit sky over a desolate mountain peak, with a giant crescent moon hanging low. Cool silver moonlight, deep indigo shadows, mystical and protective atmosphere.",
    "raguel": "A regal epic fantasy oil painting of Archangel Raguel, the Cosmic Auditor. He is the enforcer of divine order among the angels, carrying a rod of discipline and a heavy set of golden scales. He wears a golden crown and has brilliant blue wings that match the clarity of the highest heaven. Background of a high mountain court with pillars of ice and perpetual snow. Crisp, clear lighting, cold but majestic atmosphere, inescapable judgment.",
    "remiel": "A somber and hopeful epic fantasy oil painting of Archangel Remiel (Jeremiel), the Thunder of God. He is set over those who rise, carrying a lantern that emits a pulsing light of divine visions. His wings are the color of thunderclouds, and he stands amidst a gathering storm. Background of a valley where souls are rising toward a distant bridge of light. Flickering torchlight against a dark, stormy night, dramatic flashes of lightning.",
    "metatron": "A transcendental and colossal epic fantasy oil painting of Metatron, the Lesser YHWH and Celestial Scribe. He is a vast Seraphim with many wings covered in unblinking eyes, surrounded by the pulsing neon geometry of Metatron's Cube. He is focused intently on a scroll of infinite length, writing with a pen made of pure light. Background of the highest heaven, a sea of glass and fire. Blinding divine light, complex sacred geometry, epic cosmic scale.",
    "raziel": "A shrouded and arcane epic fantasy oil painting of Archangel Raziel, the Keeper of Secrets. He is wrapped in shifting, multicolored iridescent garments that seem to contain the spectrum of creation. He clutches the Sefer Raziel, a massive tome radiating ancient and forbidden arcane energy. Background of a hidden celestial library with floating crystals and endless rows of scrolls. Prismatic lighting, mysterious and arcane atmosphere, hidden wisdom.",
    "azrael": "A hauntingly beautiful epic fantasy oil painting of Archangel Azrael, the Separator of Souls. In his true form, he possesses four thousand wings and a body covered in thousands of eyes and tongues. He holds a silver scythe and a massive register (The Book of the Dead). Background of a silent, vast graveyard under a perpetual twilight. Eerie twilight lighting, deep purples and blacks, somber and accurate mood.",
    
    # --- Demons / Fallen ---
    "satan": "A terrifying and majestic epic fantasy oil painting of Satan, the Adversary. A monumental figure of dark pride, a multi-headed red dragon-like being with bat wings and a crown of black fire. He sits upon a throne of twisted obsidian and shadows, his eyes burning with ancient rebellion. Background of an apocalyptic landscape with falling stars and a blood-red sky. Ominous hellfire lighting, deep reds and oppressive shadows, cosmic evil.",
    "semyaza": "A tragic and powerful epic fantasy oil painting of Semyaza, the Bound King. The leader of the 200 Watchers, his once-glorious radiance is tarnished and fading. He is bound in heavy, glowing iron chains to the peak of Mount Hermon. His face shows the crushing weight of the oath. Background of a cold, desolate mountain summit under a darkening sky. Cold, moody lighting, theme of fallen majesty and spiritual corruption.",
    "azazel": "A rugged and fierce epic fantasy oil painting of Azazel, the Scapegoat of War. He has rugged features, goat-like horns, and eyes painted with forbidden cosmetics. He stands at a massive black anvil, forging jagged bronze and iron weapons that bleed. Background of a desolate desert canyon (Dudael) with a burning forge. Low-key firelight, sparks flying, gritty and industrial feel, the father of warfare.",
    "lilith": "A seductive and terrifying epic fantasy oil painting of Lilith, the Night-Stalker. She has terrifying beauty, long wild hair, and sharp owl-like talons for feet. She is accompanied by great horned owls and serpents, wearing a gown of shadows. Background of a dark, primeval forest under a blood-red crescent moon. Pale, eerie moonlight, deep forest shadows, nocturnal and predatory atmosphere.",
    "asmodeus": "A grotesque and powerful epic fantasy oil painting of Asmodeus, the King of Nine Hells. He is depicted with three heads—bull, man, and ram—and goose feet, riding a wingless dragon. He holds a jagged lance and a set of gaming dice. Background of a lavish but decaying banquet hall filled with smoke and shadows. Decadent red lighting, smoky and hazy atmosphere, demon of lust and rage.",
    "belial": "A deceptively beautiful epic fantasy oil painting of Belial, the Spirit of Lawlessness. He appears as a radiant, soft-spoken angel of light, but his shadow reveals a hollow, rotting interior. He stands in a chariot of fire, holding a broken yoke of service. Background of a chaotic ancient city in ruins and flames. Flickering orange firelight, high contrast, the theme of pure malevolence.",
    "mastema": "A cold and legalistic epic fantasy oil painting of Mastema, the Prosecuting Angel. He looks like a holy angel but has a cold, predatory, hawk-like gaze. He holds a legal scroll and a set of unbalanced scales, acting as the accuser. Background of a cold, grey courtroom in the lower heavens. Flat, oppressive grey lighting, clinical and detached mood, the reaper of the apocrypha.",
    "abaddon": "A monstrous epic fantasy oil painting of Abaddon, the King of Locusts. A massive armored giant emerging from a smoking pit, surrounded by a swarm of human-faced locusts with lion's teeth. He holds the key to the bottomless pit. Background of a landscape consumed by a plague of smoke and insects. Sickly green and yellow lighting, chaotic and swarming composition, the Destroyer.",
    "gadreel": "A whispering and shadowy epic fantasy oil painting of Gadreel, the Deceiver. He has a shifting, blurred face and holds a concealed bronze dagger. He is depicted whispering into the ear of a hidden figure in a garden. Background of a dark, misty garden with forbidden, glowing fruit. Low light, hazy and treacherous atmosphere, the one who led Eve astray.",
    "prince_persia": "A majestic and oppressive epic fantasy oil painting of the Prince of Persia. He wears heavy Achaemenid lamellar armor and a tall crown, wreathed in a dark, suffocating royal glory (Khvarenah). He is a territorial spirit of immense power. Background of a massive ancient palace with lion statues and dark banners. Dusk lighting, deep blues and golds, the theme of spiritual territorial power.",
    
    # --- Missing Watchers from BestiaryScreen ---
    "baraqel": "A breathtaking epic fantasy oil painting of the Fallen Watcher Baraqel, the Tamer of Lightning. He stands upon a high stone tower, surrounded by crackling electrical energy and ancient astrological charts. He is reading the stars as lightning illuminates his tattered wings. Background of a violent electrical storm in a dark night sky. Dramatic lightning-flash lighting, high contrast, the father of astrology.",
    "kokabiel": "A monumental epic fantasy oil painting of the Fallen Watcher Kokabiel, the Star of God. He is a radiant but dark figure wreathed in the light of distant galaxies and constellations. He holds a massive star-map that glows with forbidden light. Background of a vast, starlit celestial expanse. Prismatic and cosmic lighting, ethereal and cold atmosphere, the teacher of the constellations.",
    "penemue": "A somber and intellectual epic fantasy oil painting of the Fallen Watcher Penemue, the Scribe of Sins. He is hunched over a massive obsidian desk, writing with a pen made of bone and black ink. His wings are like parchment covered in dark script. Background of a library of forbidden knowledge filled with black scrolls. Low-key, focused candlelight, moody and academic atmosphere, the teacher of writing.",
    "armaros": "A mysterious and arcane epic fantasy oil painting of the Fallen Watcher Armaros, the Resolver of Enchantments. He is depicted weaving complex spiritual threads between his fingers, breaking a shimmering golden seal of divine magic. Background of a mystical ritual site with floating stone monoliths. Arcane blue and purple lighting, intricate magical effects, the master of counter-magic.",
    "kasdeja": "A dark and predatory epic fantasy oil painting of the Fallen Watcher Kasdeja, the Striker of Spirits. He is a shadowy figure with long, needle-like fingers, standing in a void where human souls are visible as flickering lights. Background of a dark, swirling spiritual abyss. Eerie and oppressive lighting, theme of spiritual assault and the destruction of the innocent.",

    # --- Giants ---
    "nephilim_warrior": "A monumental epic fantasy oil painting of a Nephilim Warrior, a towering hybrid giant. He stands 15 feet tall, a mountain of muscle with distorted, slightly non-human features. He wears heavy bronze scale armor and wields a colossal bronze greatsword. Background of a primitive battlefield with fleeing humans. Wide shot to show epic scale, dust and smoke.",
    "nephilim_warlord": "A commanding epic fantasy oil painting of a Nephilim Warlord. A towering leader of giants in heavy, ornate bronze plate armor, standing on a pile of rubble. He points a massive mace toward a burning city in the distance. Background of a chaotic battlefield with smoke, fire, and an army of giants. Epic composition, smoke and fire.",
    "nephilim_scout": "A swift and predatory epic fantasy oil painting of a Nephilim Scout. A lean but massive giant wearing camouflage furs and leather, moving stealthily through high mountain grass. He carries a long bronze spear and has a hawk-like focus. Background of a rugged mountain ridge under a clouded sky. Natural, muted lighting, focus on stealth and agility.",
    "nephilim_hunter": "A wild and predatory epic fantasy oil painting of a Nephilim Hunter. A giant scout wearing furs and tracking a prehistoric, hybrid beast. He carries a massive bow and a quiver of heavy spears. Background of a primeval jungle with giant ferns. Dappled jungle light, green and brown tones.",
    "rephaim_champion": "A ghostly and terrifying epic fantasy oil painting of a Rephaim Champion. A weathered, undying giant warrior with pale, translucent skin and glowing blue eyes. He carries a massive war club made of ancient stone and bone. Background of a misty pre-flood ruin with spectral energy. Ghostly blue lighting, ethereal and deathly atmosphere.",
    "rephaim_warrior": "A gaunt and skeletal epic fantasy oil painting of a Rephaim Warrior. He has pale, grey skin and deep-set eyes, wearing tattered funeral wrappings over bronze mail. He wields a heavy, notched bronze blade. Background of a misty, ancient burial ground. Eerie grey and blue lighting, somber and deathly mood, the 'Shades'.",
    "rephaim_deathspeaker": "A grim and arcane epic fantasy oil painting of a Rephaim Deathspeaker. An ancient giant priest of the dead wearing robes decorated with thousands of small bones. He channels dark spectral energy from a staff topped with a giant's skull. Background of a massive necropolis at night. Sickly purple and green arcane light.",
    "anakim_berserker": "A brutal and blood-soaked epic fantasy oil painting of an Anakim Berserker. A crazed giant with long matted hair, covered in war paint and scars, exhibiting polydactyly (six fingers). He wields dual bronze axes. Background of a chaotic mountain pass during a storm. High energy, dynamic pose, splashing rain and blood.",
    "horim_tunneler": "A gritty and claustrophobic epic fantasy oil painting of a Horim Tunneler. A stocky, subterranean giant adapted to darkness, with pale skin and large eyes. He carries a heavy stone mace and a primitive lantern. Background of a narrow mountain cave with glowing fungi. Deep earthy tones.",
    "horim_stoneshaper": "A detailed epic fantasy oil painting of a Horim Stone-Shaper. He has crystalline patterns on his skin and is literally merging with a stone wall to shape it. He holds a chisel made of diamond-like crystal. Background of a massive underground hall with intricate stone carvings. Warm bioluminescent lighting, focus on craftsmanship and geology.",
    "gibborim_elite": "A heroic and legendary epic fantasy oil painting of a Gibborim Elite Guard. A 'Mighty Man' of renown, wearing polished bronze muscle cuirass and a plumed helmet. He holds a long spear and a heavy round shield. Background of a sun-drenched ancient citadel. High-contrast sunlight, heroic and noble mood.",
    "gibborim": "A powerful epic fantasy oil painting of a Gibborim hero. A legendary figure of immense strength, pulling a massive bronze bow. Background of a panoramic vista of an ancient, primordial world. Cinematic composition, sweeping scale.",
    "gammadim_tunnelfighter": "A detailed epic fantasy oil painting of a Gammadim Tunnel-Fighter. A small but fierce 'under-walker' with a weathered face, wearing scavenger armor. He holds a tunnel-pick and a sling. Background of a massive cavern with giant stalactites. Dim lighting, focus on detail.",
    "gammadim_earthspeaker": "A spiritual and evocative epic fantasy oil painting of a Gammadim Earth-Speaker. He is a small figure in deep prayer, surrounded by a halo of glowing crystals that float around him. He is touching a massive, ancient root of the world. Background of a sacred deep-earth cavern. Magical crystalline lighting, serene and powerful atmosphere.",
    "elioud_deceiver": "An elegant and deceptive epic fantasy oil painting of an Elioud Deceiver. A third-generation offspring with subtle angelic beauty and shimmering iridescent robes. Background of a mystical oasis with shimmering towers. Soft, ethereal lighting.",
    "elioud_champion": "A peerless and radiant epic fantasy oil painting of an Elioud Champion. A warrior of incredible physical perfection and immense power, wearing divine-looking armor. He wields a spear of light. Background of an epic mountain peak above the clouds. Blinding high-altitude sunlight.",
    
    # --- Legendary Giants ---
    "ohya": "A wrathful and tormented epic fantasy oil painting of Ohya, Son of Semyaza. A giant of incredible size, clutching his head in pain from prophetic nightmares of the deluge. Background of a stormy sea with a massive, unfinished ark. Dramatic, dark, and turbulent atmosphere.",
    "hahya": "A contemplative epic fantasy oil painting of Hahya, Brother of Ohya. A giant sitting among ancient trees, looking at a single tree remaining in a desolate garden. Background of a misty, ethereal forest. Soft, muted lighting, melancholy mood.",
    "mahway": "A dynamic epic fantasy oil painting of Mahway, the Winged. A giant with massive feathered wings soaring through a sunset sky. Background of the ends of the earth with epic cliffs and clouds. Vibrant sunset lighting.",
    "gilgamesh": "A heroic and confused epic fantasy oil painting of Gilgamesh the Giant. A legendary wrestler giant in a titanic struggle with a massive, monstrous lion. Background of an ancient Mesopotamian city with ziggurats. Cinematic action shot, rich historical detail.",
    
    # --- Corrupted Humanity ---
    "baal_priest": "A dark and sinister epic fantasy oil painting of a Baal-Priest. A corrupted human performing a ritual over a stone altar with a jagged bronze knife. Background of a dark temple interior with a bronze statue of a bull. Firelight and shadows.",
    "lamech": "A fierce and vengeful epic fantasy oil painting of Lamech the Avenger. The blind Cainite patriarch holding Tubal-Cain's masterfully forged blade, standing in a boastful pose. Background of a desert encampment at night. Dusk lighting.",
    "cainite_assassin": "A stealthy and lethal epic fantasy oil painting of a Cainite Assassin. A lithe human marked with the animal-like Mark of Cain, wearing dark leather and a hooded cloak. He is applying green venom to a curved blade. Background of the dark, stone-walled city of Enoch. Deep shadows, moonlight.",
    "cainite_warrior": "A disciplined and hardened epic fantasy oil painting of a Cainite Warrior. A city guard of Enoch wearing heavy bronze lamellar armor and holding a large rectangular shield and spear. He has the Mark of Cain visible on his forehead. Background of a massive stone gatehouse of the first city. Strong, direct sunlight, theme of ancient urban defense.",
    "sorcerer_priest": "A dark and ritualistic epic fantasy oil painting of a Sorcerer-Priest of Babylon. Wearing elaborate robes and a horned headdress, channeling a bolt of crackling necrotic energy. Background of a massive ziggurat at night. Dramatic firelight and necrotic energy.",
    "watcher_cult_leader": "A charismatic and corrupt epic fantasy oil painting of a Watcher Cult Leader. He wears elaborate robes decorated with celestial and demonic symbols, holding a high-raised chalice of glowing liquid. He is preaching to an unseen crowd. Background of a hidden temple chamber. Dramatic under-lighting, theme of seductive corruption.",
    "watcher_cultist": "A fanatical and desperate epic fantasy oil painting of a Watcher Cultist. A human in simple, dark rags with eyes wide in zeal, holding a ritual dagger. He is marked with tattoos of forbidden signs. Background of a smoky, torch-lit underground meeting place. Flickering torchlight, gritty and intense mood.",
    "desert_raider": "A fast-paced epic fantasy oil painting of a Desert Raider. A nomadic warrior from the wilderness on a galloping horse, firing a composite bow. Background of a vast desert with sand dunes. Bright desert sunlight, motion blur.",

    # --- Spirits ---
    "refaim_wraith": "A terrifying and monumental epic fantasy oil painting of a Refa'im Wraith. The colossal, semi-transparent ghost of a Nephilim king, wearing a spectral crown and rags of ancient majesty. He is reaching out with a hand that drains the life from the grass beneath him. Background of a desolate, ash-covered plain under a grey sky. Ghostly, dim lighting, theme of absolute death and lingering power.",
    "refaim_spirit": "A haunting and ethereal epic fantasy oil painting of a Refa'im Spirit. A flickering, translucent blue shade of a giant, wandering through a dark forest. Its face is a mask of eternal hunger and sorrow. Background of a dark, twisted woodland at night. Cold, spectral blue lighting, mysterious and frightening atmosphere.",

    # --- Primordial Beasts ---
    "behemoth": "A colossal and awe-inspiring epic fantasy oil painting of the Behemoth, the First of the Ways of God. A gargantuan land beast resembling a cross between a mountain-sized elephant and a hippopotamus, with bones like bronze and limbs like iron bars. He is drinking from a river that he swallows in one gulp. Background of a vast, untouched primordial cedar forest. Majestic sunlight, epic scale, the living mountain.",
    "leviathan": "A terrifying and majestic epic fantasy oil painting of the Leviathan, the King of the Children of Pride. A massive sea dragon covered in scales like shields, with fire and smoke erupting from his nostrils. He is rising from a churning, stormy ocean, creating a massive whirlpool. Background of a dark, tempestuous sea with towering waves. Dramatic storm lighting, flashes of fire, the untamable deep.",
    "ziz": "A transcendental and immense epic fantasy oil painting of the Ziz, the King of Birds. A primordial bird of such size that its wingspan eclipses the entire sun, casting a massive shadow over the earth. Its feathers are like golden clouds. Background of a high-altitude sky above the clouds. Blindingly bright solar lighting, epic scale, the protector of the southern winds."
}

CATEGORY_MAP = {
    "michael": "Angel", "gabriel": "Angel", "raphael": "Angel", "uriel": "Angel", "sariel": "Angel", 
    "raguel": "Angel", "remiel": "Angel", "metatron": "Angel", "raziel": "Angel", "azrael": "Angel",
    "satan": "Demon", "semyaza": "Fallen", "azazel": "Fallen", "lilith": "Demon", "asmodeus": "Demon", 
    "belial": "Demon", "mastema": "Demon", "abaddon": "Demon", "gadreel": "Fallen", "prince_persia": "Demon",
    "baraqel": "Fallen", "kokabiel": "Fallen", "penemue": "Fallen", "armaros": "Fallen", "kasdeja": "Fallen",
    "nephilim_warrior": "Giant", "nephilim_warlord": "Giant", "nephilim_scout": "Giant", "nephilim_hunter": "Giant",
    "rephaim_champion": "Giant", "rephaim_warrior": "Giant", "rephaim_deathspeaker": "Giant", 
    "anakim_berserker": "Giant", "horim_tunneler": "Cave Dweller", "horim_stoneshaper": "Cave Dweller",
    "gibborim_elite": "Mighty One", "gibborim": "Mighty One", 
    "gammadim_tunnelfighter": "Under-Walker", "gammadim_earthspeaker": "Under-Walker",
    "elioud_deceiver": "Giant", "elioud_champion": "Giant",
    "ohya": "Giant", "hahya": "Giant", "mahway": "Giant", "gilgamesh": "Giant", 
    "baal_priest": "Human", "lamech": "Human", "cainite_assassin": "Human", "cainite_warrior": "Human",
    "sorcerer_priest": "Human", "watcher_cult_leader": "Human", "watcher_cultist": "Human", "desert_raider": "Human",
    "refaim_wraith": "Spirit", "refaim_spirit": "Spirit",
    "behemoth": "Beast", "leviathan": "Beast", "ziz": "Beast"
}

def generate_image_cli(char_id, prompt, category):
    print(f"Generating for {char_id} ({category})...")
    category_dir = os.path.join(OUTPUT_DIR, category)
    if not os.path.exists(category_dir):
        os.makedirs(category_dir)
    file_path = os.path.join(category_dir, f"{char_id}.png")
    
    if os.path.exists(file_path):
        print(f"Skipping {char_id}, already exists.")
        return True

    cmd = [
        SD_CLI_PATH, "--diffusion-model", DIFFUSION_MODEL, "--vae", VAE_MODEL, "--llm", LLM_ENCODER,
        "--cfg-scale", "1.0", "--steps", "10", "--width", "1024", "--height", "1024",
        "--offload-to-cpu", "--vae-tiling", "--diffusion-fa", "--sampling-method", "euler", "--scheduler", "discrete",
        "-p", prompt + " " + STYLE_SUFFIX, "-o", file_path
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Saved {file_path}")
        return True
    except Exception as e:
        print(f"Error generating for {char_id}: {e}")
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    for char_id, prompt in PROMPT_LIBRARY.items():
        category = CATEGORY_MAP.get(char_id, "Unknown")
        generate_image_cli(char_id, prompt, category)

if __name__ == "__main__":
    main()
