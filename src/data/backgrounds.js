export const BACKGROUNDS = [
  {
    value: "watchers_apprentice",
    label: "Watcher's Apprentice",
    boost: "INT",
    skill: "Arcana",
    lore: "Forbidden Lore",
    description: "You were initiated into the forbidden mysteries taught by the fallen Watchers. Perhaps you were born into a Sorcerer Clan family and trained from childhood in the arts of Azazel, Semyaza, or Baraqel. Maybe you sought out forbidden knowledge on your own, drawn by the promise of power that the righteous path could not offer. Or perhaps you were chosen by a lesser Watcher or a powerful sorcerer to serve as their apprentice, learning secrets that were never meant for mortal minds. You now bear the Watcher's Mark — a visible brand on your skin that identifies you as one who has tasted forbidden knowledge.",
    equipment: ["Scholar's tools", "Clay tablet inscribed with forbidden symbols", "Bronze dagger", "Pouch with 5 gp"]
  },
  {
    value: "tribal_elder",
    label: "Tribal Elder",
    boost: "WIS",
    skill: "Society",
    lore: "Tribal Lore",
    description: "You are a respected elder of your tribe, a keeper of wisdom and tradition in a world that grows increasingly chaotic. Your people look to you for guidance in matters of faith, law, and survival. You have lived for many decades — perhaps even a century or more, for lifespans in the antediluvian age are long — and your experience has taught you much about the ways of the world and the will of the Most High. Now you have left your position of authority to embark on a journey into the wider world, driven by vision, loss, or the conviction that your wisdom is needed beyond the borders of your tribe.",
    equipment: ["Elder's staff (quarterstaff)", "Fine robes", "Tribal amulet of office", "Pouch with 10 gp"]
  },
  {
    value: "bronze_smith",
    label: "Bronze Smith",
    boost: "INT or STR",
    skill: "Crafting",
    lore: "Metallurgy Lore",
    description: "You are a master of the metallurgical arts, a craftsman who transforms raw ore into weapons, tools, and works of beauty. Your skills were passed down through generations, originating with Tubal-Cain himself, the first smith and the instructor of all who work with brass and iron. In a world where bronze weapons determine the balance of power between tribes and where Nephilim warlords demand ever-finer arms and armor, your craft is both valuable and dangerous.",
    equipment: ["Smith's toolkit", "Bronze hammer", "Set of tongs", "Whetstone", "Pouch with 15 gp"]
  },
  {
    value: "temple_servant",
    label: "Temple Servant",
    boost: "WIS",
    skill: "Religion",
    lore: "Temple Lore",
    description: "You have dedicated your life to the service of the Most High, working as a caretaker, attendant, or acolyte in a sacred place of worship. This might be a temple built by righteous Sethites to honor the Creator, a sacred grove where your tribe gathers to offer sacrifices, or even a hidden shrine where the faithful meet in secret. Your time in sacred service has given you a deep connection to the divine and a strong sense of right and wrong.",
    equipment: ["Set of vestments", "Holy symbol of the Most High", "Censer", "Prayer book on clay tablets", "Pouch with 8 gp"]
  },
  {
    value: "giants_thrall",
    label: "Giant's Thrall",
    boost: "CON",
    skill: "Survival",
    lore: "Giant Lore",
    description: "You were once a slave or servant in the household of a Nephilim or other giant lord. Perhaps you were born into servitude, your family having been subjugated by giants for generations. Maybe you were captured in a raid on your village and forced to serve your giant masters. Your life as a thrall was one of hardship and danger. You performed menial tasks while living in constant fear of your master's wrath. Despite the oppression, you managed to escape, and you now carry the scars — physical and emotional — of your servitude, along with valuable knowledge about your former masters and their weaknesses.",
    equipment: ["Worn but serviceable clothing", "Small knife hidden in boot", "Token taken from former master's household", "Pouch with 3 gp"]
  },
  {
    value: "wandering_prophet",
    label: "Wandering Prophet",
    boost: "WIS",
    skill: "Religion",
    lore: "Prophecy Lore",
    description: "You are a prophet of the Most High, called to speak truth to a world that has turned away from righteousness. Like Enoch before you, you have received visions and revelations that guide your path and inform your message. You wander from place to place, bringing warnings of judgment to the corrupt, comfort to the oppressed, and calls to repentance to all who will listen. Your message is not always welcome, but you persist, driven by the conviction that your message is necessary, however unwelcome it may be.",
    equipment: ["Prophet's staff", "Simple robes", "Scroll containing prophecies", "Waterskin", "Pouch with 5 gp"]
  },
  {
    value: "merchant_of_enoch",
    label: "Merchant of Enoch",
    boost: "CHA",
    skill: "Diplomacy",
    lore: "Trade Lore",
    description: "You are a merchant from the great city of Enoch, the first metropolis built by Cainite civilization. Your family has been involved in trade for generations, establishing networks of contacts and developing expertise in the movement of goods across vast distances. You understand the value of commodities, the art of negotiation, and the importance of maintaining good relationships with suppliers and customers. You may have left the city of Enoch for various reasons — exile, ambition, or disillusionment with Cainite society.",
    equipment: ["Fine merchant clothing", "Merchant's scales", "Ledger book", "Signet ring of merchant house", "Pouch with 25 gp"]
  },
  {
    value: "beast_tamer",
    label: "Beast Tamer",
    boost: "WIS",
    skill: "Nature",
    lore: "Animal Lore",
    description: "You have a special connection with animals, a gift for understanding and communicating with them that sets you apart from ordinary people. This ability may be innate or developed through years of experience living and working with beasts. Your relationship with animals goes beyond mere utility — you see them as companions, allies, and sometimes even friends. Your bond with beasts has likely drawn you away from settled life and into the wilderness, where you feel most at home.",
    equipment: ["Wilderness survival gear", "Trained animal companion (dog, hawk, or horse)", "Whistle for signaling companion", "Pouch with 10 gp"]
  },
  {
    value: "star_reader",
    label: "Star Reader",
    boost: "INT",
    skill: "Occultism",
    lore: "Astrology Lore",
    description: "You are a student of the heavens, an astronomer and astrologer who reads the stars for guidance, prophecy, and understanding. Your knowledge comes from the teachings of Baraqel, one of the fallen Watchers who revealed the secrets of celestial observation to humanity. Though this knowledge is forbidden and carries the risk of corruption, you believe that understanding the patterns of the heavens can provide insight into the will of the Most High and the fate of the world.",
    equipment: ["Astronomical instruments (astrolabe, compass, measuring tools)", "Star charts on clay tablets", "Journal for observations", "Pouch with 12 gp"]
  },
  {
    value: "herb_cutter",
    label: "Herb Cutter",
    boost: "INT or WIS",
    skill: "Nature",
    lore: "Herbalism Lore",
    description: "You are a master of herbalism and plant lore, skilled in identifying, harvesting, and preparing plants for various purposes. Your knowledge encompasses both beneficial and harmful applications — you can create healing poultices and remedies, but you also understand the properties of poisonous plants and the arts of creating toxins and venoms. This dual nature of your craft reflects its origin in the teachings of Semyaza, one of the fallen Watchers who revealed the secrets of root-cutting to humanity.",
    equipment: ["Herb cutter's toolkit (knife, mortar and pestle, drying racks, containers)", "Collection of dried herbs and plants", "Book of herbal recipes", "Pouch with 8 gp"]
  },
  {
    value: "flood_plains_survivor",
    label: "Survivor of the Flood Plains",
    boost: "CON",
    skill: "Survival",
    lore: "Weather Lore",
    description: "You come from a region that has already experienced the early signs of the coming judgment — flooding, storms, and environmental upheaval that foreshadow the Great Flood to come. Your homeland, once fertile and prosperous, has been devastated by rising waters, torrential rains, and violent weather. Your survival in these harsh conditions has taught you valuable skills in wilderness survival, resource management, and adaptation to changing environments.",
    equipment: ["Weather-resistant clothing", "Waterskin", "Fishing net", "Knife", "Tarp for shelter", "Pouch with 5 gp"]
  },
  {
    value: "nephilim_offspring",
    label: "Nephilim Offspring",
    boost: "STR or CHA",
    skill: "Intimidation",
    lore: "Giant Heritage Lore",
    description: "You are the offspring of a Nephilim or other giant and a human parent, a living reminder of the forbidden unions that have corrupted the world. Your heritage places you in an ambiguous position — you are not fully human, but you are also not a full giant. You may appear mostly human with subtle giant characteristics (unusual height, strength, or features), or you may be more obviously hybrid in appearance. Your experiences have given you unique insights into both human and giant societies, but also made you feel like you don't truly belong anywhere.",
    equipment: ["Clothing that helps conceal hybrid nature (if desired)", "Token from giant parent (if you have one)", "Weapon appropriate to size and strength", "Pouch with 10 gp"]
  },
  {
    value: "keeper_of_scrolls",
    label: "Keeper of the Scrolls",
    boost: "INT",
    skill: "Society",
    lore: "Ancient History Lore",
    description: "You are a scholar and scribe, dedicated to preserving knowledge in a world where much is being lost to corruption and violence. Your work involves copying, studying, and safeguarding written records — genealogies, histories, laws, prophecies, and other texts that contain the wisdom and experiences of past generations. You may serve in a library, scriptorium, or archive maintained by a righteous community, or you may be an independent scholar traveling to collect and preserve texts from endangered sources.",
    equipment: ["Scribe's toolkit (stylus, ink, writing surfaces)", "Collection of scrolls or tablets", "Book chest", "Magnifying lens", "Pouch with 15 gp"]
  },
  {
    value: "hunter_of_abominations",
    label: "Hunter of Abominations",
    boost: "WIS",
    skill: "Survival",
    lore: "Monster Lore",
    description: "You are a dedicated hunter of corrupted beings — Nephilim, demons, possessed humans, and other abominations that threaten the righteous and corrupt the world. Your calling may be religious, driven by a conviction that these creatures are an affront to the Most High. It may be personal, motivated by the loss of loved ones to giant oppression or demonic possession. Or it may be pragmatic, based on the recognition that these threats must be dealt with for humanity to survive. Your training has made you an expert in tracking, identifying, and combating supernatural threats.",
    equipment: ["Specialized weapon for hunting abominations (blessed spear or silver-tipped arrow)", "Tracking tools", "Protective charms or amulets", "Journal for recording hunts", "Pouch with 12 gp"]
  },
  {
    value: "penitent_cultist",
    label: "Penitent Cultist",
    boost: "WIS",
    skill: "Occultism",
    lore: "Cult Lore",
    description: "You were once a member of a cult that worshipped the Watchers, Nephilim, or other corrupted beings, but you have since renounced your former beliefs and seek redemption for your past actions. Your time in the cult exposed you to forbidden knowledge, dark rituals, and practices that you now recognize as corrupt and destructive. Your journey toward redemption is ongoing and often difficult. You may face suspicion and distrust from righteous communities who are wary of your past, and you may struggle with guilt, shame, or trauma from your experiences.",
    equipment: ["Clothing that helps blend in with ordinary people (concealing any cult markings)", "Token of repentance (symbol of the Most High)", "Journal documenting experiences and insights", "Pouch with 7 gp"]
  },
  {
    value: "desert_nomad",
    label: "Desert Nomad",
    boost: "CON",
    skill: "Survival",
    lore: "Desert Lore",
    description: "You are a member of a nomadic people who roam the deserts and arid regions of the antediluvian world, following seasonal patterns and seeking out scarce resources in harsh environments. Your people have developed specialized skills and knowledge for surviving in these challenging conditions — finding water in seemingly barren landscapes, navigating by stars and landmarks, protecting themselves from extreme temperatures and sandstorms. Your nomadic lifestyle has shaped your worldview and values, making you self-reliant, adaptable, and deeply connected to the land.",
    equipment: ["Desert-appropriate clothing (light, loose-fitting, protective from sun)", "Waterskin", "Sunshade or head covering", "Knife", "Small tent or shelter", "Pouch with 8 gp"]
  },
  {
    value: "river_fisher",
    label: "River Fisher",
    boost: "WIS",
    skill: "Survival",
    lore: "Fishing Lore",
    description: "You are a fisher who makes your living along the rivers, lakes, and coastal waters of the antediluvian world. Your skills encompass not only fishing but also boat handling, navigation, weather prediction, and knowledge of aquatic ecosystems. Your life is intimately connected to the waterways you depend on. You know the seasonal patterns of fish migrations and water levels, can read weather changes in the water's surface, and understand the geography of river systems. Your experiences on the water have given you patience, resilience, and a philosophical outlook shaped by the rhythms of nature.",
    equipment: ["Fishing gear (nets, lines, hooks, traps)", "Small boat or raft", "Paddle or oar", "Waterproof containers", "Knife", "Pouch with 10 gp"]
  },
  {
    value: "stone_mason",
    label: "Stone Mason",
    boost: "STR or INT",
    skill: "Crafting",
    lore: "Architecture Lore",
    description: "You are a skilled craftsman who works with stone, creating structures, tools, monuments, and artworks from the raw materials of the earth. Your expertise encompasses quarrying, cutting, shaping, and assembling stone, as well as understanding the properties and uses of different types of rock. Your work has likely brought you into contact with various aspects of antediluvian society — you may have contributed to the construction of Cainite cities, Nephilim fortresses, Sethite temples, or other significant structures. Your connection to stone and the earth has given you a unique perspective on the world.",
    equipment: ["Stonemason's toolkit (hammers, chisels, wedges, measuring tools)", "Protective gloves", "Water flask", "Sketchbook for designs", "Pouch with 12 gp"]
  },
  {
    value: "tribal_scout",
    label: "Tribal Scout",
    boost: "DEX",
    skill: "Stealth",
    lore: "Scouting Lore",
    description: "You are a scout for your tribe, responsible for ranging ahead of the main group to gather information, identify threats, and find resources. Your skills encompass wilderness survival, tracking, stealth, observation, and communication. Your role requires independence, self-reliance, and quick thinking. You often operate alone or in small teams, far from the support of your tribe. Your knowledge of the land and its inhabitants is extensive, and your experiences have made you resourceful, observant, and somewhat reserved.",
    equipment: ["Scout's gear (light clothing, waterskin, rations, rope, flint and steel)", "Knife", "Shortbow with arrows", "Journal for recording observations", "Pouch with 8 gp"]
  },
  {
    value: "sacred_dancer",
    label: "Sacred Dancer",
    boost: "DEX or CHA",
    skill: "Performance",
    lore: "Dance Lore",
    description: "You are a performer who uses dance as a form of worship, ritual, storytelling, or celebration. Your art is deeply connected to the spiritual and cultural life of your community. You may serve in a temple or sacred space, performing dances that honor the Most High, commemorate important events, or accompany rituals and ceremonies. Your training has given you expertise in various aspects of dance — technique, choreography, expression, rhythm, and performance. Your role as a sacred dancer carries both artistic and spiritual significance; your performances are not merely entertainment but expressions of faith, culture, and community values.",
    equipment: ["Performance clothing and accessories (costumes, props, instruments)", "Journal for recording choreography", "Water flask", "Pouch with 10 gp"]
  }
];