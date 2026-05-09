export const ANCESTRIES = {
  Sethite: {
    name: "Sethite (Righteous Line)",
    desc: "Descendants of Seth, keepers of the original faith. The righteous line that traces back to Adam through Seth, preserving ancient truths passed down from Eden.",
    hp: 8,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["Free", "Free"],
    abilityFlaw: "Free",
    startingRP: 2,
    startingCP: 0,
    traits: ["Blessed Heritage (+1 Religion)", "Divine Favor (Detect Evil 1/day)", "Low-Light Vision"],
    heritages: [
      { name: "Blessed of Enoch", description: "Your bloodline traces directly back to Enoch, the seventh from Adam who walked with God. You gain a +1 circumstance bonus to Religion checks and can cast Detect Evil as a divine innate spell once per day." },
      { name: "Shepherd of the Flock", description: "Your family has served as shepherds and caretakers for generations. You gain the Animal Companion class feat even if you don't meet prerequisites. Your companion is a loyal sheep, goat, or other domesticated animal." },
      { name: "Keeper of the Scrolls", description: "Your lineage has been entrusted with preserving ancient knowledge. You gain a +1 circumstance bonus to Decipher Writing and Recall Knowledge checks. You begin play with clay tablets or parchment scrolls containing ancient wisdom worth 10 gp." },
      { name: "Prophet's Lineage", description: "Your family has produced prophets and visionaries. Once per day, you can attempt a DC 15 flat check; on a success, you receive a vague but helpful vision related to an upcoming challenge." }
    ],
    feats: {
      1: [
        { name: "Divine Favor", description: "Once per day, when you fail a saving throw or skill check, you can call upon the Most High for assistance. Reroll the failed check. You must use the second result." },
        { name: "Righteous Heritage", description: "You begin with 2 Righteousness Points (RP) instead of the normal starting amount. These represent your blessed heritage and connection to the righteous line." },
        { name: "Scriptural Knowledge", description: "You gain Heal and Religion as trained skills. If already trained, you gain a +1 circumstance bonus to checks with those skills." },
        { name: "Voice of Reason", description: "You can use your Wisdom modifier instead of Charisma for Diplomacy checks. You gain a +1 circumstance bonus to Diplomacy checks when attempting to calm or reason with hostile creatures." }
      ],
      5: [
        { name: "Blessing of Protection", description: "Once per day, when an ally within 30 feet is about to take damage, you interpose yourself spiritually. The ally gains resistance 5 to all damage from the triggering attack (10 if a fellow Sethite)." },
        { name: "Guided Strike", description: "When you Strike with a melee weapon, you can add your Wisdom modifier to the damage roll instead of Strength or Dexterity. Applies only to the first damage roll." },
        { name: "Sanctuary Aura", description: "Once per day as a single action (concentrate), you create a zone of divine protection in a 10-foot emanation for 1 minute. Evil creatures and corrupted beings (3+ CP) take a -1 status penalty to attack rolls within this aura." },
        { name: "Word of Warning", description: "Once per day, when you or an ally within 60 feet is about to be surprised, you cry out a warning. The triggering creature and all allies within 60 feet are no longer surprised." }
      ],
      9: [
        { name: "Divine Intervention", description: "Once per week, when you or an ally within 30 feet is reduced to 0 HP, the Most High answers your prayer. The creature is restored to 1 HP and gains temporary HP equal to your level, plus one condition is removed." },
        { name: "Righteous Fury", description: "When you have 3+ RP, you can spend 3 RP as a free action when you Strike. The Strike deals an additional 2d6 damage (3d6 against evil creatures or those with 3+ CP)." },
        { name: "Spiritual Resilience", description: "You gain a +2 status bonus to saves against fear and possession. When you succeed at a save against a mental effect, you can spend 1 RP to turn the success into a critical success." },
        { name: "Teaching the Righteous", description: "You can spend 10 minutes instructing up to 6 allies in the ways of righteousness. They gain +1 to saves against corruption effects and possession for 1 hour. Usable once per day." }
      ],
      13: [
        { name: "Blessed Champion", description: "When you have 5+ RP, you can touch an ally and spend 2 RP to grant them the effects of the Bless spell for 1 minute. Usable once per day." },
        { name: "Divine Shield", description: "Once per day when you or an ally within 30 feet is hit by an attack, you raise a shield of divine energy. The attack is treated as a miss. If from an evil/corrupted creature, the attacker takes 3d6 radiant damage." },
        { name: "Prophetic Insight", description: "Once per day, you receive a clear vision. For 1 hour, you gain +2 to all skill checks and saves, and can reroll one failed check." },
        { name: "Righteous Judgment", description: "When you have 5+ RP, you can spend 5 RP as a single action to mark a creature within 60 feet as anathema for 1 minute. Attacks against it deal +1d6 radiant damage and it takes -2 to saves against divine effects." }
      ],
      17: [
        { name: "Avatar of Righteousness", description: "Once per week, you become an avatar of divine judgment for 1 minute: +3d6 radiant damage on all Strikes, resistance 15 to all damage except force, evil creatures within 30 feet are frightened, and you can spend RP to fuel divine spells." },
        { name: "Eternal Legacy", description: "Your Teaching the Righteous bonuses last 8 hours instead of 1, affected creatures gain temporary HP equal to your level, and each gains 1 RP at the end of the duration." },
        { name: "Hand of the Creator", description: "Once per month, when a creature within 120 feet is killed, you call upon the Creator to restore life. The creature is restored with 1 HP and all conditions removed. Cannot restore creatures dead more than 1 minute. Reduces your max HP by 20 until a full week of downtime." },
        { name: "Pillar of Faith", description: "Once per day as two actions (concentrate) for 1 minute: you cannot be moved against your will, gain +4 to AC and saves, allies within 30 feet gain +2 to AC and saves, and you can spend 1 RP as a single action to heal an ally 1d8+level HP." }
      ]
    },
    languages: ["Common", "Celestial"],
    heightRange: { male: [65, 72], female: [60, 67] },
    visuals: "simple robes of wool and unbleached linen, prayer shawl with tassels, holding ancient scroll",
    accessory: "prayer shawl, scroll case, or holy phylactery"
  },
  Cainite: {
    name: "Cainite (City Builder)",
    desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization. City-builders who bear the Mark of Cain.",
    hp: 8,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["Free", "Free"],
    abilityFlaw: "Free",
    startingRP: 0,
    startingCP: 1,
    traits: ["City Born (+1 Urban Recall Knowledge)", "Mark of Cain (Protection from vengeance)", "Builder's Heritage (Proficiency with artisan tools)"],
    heritages: [
      { name: "Son of Tubal-Cain", description: "Your lineage traces to Tubal-Cain, the first metalworker. You gain proficiency with Crafting and a +1 circumstance bonus to Crafting checks involving metal." },
      { name: "Music of Jubal", description: "Your family descends from Jubal, the first musician. You gain Performance as a trained skill and can use musical instruments to grant allies a +1 status bonus to Will saves for 10 minutes." },
      { name: "Walled City Heritage", description: "You grew up within the fortified walls of Enoch. You gain a +1 circumstance bonus to AC when you have cover from a wall or fortification." },
      { name: "Mark-Bearer", description: "The Mark of Cain manifests strongly in you. Attackers who deal damage to you suffer divine retribution: 1d6 psychic damage per attack. This increases to 2d6 at level 10." }
    ],
    feats: {
      1: [
        { name: "Mark of Cain", description: "You cannot be targeted by vengeance attacks. Attackers who reduce you to 0 HP suffer divine retribution: 1d6 damage." },
        { name: "City Born", description: "You gain a +1 circumstance bonus to Recall Knowledge checks in urban environments and to Society checks." },
        { name: "Builder's Heritage", description: "You gain proficiency with artisan tools and a +1 circumstance bonus to Crafting checks." }
      ],
      5: [
        { name: "Bronze Mastery", description: "When using bronze weapons or armor, you gain a +1 item bonus to attack rolls and AC respectively." },
        { name: "Urban Network", description: "In urban environments, you can always find shelter, basic supplies, and information. You gain a +2 circumstance bonus to Society checks in cities." },
        { name: "Vengeful Mark", description: "The retribution from your Mark of Cain intensifies. Attackers now take 2d6 damage when they hit you with a critical hit." }
      ],
      9: [
        { name: "Master Artisan", description: "You can craft items in half the normal time. When you Craft, you can create an additional item for free on a critical success." },
        { name: "City Guard Tactics", description: "When an ally within 10 feet is attacked, you can use your reaction to grant them a +2 circumstance bonus to AC against that attack." },
        { name: "Iron Will of the City", description: "You gain a +2 status bonus to saves against fear and compulsion effects while in an urban environment." }
      ],
      13: [
        { name: "Forge Master", description: "You can craft magic weapons and armor using forbidden or divine techniques. Reduce the cost of crafting magical items by 25%." },
        { name: "Defender of the Walls", description: "When you have cover from a wall or fortification, you and allies within 10 feet gain resistance to physical damage equal to your level." },
        { name: "Mark of Retribution", description: "Your Mark of Cain now affects all who attack you: each attacker takes 1d6 damage per round they attack you, regardless of hit outcome." }
      ],
      17: [
        { name: "Titan Forge", description: "You can forge items of legendary quality. Weapons you craft gain a +2 item bonus and deal an additional die of damage. Armor you craft grants an additional +2 AC." },
        { name: "City of Refuge", description: "Once per day, you can declare a 30-foot area a sanctuary. No violence can occur within it for 1 minute. Creatures inside gain fast healing equal to your level." },
        { name: "Seventh-Generation Mark", description: "Your Mark of Cain becomes absolute protection. You are immune to death effects and attacks that would instantly kill you. Attackers who target you take 3d6 untyped damage." }
      ]
    },
    languages: ["Common", "Giant"],
    heightRange: { male: [66, 73], female: [61, 68] },
    visuals: "elaborate dyed crimson and purple fabrics, heavy bronze ornamentation, gold jewelry, Mesopotamian city attire",
    accessory: "bronze jewelry, musical instrument (lyre/flute), or artisan's hammer"
  },
  Wanderer: {
    name: "Wanderer (Nomad)",
    desc: "Those who rejected both the cities of Cain and the strictures of Seth. Nomadic survivalists who walk the untamed lands.",
    hp: 10,
    size: "Medium",
    speed: 30,
    abilityBoosts: ["Free", "Free"],
    abilityFlaw: "Free",
    startingRP: 0,
    startingCP: 0,
    traits: ["Survivalist (+1 Subsist/Survival)", "Swift Footed (30ft base Speed)"],
    heritages: [
      { name: "Desert Walker", description: "You are adapted to arid environments. You gain resistance to fire equal to half your level (minimum 1) and need half the normal amount of water." },
      { name: "Mountain Strider", description: "You are at home in rugged terrain. You ignore difficult terrain from rocks, scree, and steep slopes. You gain a +1 bonus to Athletics checks to Climb." },
      { name: "Plains Runner", description: "Your people run the vast grasslands. Your Speed increases by 5 feet. When you Take Cover in open terrain, you gain standard cover instead of partial." },
      { name: "River Nomad", description: "Your clan travels along waterways. You gain a swim Speed of 15 feet and can hold your breath for 5 minutes." }
    ],
    feats: {
      1: [
        { name: "Survivalist", description: "You gain a +1 circumstance bonus to Subsist and Survival checks. You can always find shelter and food in wilderness environments." },
        { name: "Swift Footed", description: "Your base Speed is 30 feet instead of 25." },
        { name: "Keen Senses", description: "You gain a +1 circumstance bonus to Perception checks in wilderness and a +2 bonus to Sense Motive against creatures of the wild." }
      ],
      5: [
        { name: "Trailblazer", description: "You and allies traveling with you ignore difficult terrain from non-magical wilderness sources. Your overland travel speed is 50% faster." },
        { name: "Weather Eye", description: "You can predict weather 24 hours in advance. You and allies gain a +2 status bonus to saves against environmental effects." },
        { name: "Nomad's Step", description: "Once per round, you can Step as a free action. Your Speed increases by an additional 5 feet." }
      ],
      9: [
        { name: "Pathfinder", description: "You can never become lost. You always know the direction to a location you've visited. You gain a +2 status bonus to Survival and Perception to Avoid Notice and Track." },
        { name: "Wilderness Medic", description: "You can use Nature or Survival instead of Medicine for Treat Wounds. When you do, the target gains additional HP equal to your level." },
        { name: "Wind Runner", description: "Your Speed increases by 10 feet total. When you use the Run action, you can move 5 times your Speed instead of 4." }
      ],
      13: [
        { name: "Untamed Spirit", description: "You gain a +4 status bonus to saves against compulsion, charm, and possession effects. When you break free of such an effect, you gain 1 RP." },
        { name: "Terrain Master", description: "Choose one terrain type. In that terrain, you gain a +2 bonus to AC and all saves, and allies within 30 feet gain a +1 bonus." },
        { name: "Ghost Step", description: "Once per day, you can become incorporeal for 1 round, allowing you to pass through solid objects and ignore physical damage." }
      ],
      17: [
        { name: "World Walker", description: "You ignore all difficult terrain. You can travel at full speed regardless of conditions. You gain a climb Speed, swim Speed, and fly Speed equal to your land Speed." },
        { name: "Eternal Nomad", description: "You never need to make Survival checks to Subsist. You and allies traveling with you are immune to non-magical environmental hazards." },
        { name: "Storm Stride", description: "Once per day, you can teleport up to 1 mile to a wilderness location you can see or have visited. You and up to 5 allies can travel with you." }
      ]
    },
    languages: ["Common"],
    heightRange: { male: [64, 71], female: [59, 66] },
    visuals: "practical rough-spun tunic, animal hide cloak, tribal bead decorations, dusty travel gear",
    accessory: "tribal totems, bone necklace, or hunting fetish"
  },
  Nephilim: {
    name: "Nephilim (1st Gen Giant)",
    desc: "Direct offspring of Watchers and Humans. Titans of the ancient world, standing 12-15 feet tall with angelic resistance and insatiable hunger.",
    hp: 12,
    size: "Large",
    speed: 25,
    abilityBoosts: ["STR", "CON", "Free"],
    abilityFlaw: "DEX",
    startingRP: 0,
    startingCP: 3,
    traits: ["Angelic Resistance (Radiant 5)", "Insatiable Hunger", "Powerful Build", "Large Size (10ft reach)"],
    heritages: [
      { name: "Azazel-Born", description: "Your lineage traces to Azazel, who taught warfare. You gain proficiency with all martial weapons and a +1 circumstance bonus to attack rolls with bronze weapons." },
      { name: "Semyaza-Born", description: "Your lineage traces to Semyaza, who taught enchantments. You gain a +2 circumstance bonus to saves against enchantment effects and can cast Charm once per day." },
      { name: "Titan's Might", description: "Your angelic heritage manifests in raw power. You count as two sizes larger for carrying capacity and your unarmed strikes deal 1d8 damage." },
      { name: "Celestial Visage", description: "Your angelic blood grants you an otherworldly presence. You gain a +2 circumstance bonus to Intimidation and can cast Divine Aura once per day." }
    ],
    feats: {
      1: [
        { name: "Angelic Resistance", description: "You gain resistance 5 to radiant damage. At level 10, this increases to resistance 10." },
        { name: "Insatiable Hunger", description: "You require 4x normal food. If you go without food for a day, you take a -1 penalty to all checks and lose 1 HP per hour." },
        { name: "Powerful Build", description: "You count as one size larger for carrying capacity, grappling, and shove attempts." },
        { name: "Large Size", description: "You are Large (12-15 feet tall). You have a reach of 10 feet. You take up a 10-foot square." }
      ],
      5: [
        { name: "Giant's Grip", description: "You can wield two-handed weapons in one hand without penalty. When you wield a weapon with the two-handed trait in two hands, you deal an additional die of damage." },
        { name: "Crushing Blow", description: "Once per round, when you hit with a melee Strike, you can push the target 5 feet. If you critically hit, the target is also knocked prone." },
        { name: "Titan's Hide", description: "Your resistance to radiant increases by 5 and you gain resistance 5 to physical damage from non-magical weapons." }
      ],
      9: [
        { name: "Earthshaker", description: "Once per day, you can slam the ground as a 2-action activity. All creatures within 20 feet must make a Reflex save or fall prone and take 3d6 bludgeoning damage." },
        { name: "Devouring Maw", description: "When you hit a creature with a melee attack, you can choose to bite as a free action dealing 1d8 piercing damage and regaining HP equal to the damage dealt." },
        { name: "Giant's Leap", description: "You can Leap up to 30 feet horizontally or 15 feet vertically. When you land, creatures within 10 feet take 2d6 bludgeoning damage." }
      ],
      13: [
        { name: "Colossal Rage", description: "Once per day, you can enter a titanic rage for 1 minute. You grow to Huge size, gain +4 to Strength, and your reach increases to 20 feet. You gain temporary HP equal to twice your level." },
        { name: "Angelic Wrath", description: "Your attacks deal an additional 2d6 radiant damage. Undead and demonic creatures take 3d6 instead." },
        { name: "Unbreakable", description: "You gain resistance 10 to all physical damage. When you would be reduced to 0 HP, you can instead stay at 1 HP with half your max HP as temporary HP. Usable once per day." }
      ],
      17: [
        { name: "Titan Lord", description: "You are treated as Gargantuan for carrying capacity and reach. Your melee attacks have a 20-foot reach. You can affect up to 3 creatures with your Earthshaker." },
        { name: "Angel-Devoured", description: "You can consume the essence of slain celestials and fiends to permanently gain +2 to one ability score. Usable once per level." },
        { name: "Walking Calamity", description: "Once per day for 1 minute, you become a walking natural disaster. Structures within 10 feet take 6d6 bludgeoning damage, creatures are pushed 10 feet, and difficult terrain of your choice forms in your wake." }
      ]
    },
    languages: ["Common", "Giant", "Celestial"],
    heightRange: { male: [144, 180], female: [132, 168] },
    visuals: "colossal stature, massive bronze scale armor, divine but terrible countenance, clothing scaled to immense size",
    accessory: "massive bronze armor plates, giant's chain, or trophy skulls"
  },
  Rephaim: {
    name: "Rephaim (Shade/Giant)",
    desc: "Later generations of giants, often associated with the dead and the underworld. Their spirits Sight reveals the unseen.",
    hp: 10,
    size: "Large",
    speed: 25,
    abilityBoosts: ["STR", "CON", "Free"],
    abilityFlaw: "CHA",
    startingRP: 0,
    startingCP: 2,
    traits: ["Spirit Sight (See Invisibility)", "Deathly Aura (-1 fear saves 10ft)", "Intimidating Presence (+1 Intimidation)"],
    heritages: [
      { name: "Shade-Touched", description: "Your connection to the dead is strong. You can see and communicate with spirits within 30 feet. You gain a +2 circumstance bonus to Occultism checks regarding the undead." },
      { name: "Barrow-Born", description: "You were raised among the burial mounds. You gain resistance to necrotic damage equal to half your level (minimum 1) and a +1 to Fortitude saves against disease." },
      { name: "Wailing Spirit Heritage", description: "The spirits of the dead cry out to you. Once per day, you can emit a terrifying wail. All enemies within 30 feet must make a Will save or be frightened 1 (frightened 2 on critical failure)." },
      { name: "Grave Walker", description: "You move between the lands of the living and the dead. You can see into the Shadow Realm within 60 feet and gain a +2 to saves against death effects." }
    ],
    feats: {
      1: [
        { name: "Spirit Sight", description: "You can see invisible spirits and ghosts within 60 feet. You gain a +2 circumstance bonus to Perception against invisible creatures." },
        { name: "Deathly Aura", description: "Living creatures within 10 feet take a -1 status penalty to saves against fear effects." },
        { name: "Intimidating Presence", description: "You gain a +1 circumstance bonus to Intimidation checks." }
      ],
      5: [
        { name: "Soul Drain", description: "Once per day, when you hit a living creature with a melee Strike, you can drain its vitality. The target takes 1d6 necrotic damage and you regain HP equal to the damage dealt." },
        { name: "Shade Form", description: "Once per day, you can become partially incorporeal for 1 minute. You gain resistance 10 to physical damage but vulnerability 10 to radiant." },
        { name: "Spirit Binding", description: "You can attempt to bind a willing or defeated spirit into an object, creating a minor magic item. This takes 1 hour." }
      ],
      9: [
        { name: "Army of the Dead", description: "Once per day, you can summon 1d4 spirit warriors that fight for you for 1 minute. They use your level -4 for their statistics." },
        { name: "Death's Doorstep", description: "When you are reduced to 0 HP, you don't fall unconscious. Instead, you can continue acting for 1 round at -1 to all checks. You then fall unconscious." },
        { name: "Necrotic Strike", description: "Your melee attacks deal an additional 1d6 necrotic damage. Against living creatures, this increases to 2d6." }
      ],
      13: [
        { name: "Master of Spirits", description: "You can command undead with Intelligence -2 or lower. Once per day, you can attempt to control a sentient undead (Will save resists)." },
        { name: "Shadow Step", description: "Once per round, you can teleport 30 feet to a location in dim light or darkness as a single action." },
        { name: "Death Ward", description: "You gain immunity to death effects and resistance 15 to necrotic damage. Allies within 10 feet gain resistance 10 to necrotic." }
      ],
      17: [
        { name: "Lord of the Refa'im", description: "You gain the ability to raise dead warriors permanently as your servants. You can control up to your level in undead HD. Undead under your control gain a +2 status bonus to attack and damage." },
        { name: "Between Worlds", description: "You are simultaneously alive and dead. You gain immunity to necrotic damage, and healing works on you regardless of whether it normally affects living or undead." },
        { name: "Soul Harvest", description: "When a creature dies within 30 feet of you, you can harvest its soul. You gain temporary HP equal to its level × 5 and 1 CP." }
      ]
    },
    languages: ["Common", "Giant", "Necromatic"],
    heightRange: { male: [108, 132], female: [102, 126] },
    visuals: "dark tattered robes, greyish skin tones, bone and skull motifs, ancient funerary armor",
    accessory: "death shroud, spirit talisman, or ancient burial mask"
  },
  Anakim: {
    name: "Anakim (Noble Giant)",
    desc: "The 'Long-Necked Ones'. Noble giants known for chain weapons and regal bearing. They wear heavy chains as symbols of status.",
    hp: 12,
    size: "Large",
    speed: 25,
    abilityBoosts: ["STR", "CHA", "Free"],
    abilityFlaw: "DEX",
    startingRP: 0,
    startingCP: 2,
    traits: ["Chain Master (15ft grapple reach)", "Noble Bearing (+1 Diplomacy vs giants)", "Long-Necked (+1 Perception)"],
    heritages: [
      { name: "Chain Lord", description: "You are descended from a line of chain-wielding nobles. You gain proficiency with chain weapons and a +1 circumstance bonus to Athletics checks to Grapple with chains." },
      { name: "Golden Heritage", description: "Your family hoards gold and displays it openly. You start with double the normal starting gold and gain a +2 to Diplomacy with merchants and traders." },
      { name: "Three Brothers", description: "Like Sheshai, Talmai, and Ahiman, you fight best alongside kin. When an ally is within 10 feet, you gain a +1 circumstance bonus to attack rolls." },
      { name: "Neck of the Anakim", description: "Your elongated neck gives you unparalleled awareness. You gain a +2 status bonus to Perception checks and can see over obstacles that would block a Medium creature's line of sight." }
    ],
    feats: {
      1: [
        { name: "Chain Master", description: "You gain proficiency with chain weapons. You can Grapple at 15-foot reach when wielding a chain. The target takes a -2 penalty to Escape your Grapple." },
        { name: "Noble Bearing", description: "You gain a +1 circumstance bonus to Diplomacy checks with other giants and a +1 to Perception checks." },
        { name: "Heavy Chains", description: "When you wear chain jewelry (always), you gain a +1 item bonus to Intimidation and a +1 status bonus to AC against grapple attempts." }
      ],
      5: [
        { name: "Chain Sweep", description: "Once per round, you can make a chain sweep attack as a 2-action activity. All creatures within 15 feet must make a Reflex save or be tripped and take 2d6 bludgeoning damage." },
        { name: "Royal Command", description: "Once per day, you can issue a command as a 1-action activity. One creature within 30 feet that can hear you must make a Will save or obey a single command." },
        { name: "Iron Will", description: "You gain a +2 status bonus to Will saves against fear and compulsion effects. When you succeed, all allies within 30 feet gain a +1 bonus against the same effect." }
      ],
      9: [
        { name: "Chain Binding", description: "When you Grapple a creature with a chain, you can attempt to Bind them as a single action. The target is restrained until they succeed at an Escape check against your Athletics DC." },
        { name: "Regal Presence", description: "Your noble bearing intimidates lesser beings. All enemies within 15 feet take a -1 status penalty to attack rolls against you. Once per day, you can make a Demoralize check against all enemies within 30 feet." },
        { name: "Giant's Constitution", description: "You gain a +2 status bonus to Fortitude saves. You are immune to the fatigued condition." }
      ],
      13: [
        { name: "Chain Storm", description: "Once per day as a 3-action activity, you spin chains around you in a deadly storm. All creatures within 20 feet take 4d6 bludgeoning damage and are pulled 10 feet toward you (Reflex half)." },
        { name: "Unbreakable Chains", description: "Chains you create or wield are impossible to break by normal means. Your Grapple DC increases by 4. Bound creatures require magic to escape." },
        { name: "Crown of the Anakim", description: "You gain a +4 status bonus to Diplomacy with all creatures. Once per day, you can call upon your noble authority to end a combat (Will save resists by hostile creatures)." }
      ],
      17: [
        { name: "Titan Tyrant", description: "Your chains can reach 30 feet and deal an additional 2d6 damage. When you Bind a creature, it takes 1d6 constriction damage at the start of each of its turns." },
        { name: "King of Chains", description: "You can summon magical chains once per day that Bind up to 4 creatures within 60 feet (Will save resists). Bound creatures are restrained for 1 minute." },
        { name: "Unconquerable Will", description: "You are immune to all compulsion, charm, and possession effects. Allies within 30 feet gain a +4 status bonus to saves against these effects." }
      ]
    },
    languages: ["Common", "Giant"],
    heightRange: { male: [120, 156], female: [114, 144] },
    visuals: "massive bronze chain links across shoulders, braided hair with gold rings, regal Canaanite noble attire",
    accessory: "heavy gold chains (neck/wrist), royal signet, or ceremonial shackles"
  },
  Gibborim: {
    name: "Gibborim (Mighty One)",
    desc: "Human-Giant hybrids. The 'Mighty Ones of Old' - heroic warriors of renown standing 6.5-8 feet tall.",
    hp: 10,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["STR", "CON", "Free"],
    abilityFlaw: null,
    startingRP: 0,
    startingCP: 1,
    traits: ["Powerful Build (counts as Large for carry/push)", "Martial Training (+1 Athletics)", "Heroic Blood (+1 vs fear)"],
    heritages: [
      { name: "Hero's Blood", description: "Your bloodline carries the legacy of legendary warriors. Once per day, you can add +10 to any attack roll as a free action." },
      { name: "Giant's Constitution", description: "Your hybrid vigor grants exceptional health. You gain an additional 2 HP per level and advantage on Fortitude saves against disease and poison." },
      { name: "Martial Heritage", description: "You were trained in the combat arts from childhood. You gain proficiency with all martial weapons and a +1 circumstance bonus to Athletics checks." },
      { name: "Battle-Hardened", description: "Your body bears the scars of countless battles. You gain resistance 2 to bludgeoning, piercing, and slashing damage from non-magical weapons." }
    ],
    feats: {
      1: [
        { name: "Powerful Build", description: "You count as one size larger for carrying capacity and determining whether you can push, drag, or lift objects." },
        { name: "Martial Proficiency", description: "You gain proficiency with all martial weapons." },
        { name: "Heroic Feat", description: "Once per long rest, you can add +10 to any attack roll." }
      ],
      5: [
        { name: "Mighty Blow", description: "When you hit with a two-handed melee weapon, you deal an additional die of weapon damage." },
        { name: "Tireless", description: "You gain a +2 status bonus to Fortitude saves against fatigue effects. You can stride for 12 hours without needing rest." },
        { name: "Giant's Grip", description: "You can wield two-handed weapons in one hand. When you do, you take a -1 penalty to attack rolls." }
      ],
      9: [
        { name: "Legendary Reputation", description: "Your name is known across the land. You gain a +4 circumstance bonus to Diplomacy and Intimidation checks with anyone who has heard of you." },
        { name: "Heroic Surge", description: "Once per day, you can take an additional full turn. After this surge, you are fatigued until you rest." },
        { name: "Battle Fury", description: "When you are reduced below half HP, you enter a fury. You gain +2 to attack and damage rolls and resistance 5 to all physical damage for 1 minute." }
      ],
      13: [
        { name: "Champion's Challenge", description: "Once per day as a single action, you challenge a creature within 60 feet. It must target you or take a -2 penalty to attack rolls against others. Lasts 1 minute." },
        { name: "Unstoppable", description: "You gain resistance 10 to all physical damage. When you would be moved against your will, you can attempt a Fortitude save to resist." },
        { name: "Heroic Resurgence", description: "Once per day, when you would be reduced to 0 HP, you are instead restored to half your max HP and gain temporary HP equal to your level." }
      ],
      17: [
        { name: "Mighty Hero", description: "Your Might Blow adds 2 additional dice. You can critically hit on a roll of 19 or 20. Your attacks ignore resistance to physical damage." },
        { name: "Immortal Legend", description: "You gain a +4 status bonus to saves against death effects. If you die, you return to life after 1d6 days with full HP. You gain 1 CP each time this occurs." },
        { name: "Titan's Wrath", description: "Once per day, for 1 minute, you deal double damage on all melee Strikes, gain resistance 20 to all physical damage, and your reach increases by 10 feet." }
      ]
    },
    languages: ["Common", "Giant"],
    heightRange: { male: [78, 96], female: [72, 90] },
    visuals: "muscular heroic build, lion pelt cloak, bronze bracers, oils of anointing",
    accessory: "lion pelt cloak, hero's bronze bracers, or trophy weapon"
  },
  Horim: {
    name: "Horim (Cave Dweller)",
    desc: "Giant-kin adapted to underground life. Masters of stone and darkness with superior darkvision but sunlight sensitivity.",
    hp: 8,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["DEX", "WIS", "Free"],
    abilityFlaw: "CHA",
    startingRP: 0,
    startingCP: 1,
    traits: ["Superior Darkvision (120ft)", "Stone Cunning (+1 stonework/geology)", "Sunlight Sensitivity (dazzled in sunlight)"],
    heritages: [
      { name: "Deep Delver", description: "Your people live far beneath the earth. Your darkvision extends to 150 feet and you gain a climb Speed of 20 feet." },
      { name: "Stone Speaker", description: "You can hear vibrations in stone. You gain a +2 to Perception checks to detect creatures through stone walls and tremorsense 10 feet." },
      { name: "Crystal Born", description: "Your eyes adapted to the faint luminescence of cave crystals. You gain low-light vision in addition to darkvision and a +1 to Crafting checks involving gems or crystals." },
      { name: "Fungus Forager", description: "You know the secrets of cave fungi. You gain a +2 to Nature checks underground and can identify poisons and diseases from caves automatically." }
    ],
    feats: {
      1: [
        { name: "Superior Darkvision", description: "You can see in darkness up to 120 feet as if it were bright light." },
        { name: "Stone Cunning", description: "You gain a +1 circumstance bonus to Perception and Crafting checks related to stonework and geology." },
        { name: "Sunlight Sensitivity", description: "While in direct sunlight, you are dazzled (-1 to visual Perception and ranged attacks)." }
      ],
      5: [
        { name: "Tunnel Fighter", description: "In confined spaces (5-foot corridors), you gain a +1 circumstance bonus to attack rolls and AC." },
        { name: "Stone Sense", description: "You gain tremorsense 30 feet. You can detect creatures through stone walls within range." },
        { name: "Shadow Hiding", description: "In dim light or darkness, you gain a +2 circumstance bonus to Stealth checks. Enemies need to beat your Stealth DC to target you." }
      ],
      9: [
        { name: "Earth Glide", description: "Once per day, you can pass through solid stone as if it were air for 1 minute. You cannot breathe while inside stone and must emerge or suffocate." },
        { name: "Cave Master", description: "Underground, you always know your exact location and the direction to the surface. You gain a +4 to Survival checks underground." },
        { name: "Stone Skin", description: "You gain resistance 5 to bludgeoning and slashing damage from non-magical weapons. In complete darkness, this increases to resistance 10." }
      ],
      13: [
        { name: "Earthen Fortress", description: "Once per day, you can cause stone walls to rise from the ground, creating a 10-foot cube of protective cover that lasts 1 hour." },
        { name: "Darkness Domain", description: "Once per day, you can cast 4th-level Darkness as a divine innate spell. In magical darkness, you gain a +2 to all checks." },
        { name: "Underground King", description: "When underground, you gain a +4 to Perception, allies within 30 feet gain tremorsense 15 feet, and you ignore difficult terrain from stone." }
      ],
      17: [
        { name: "Mountain's Heart", description: "You become one with the earth. You gain immunity to petrification and a burrow Speed of 40 feet through stone. You never need to make saves against cave-ins." },
        { name: "Stone Shape", description: "At will, you can reshape stone with a touch. You can create tunnels, walls, or simple structures from stone in 1 minute." },
        { name: "Titan of the Deep", description: "Once per day, you can cause an earthquake in a 60-foot radius. Structures take massive damage, creatures fall prone and take 6d6 bludgeoning (Reflex half)." }
      ]
    },
    languages: ["Common", "Giant", "Undercommon"],
    heightRange: { male: [72, 82], female: [65, 77] },
    visuals: "simple leather and fur garments, stone and crystal ornaments, pale cave-adapted features",
    accessory: "stone carving tools, luminescent fungi, or cave crystals"
  },
  Elioud: {
    name: "Elioud (Third-Gen Giant-Kin)",
    desc: "Third-generation giant descendants who can pass as large humans. The bridge between the worlds of giants and men.",
    hp: 8,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["STR", "Free"],
    abilityFlaw: null,
    startingRP: 0,
    startingCP: 1,
    traits: ["Diluted Blood (pass as human DC 15)", "Ancestral Echo (1/day +2 STR checks 1 min)", "Mighty Heritage (+1 Grapple/Shove/Trip)"],
    heritages: [
      { name: "Hidden Blood", description: "Your giant heritage is barely detectable. You gain a +2 to Deception checks to pass as fully human and can suppress your giant traits for 1 hour per day." },
      { name: "Awakened Echo", description: "Your ancestral memories are vivid. You gain a +2 to Recall Knowledge checks about giant history and can cast Augury once per day." },
      { name: "Bridge Builder", description: "You navigate both human and giant society. You gain a +1 to Diplomacy with humans and giants, and can speak both Common and Giant fluently." },
      { name: "Sudden Growth", description: "When angered or in danger, you can briefly manifest giant size. Once per day, you can grow to Large size for 1 minute, gaining +2 to Strength and reach 10 feet." }
    ],
    feats: {
      1: [
        { name: "Diluted Blood", description: "You can pass as a large human (DC 15 Perception check to notice giant traits). You gain a +2 to Deception when impersonating a human." },
        { name: "Ancestral Echo", description: "Once per day, you can channel giant strength. You gain +2 to Strength-based checks for 1 minute." },
        { name: "Mighty Heritage", description: "You gain a +1 circumstance bonus to Athletics checks to Grapple, Shove, and Trip." }
      ],
      5: [
        { name: "Blood Awakening", description: "Your giant blood grows stronger. Your Ancestral Echo bonus increases to +4 and lasts 10 minutes. You gain Powerful Build." },
        { name: "Dual Nature", description: "You gain a +1 status bonus to saves against effects that target only humans or only giants. You are treated as both for beneficial effects." },
        { name: "Heritage Memory", description: "Once per day, you can access ancestral memories to gain proficiency in one skill for 10 minutes." }
      ],
      9: [
        { name: "Giant's Resilience", description: "You gain resistance 5 to bludgeoning damage and a +2 to Fortitude saves against poison." },
        { name: "Titan's Reach", description: "Your reach increases by 5 feet when making melee attacks. You can wield weapons sized for Large creatures without penalty." },
        { name: "Blood Surge", description: "Once per day as a free action, you gain +4 to Strength for 1 round. After the surge, you are fatigued for 1 minute." }
      ],
      13: [
        { name: "Giant Form", description: "Once per day, you can grow to Large size for 10 minutes. You gain +4 to Strength, reach 10 feet, and Powerful Build. Your equipment grows with you." },
        { name: "Ancestral Mastery", description: "Choose one feat from any giant ancestry (Nephilim, Rephaim, Anakim, Gibborim, Horim) of level 9 or lower. You gain that feat." },
        { name: "Unbreakable Heritage", description: "You gain immunity to fear. When an ally within 30 feet is affected by fear, you can spend 1 RP to give them a new save with a +4 bonus." }
      ],
      17: [
        { name: "Titan's Awakening", description: "Your giant blood fully awakens. You permanently gain Powerful Build, a +2 to Strength, and resistance 10 to bludgeoning damage. Your reach is permanently 10 feet." },
        { name: "Bridge Between Worlds", description: "You can freely move between human and giant society. You gain a +4 to Diplomacy with all creatures and can use Diplomacy to Make an Impression on hostile creatures." },
        { name: "Blood of Antiquity", description: "Once per day, you can channel the full might of your giant ancestors. For 1 minute, you gain +8 to Strength, resistance 15 to all physical damage, and your size increases to Large." }
      ]
    },
    languages: ["Common", "Giant"],
    heightRange: { male: [74, 84], female: [70, 80] },
    visuals: "clothing that blends into human society but strains at the seams, subtle inhuman features",
    accessory: "ancestral amulet, oversized bronze bracers, or giant-blood tattoos"
  },
  Sorcerer: {
    name: "Sorcerer Clan (Watcher-Taught)",
    desc: "Humans initiated into Watcher mysteries like root-cutting and astrology. They bear the Watcher's Mark and wield forbidden knowledge.",
    hp: 6,
    size: "Medium",
    speed: 25,
    abilityBoosts: ["Free", "Free"],
    abilityFlaw: "Free",
    startingRP: 0,
    startingCP: 2,
    traits: ["Dark Insight (Detect Magic 1/day)", "Watcher's Mark (visible brand)", "Forbidden Knowledge"],
    heritages: [
      { name: "Azazel's Student", description: "You were taught by followers of Azazel, master of warfare and cosmetics. You gain proficiency with martial weapons and can cast Magic Weapon once per day." },
      { name: "Semyaza's Apprentice", description: "You learned root-cutting and enchantments. You gain a +2 to Nature checks involving herbs and can cast Charm once per day." },
      { name: "Star Reader", description: "You studied under Baraqel's tradition. You gain a +2 to Occultism checks and can cast Augury once per day." },
      { name: "Penemue's Scholar", description: "You learned the secret of writing and ink. You gain a +2 to Society checks and can read any written language." }
    ],
    feats: {
      1: [
        { name: "Dark Insight", description: "You can cast Detect Magic as an innate spell once per day. The spell uses your class DC and spellcasting ability." },
        { name: "Watcher's Mark", description: "You bear a visible magical brand indicating your Watcher training. This has social consequences — righteous NPCs may distrust you. You gain a +2 to Occultism checks." },
        { name: "Blood Magic", description: "You can sacrifice HP to fuel spell power. As a free action when casting a spell, you can lose HP equal to the spell's level × 2 to increase the spell's DC by 1." }
      ],
      5: [
        { name: "Forbidden Lore", description: "You gain access to the Watcher spell tradition. You gain a +2 to spell attack rolls and DC when casting Watcher magic spells." },
        { name: "Corruption Risk", description: "When you cast a Watcher magic spell of level 3 or higher, you must make a Will save (DC 15 + spell level) or gain 1 CP." },
        { name: "Elemental Affinity", description: "Choose fire, cold, lightning, or poison. You gain resistance 5 to that damage type and deal an additional 1d6 of that type with your Watcher spells." }
      ],
      9: [
        { name: "Watcher's Gift", description: "You gain a special metamagic option. Once per day, you can cast a spell with one of the following enhancements without increasing the spell level: Reach, Widen, or Heighten +1." },
        { name: "Dark Pact", description: "Once per day, you can call upon your Watcher patron. You gain +2 to spell DC for 1 minute but automatically gain 1 CP." },
        { name: "Forbidden Form", description: "Once per day, you can transform for 1 minute. Choose: flight (40 ft), water breathing + swim 30 ft, or darkvision 120 ft + see invisible." }
      ],
      13: [
        { name: "Master of Forbidden Arts", description: "You gain a +4 to Occultism checks. Your Watcher spells deal half damage on a successful save. You can cast one Watcher spell per day as a 7th-level spell." },
        { name: "Soul Corruption", description: "When you critically hit with a Watcher spell, the target gains 1d4 CP. You regain 1 RP when this happens." },
        { name: "Arcane Shield", description: "Once per day, you can create a shield of Forbidden energy. You gain resistance 15 to all damage for 1 minute but gain 2 CP." }
      ],
      17: [
        { name: "Watcher Ascendant", description: "Your connection to the Watchers becomes absolute. You gain a +6 to Occultism and can cast any Watcher spell you know as a 9th-level effect once per day. Each use grants 1 CP." },
        { name: "Blood of the Fallen", description: "Your blood magic becomes terrifying. You can sacrifice HP equal to your level to automatically critically succeed on a spell attack or force a critical failure on a target's save." },
        { name: "Forbidden Mastery", description: "You no longer need to make Will saves to avoid CP from casting Watcher magic. You gain immunity to Corruption Risk effects. Your Watcher spells deal maximum damage on a crit." }
      ]
    },
    languages: ["Common", "Celestial", "Abyssal"],
    heightRange: { male: [65, 72], female: [60, 67] },
    visuals: "hooded robes concealing mystical marks, carrying star charts and dried herbs, Watchers Mark brand on skin",
    accessory: "star charts, ritual dagger, dried herbs pouch, or crystal focus"
  },
  Gammadim: {
    name: "Gammadim (Under-Walker)",
    desc: "The hidden little people. When the giants claimed the peaks and humans the valleys, the Gammadim claimed the deep places beneath. Tunnel-fighters and survivors.",
    hp: 6,
    size: "Small",
    speed: 25,
    abilityBoosts: ["DEX", "WIS", "Free"],
    abilityFlaw: "STR",
    startingRP: 2,
    startingCP: 0,
    traits: ["Tunnel Fighter (+1 attack in confined spaces)", "Shadow of the Titans (+2 Stealth near Large+ creatures)", "Earth Sense (Tremorsense 15ft)", "Small Size"],
    heritages: [
      { name: "Deep Walker", description: "Your clan lives in the deepest tunnels. Your tremorsense extends to 30 feet and you gain a burrow Speed of 10 feet through soft earth." },
      { name: "Stone Hand", description: "Your hands are adapted for carving and climbing. You gain a climb Speed of 20 feet and a +2 to Crafting checks involving stone or metal." },
      { name: "Shadow Small", description: "You use your small size and the shadows of giants to your advantage. When adjacent to a Large or larger creature, you gain concealment." },
      { name: "Light Bearer", description: "You carry the ancient clay lamps of your people. You can cast Light at will and gain low-light vision. Magical darkness within 10 feet of you is suppressed." }
    ],
    feats: {
      1: [
        { name: "Tunnel Fighter", description: "In confined spaces (corridors 5 feet wide or less), you gain a +1 circumstance bonus to attack rolls and AC." },
        { name: "Shadow of the Titans", description: "When within 10 feet of a Large or larger creature, you gain a +2 circumstance bonus to Stealth checks." },
        { name: "Earth Sense", description: "You gain tremorsense 15 feet, allowing you to detect creatures through vibrations in the ground." }
      ],
      5: [
        { name: "Squeeze", description: "You can move through spaces as small as one-quarter your size without squeezing penalties. You take no penalty to attack rolls while squeezing." },
        { name: "Undercut", description: "Against Large or larger creatures, your melee attacks deal an additional 1d6 precision damage when you're in their space or below them." },
        { name: "Stone's Friend", description: "You gain a +2 to Saves against earth and stone effects. When underground, you gain fast healing 2." }
      ],
      9: [
        { name: "Tunnel Network", description: "You always know the layout of any underground area you've visited. You gain a +4 to Survival checks underground and can never become lost underground." },
        { name: "Hamstring Strike", description: "When you hit a Large or larger creature from below or behind, you can attempt to hamstring them. The target's Speed is reduced by 10 feet (Fortitude negates)." },
        { name: "Earth's Embrace", description: "Once per day, you can merge with stone for 1 minute, gaining resistance 15 to all damage and tremorsense 60 feet. You cannot move or attack while merged." }
      ],
      13: [
        { name: "Giant Bane", description: "Against Large or larger creatures, you gain a +2 to attack rolls and your attacks deal an additional 2d6 precision damage. Your Undercut damage increases to 3d6." },
        { name: "Burrow Master", description: "You gain a burrow Speed of 30 feet through earth and stone. You gain tremorsense 60 feet and can detect hidden doors and passages automatically." },
        { name: "Small but Mighty", description: "Your size belies your ferocity. Once per day, you can add your level to a single damage roll. Against Large+ creatures, this is doubled." }
      ],
      17: [
        { name: "Titan Slayer", description: "Against Large or larger creatures, you gain a +4 to attack rolls, critical hit on 19-20, and deal an additional 4d6 precision damage. You can move through their space without penalty." },
        { name: "Lord of the Deep", description: "Underground, you are nearly invincible. You gain resistance 20 to all damage, tremorsense 120 feet, and burrow Speed 60 feet. Allies within 30 feet gain tremorsense 30 feet." },
        { name: "Giant's Doom", description: "Once per day, you can tunnel beneath a Large+ creature and collapse the ground under it. The target falls 30 feet and is immobilized (Reflex negates). This deals 10d6 bludgeoning damage." }
      ]
    },
    languages: ["Common", "Undercommon", "Giant"],
    heightRange: { male: [36, 48], female: [34, 45] },
    visuals: "small stature, earth-toned wraps, large eyes adapted for dark, stone tools",
    accessory: "sling stones, tunnel-pick, clay lamp, or carved bone fetish"
  }
};