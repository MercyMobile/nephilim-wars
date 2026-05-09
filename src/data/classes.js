export const CLASSES = [
  {
    value: 'Warrior',
    label: 'Warrior (Tribal Fighter)',
    keyAbility: 'STR or DEX',
    hpPerLevel: 10,
    startingGold: 80,
    armorProficiencies: ['Padded Cloth', 'Leather', 'Hide', 'Scale Mail', 'Bronze Breastplate', 'Bronze Half Plate', 'Bronze Chain Mail', 'Bronze Splint', 'Bronze Plate', 'Shield'],
    weaponProficiencies: ['Bronze Dagger', 'Bronze Shortsword', 'Bronze Longsword', 'Bronze Greatsword', 'Bronze Battle Axe', 'Bronze Greataxe', 'Spear', 'Bronze Glaive', 'War Hammer', 'Giant Maul', 'Shortbow', 'Composite Longbow', 'Hand Crossbow', 'Heavy Crossbow', 'Sling', 'Bronze Flail', 'Lance'],
    description: 'The Warrior is the frontline fighter and defender of the tribe. Trained in all forms of armor and weaponry, the Warrior stands between the innocent and the horrors of the antediluvian world. Whether wielding bronze blade or flint-tipped spear, the Warrior embodies the martial strength needed to survive an age of giants and demons.',
    role: 'Frontline Fighter & Defender',
    startingEquipmentOptions: [
      { id: 'bronze_sword', name: 'Bronze Longsword', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'slashing', desc: 'Versatile bronze blade (1d10 two-handed)', soulTag: null },
      { id: 'bronze_greatsword', name: 'Bronze Greatsword', type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'slashing', desc: 'Massive two-handed weapon', soulTag: null },
      { id: 'bronze_battleaxe', name: 'Bronze Battle Axe', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'slashing', desc: 'Heavy war axe (1d10 two-handed)', soulTag: null },
      { id: 'spear_shield', name: 'Spear & Shield', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'piercing', desc: 'Versatile spear (1d8 two-handed), +2 AC from shield', soulTag: null },
      { id: 'war_hammer', name: 'Bronze War Hammer', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Crushing weapon (1d10 two-handed)', soulTag: null },
      { id: 'flail', name: 'Bronze Flail', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Chained weapon, ignores shields', soulTag: null }
    ],
    features: {
      1: [
        { name: 'Fighting Style', description: 'Choose a fighting style that defines your combat approach: Great Weapon Fighting (reroll 1s and 2s on damage dice for two-handed weapons), Two-Weapon Fighting (add ability modifier to off-hand attacks), Defense (+1 AC while wearing armor), or Protection (use reaction to impose disadvantage on attack against ally within 5 ft).', actionCost: null },
        { name: 'Second Wind', description: 'As a bonus action, draw on your stamina to regain hit points. You regain 1d10 + your Warrior level in hit points. Once used, you must finish a short or long rest before using this feature again.', actionCost: 'bonus' },
        { name: 'Tribal Training', description: 'You gain proficiency in two of the following skills: Athletics, Intimidation, Survival, or Perception. You also gain proficiency in land vehicles and one artisan tool of your choice.', actionCost: null }
      ],
      2: [
        { name: 'Action Surge', description: 'On your turn, you can take one additional action on top of your regular action and any bonus actions. Once used, you must finish a short or long rest before using this feature again.', actionCost: 'action' }
      ],
      3: [
        { name: 'Weapon Mastery', description: 'Your training with weapons grants you mastery over them. Choose three masterwork properties: Push (push target 5 ft on hit), Sage (grant ally +1 AC), Slow (reduce target speed by 10 ft on hit), Sunder (reduce target AC by 1 on hit), or Flex (add 1d4 damage once per turn).', actionCost: null }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn.', actionCost: null }
      ],
      6: [
        { name: 'Defender\'s Stance', description: 'As a reaction when you are hit by a melee attack, you can reduce the damage by 1d8 + your Warrior level. You must be wielding a shield or a versatile weapon in two hands to use this feature.', actionCost: 'reaction' }
      ],
      7: [
        { name: 'War Cry', description: 'As a bonus action, let out a tribal war cry. All allies within 30 ft who can hear you gain advantage on their next attack roll before the start of your next turn. Once used, you must finish a short or long rest before using this feature again.', actionCost: 'bonus' }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Indomitable', description: 'You can reroll a saving throw that you fail. If you do so, you must use the new roll. Once used, you must finish a long rest before using this feature again.', actionCost: 'reaction' }
      ],
      10: [
        { name: 'Tactical Advance', description: 'When you take the Dash action, difficult terrain does not cost you extra movement. Additionally, you can make one weapon attack as a bonus action after dashing.', actionCost: 'bonus' }
      ],
      11: [
        { name: 'Second Extra Attack', description: 'You can attack three times instead of once whenever you take the Attack action on your turn.', actionCost: null }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Indomitable (2/Rest)', description: 'You can use Indomitable twice between long rests.', actionCost: 'reaction' }
      ],
      14: [
        { name: 'Shield Wall', description: 'When you are wielding a shield and an adjacent ally is also wielding a shield, you both gain +1 AC. Additionally, allies behind you gain half cover from your shield position.', actionCost: null }
      ],
      15: [
        { name: 'Unyielding', description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once used, you must finish a long rest before using this feature again. Additionally, you have advantage on death saving throws.', actionCost: 'reaction' }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Action Surge (2/Rest)', description: 'You can use Action Surge twice between short or long rests.', actionCost: 'action' }
      ],
      18: [
        { name: 'Champion of the Tribe', description: 'Once per long rest, you can inspire all allies within 60 ft. Each ally gains temporary hit points equal to your Warrior level + your Constitution modifier and advantage on their next attack roll.', actionCost: 'action' }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Legendary Warrior', description: 'You gain three legendary actions you can use at the end of another creature\'s turn: Strike (make one weapon attack, costs 1 action), Defend (grant all allies within 10 ft +2 AC until your next turn, costs 2 actions), Rally (one ally within 30 ft can immediately use their reaction to move up to half their speed and make one attack, costs 2 actions).', actionCost: null }
      ]
    }
  },
  {
    value: 'Gibbor',
    label: 'Gibbor (Mighty Hero)',
    keyAbility: 'STR',
    hpPerLevel: 12,
    startingGold: 60,
    armorProficiencies: ['Hide', 'Scale Mail', 'Bronze Breastplate', 'Bronze Half Plate', 'Bronze Chain Mail', 'Bronze Splint', 'Bronze Plate', 'Shield'],
    weaponProficiencies: ['Bronze Dagger', 'Bronze Shortsword', 'Bronze Longsword', 'Bronze Greatsword', 'Bronze Battle Axe', 'Bronze Greataxe', 'Spear', 'Bronze Glaive', 'War Hammer', 'Giant Maul', 'Shortbow', 'Composite Longbow', 'Hand Crossbow', 'Heavy Crossbow', 'Sling', 'Bronze Flail', 'Lance'],
    description: 'The Gibbor channels the wrath of Nephilim bloodlines into devastating physical power. Designed for characters with giant heritage, the Gibbor embodies the "Mighty Men of Old, Men of Renown" — warriors whose strength exceeds all mortal limits. Their rage is the fury of a dying age, the last echo of angelic rebellion made flesh.',
    role: 'Heavy Damage Dealer',
    startingEquipmentOptions: [
      { id: 'hero_blade', name: "Hero's Greatsword", type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'slashing', desc: 'Legendary bronze blade of champions', soulTag: null },
      { id: 'maul', name: 'Giant Maul', type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'bludgeoning', desc: 'Devastating two-handed crushing weapon', soulTag: null },
      { id: 'glaive', name: 'Bronze Glaive', type: 'melee', useStat: 'STR', damageDice: '1d10', damageType: 'slashing', desc: 'Polearm with reach (10ft)', soulTag: null },
      { id: 'greataxe', name: 'Bronze Greataxe', type: 'melee', useStat: 'STR', damageDice: '1d12', damageType: 'slashing', desc: 'Brutal two-handed axe', soulTag: null },
      { id: 'lance', name: 'Bronze Lance', type: 'melee', useStat: 'STR', damageDice: '1d12', damageType: 'piercing', desc: 'Mounted weapon with reach', soulTag: null }
    ],
    features: {
      1: [
        { name: 'Rage', description: 'As a bonus action, enter a rage for 1 minute. While raging, you gain advantage on Strength checks and saving throws, +2 melee damage, resistance to bludgeoning, piercing, and slashing damage, and cannot cast or concentrate on spells. Your rage ends early if you are knocked unconscious or if you end your turn without having attacked a hostile creature or taken damage since your last turn. You can rage twice per long rest.', actionCost: 'bonus' },
        { name: 'Unarmored Defense', description: 'While not wearing armor, your AC equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.', actionCost: null },
        { name: 'Giant\'s Grip', description: 'You can wield two-handed melee weapons with one hand. When you do so, the weapon deals its normal two-handed damage. Additionally, you count as one size larger for carrying capacity and determining the weight you can push, drag, or lift.', actionCost: null }
      ],
      2: [
        { name: 'Reckless Attack', description: 'When you make your first attack on your turn, you can decide to attack recklessly. Doing so gives you advantage on all melee attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.', actionCost: null }
      ],
      3: [
        { name: 'Mighty Blow', description: 'Once per turn when you hit with a melee weapon attack while raging, you can roll one additional weapon damage die. The extra damage increases to two additional dice at level 11 and three additional dice at level 17.', actionCost: null }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn.', actionCost: null }
      ],
      6: [
        { name: 'Tireless Rage', description: 'Your rage does not end early if you go a turn without attacking or taking damage. Additionally, at the end of a rage, you do not suffer exhaustion. You can now rage three times per long rest.', actionCost: null }
      ],
      7: [
        { name: 'Feral Instinct', description: 'You have advantage on initiative rolls. If you are surprised at the beginning of combat, you can act normally on your first turn if you enter your rage before doing anything else.', actionCost: null }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Brutal Critical', description: 'When you score a critical hit with a melee weapon, you roll three additional weapon damage dice instead of two. If you have Giant\'s Grip and are using the weapon one-handed, the critical still rolls three additional dice.', actionCost: null }
      ],
      10: [
        { name: 'Intimidating Presence', description: 'As an action, you can channel your might to terrify others. Each creature of your choice within 30 ft must make a Wisdom saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or be frightened of you for 1 minute. A frightened creature can repeat the save at the end of each of its turns. You can use this feature a number of times equal to your Charisma modifier (minimum 1) per long rest.', actionCost: 'action' }
      ],
      11: [
        { name: 'Relentless Rage', description: 'If you drop to 0 hit points while raging and do not die outright, you can make a DC 10 Constitution saving throw. On a success, you drop to 1 hit point instead. The DC increases by 5 each time you use this feature between rests.', actionCost: 'reaction' }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Legendary Reputation', description: 'Your name is spoken in fear and awe across the antediluvian world. You have advantage on Charisma (Intimidation) checks. Additionally, when you enter a rage, each hostile creature within 20 ft that can see you must succeed on a Wisdom save or be frightened until the rage ends.', actionCost: null }
      ],
      14: [
        { name: 'Giant\'s Resilience', description: 'While raging, you gain resistance to fire and cold damage in addition to bludgeoning, piercing, and slashing. Your rage damage bonus increases to +4.', actionCost: null }
      ],
      15: [
        { name: 'Persistent Rage', description: 'Your rage is so fierce that it does not end early under any circumstances except your own choice. You can now rage five times per long rest.', actionCost: null }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Earth-Shaker', description: 'While raging, when you hit a creature with a melee attack, you can force it to make a Strength saving throw (DC 8 + your proficiency bonus + your Strength modifier). On a failure, the creature is knocked prone. You can use this feature once per turn.', actionCost: null }
      ],
      18: [
        { name: 'Heroic Might', description: 'Once per long rest, when you hit with a melee attack, you can deal maximum damage instead of rolling. If the target is a giant or a demon, the attack also imposes the stunned condition until the end of its next turn.', actionCost: null }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Avatar of War', description: 'Your rages are unlimited — you can rage any number of times per long rest. While raging, you have immunity to the charmed, frightened, and paralyzed conditions. Your Strength and Constitution scores increase by 4 while raging (maximum 24). Your rage damage bonus increases to +6.', actionCost: 'bonus' }
      ]
    }
  },
  {
    value: 'Hunter',
    label: 'Hunter (Wilderness Expert)',
    keyAbility: 'DEX',
    hpPerLevel: 8,
    startingGold: 70,
    armorProficiencies: ['Padded Cloth', 'Leather', 'Hide', 'Scale Mail', 'Bronze Breastplate', 'Shield'],
    weaponProficiencies: ['Bronze Dagger', 'Bronze Shortsword', 'Spear', 'Shortbow', 'Composite Longbow', 'Hand Crossbow', 'Sling', 'Bronze Scimitar', 'Hunting Javelin'],
    description: 'The Hunter stalks the wild places of the antediluvian world, where giant footprints scar the earth and demon-spirits haunt the ruins. Masters of the bow and the trail, Hunters track prey across desert, mountain, and cursed forest alike. In a world where humanity is prey, the Hunter turns the tables.',
    role: 'Ranged Specialist & Scout',
    startingEquipmentOptions: [
      { id: 'longbow', name: 'Composite Longbow', type: 'ranged', useStat: 'DEX', damageDice: '1d8', damageType: 'piercing', desc: 'Range 150/600, powerful bow', soulTag: null },
      { id: 'shortbow', name: 'Hunting Shortbow', type: 'ranged', useStat: 'DEX', damageDice: '1d6', damageType: 'piercing', desc: 'Range 80/320, quick to draw', soulTag: null },
      { id: 'hand_crossbow', name: 'Hand Crossbow', type: 'ranged', useStat: 'DEX', damageDice: '1d6', damageType: 'piercing', desc: 'Range 30/120, one-handed', soulTag: null },
      { id: 'sling', name: 'Leather Sling', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, simple and silent', soulTag: null },
      { id: 'javelin', name: 'Hunting Javelins', type: 'ranged', useStat: 'STR', damageDice: '1d6', damageType: 'piercing', desc: 'Range 30/120, throwable spear', soulTag: null },
      { id: 'scimitar', name: 'Bronze Scimitar', type: 'melee', useStat: 'DEX', damageDice: '1d6', damageType: 'slashing', desc: 'Light, finesse blade', soulTag: null }
    ],
    features: {
      1: [
        { name: 'Favored Terrain', description: 'Choose one favored terrain: Desert, Mountain, Forest, Plains, Swamp, or Coastal. While traveling in your favored terrain, you cannot become lost, foraging finds twice as much food, your group cannot be surprised (except by invisible creatures), and you move at normal speed when traveling stealthily. If traveling alone, you can move stealthily at a normal pace.', actionCost: null },
        { name: 'Natural Explorer', description: 'You gain proficiency in Survival and one of: Nature, Perception, or Stealth. You have advantage on Wisdom (Survival) checks to track creatures and Intelligence checks to recall information about terrain features.', actionCost: null },
        { name: 'Hunter\'s Mark', description: 'As a bonus action, you can mark a target you can see within 90 ft. For 1 minute, your attacks against the marked target deal an additional 1d6 damage. If the target drops to 0 hit points before the mark ends, you can use a bonus action on a subsequent turn to mark a new target. You can use this feature a number of times equal to your proficiency bonus per long rest.', actionCost: 'bonus' }
      ],
      2: [
        { name: 'Fighting Style', description: 'Choose a fighting style: Archery (+2 bonus to ranged attack rolls), Two-Weapon Fighting (add ability modifier to off-hand attacks), or Blind Fighting (you have 10 ft of blindsight).', actionCost: null }
      ],
      3: [
        { name: 'Hunter\'s Prey', description: 'Choose one: Colossus Slayer (when you hit a creature with a weapon attack that is below its hit point maximum, it takes an additional 1d8 damage), Giant Killer (when a Large or larger creature misses you with a melee attack, you can use your reaction to make a melee attack against it), or Horde Breaker (when you make a weapon attack, you can make another attack against a different creature within 5 ft of the original target).', actionCost: null }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn.', actionCost: null }
      ],
      6: [
        { name: 'Favored Enemy', description: 'Choose a type of favored enemy: Giants, Demons (Refa\'im), Beasts, or Corrupted Humans. You have advantage on Wisdom (Survival) checks to track them and Intelligence checks to recall information about them. Your Hunter\'s Mark deals an additional 1d4 damage against your favored enemy.', actionCost: null }
      ],
      7: [
        { name: 'Precise Shot', description: 'Your ranged attacks ignore half cover and three-quarters cover. When a creature within 30 ft of you is partially concealed, you do not suffer disadvantage on ranged attacks against it.', actionCost: null }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Multiattack Defense', description: 'When a creature hits you with a melee attack, you gain +4 AC against all subsequent attacks from that creature for the rest of the turn.', actionCost: null }
      ],
      10: [
        { name: 'Hide in Plain Sight', description: 'You can spend 1 minute creating a camouflage. As long as you remain motionless, you are invisible to creatures more than 10 ft away. You can end this invisibility at any time by moving, attacking, or casting a spell.', actionCost: null }
      ],
      11: [
        { name: 'Stalker\'s Flurry', description: 'Once per turn when you miss with a weapon attack, you can make one additional attack against the same target as part of the same action.', actionCost: null }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Second Favored Terrain', description: 'You choose a second favored terrain. Additionally, while in any favored terrain, you and allies within 30 ft travel at double speed and have advantage on Wisdom (Perception) checks.', actionCost: null }
      ],
      14: [
        { name: 'Vanish', description: 'You can use the Hide action as a bonus action on your turn. Additionally, you cannot be tracked by nonmagical means unless you choose to leave a trail.', actionCost: 'bonus' }
      ],
      15: [
        { name: 'Second Favored Enemy', description: 'Choose a second favored enemy. You gain advantage on saving throws against abilities used by your favored enemies. Your Hunter\'s Mark now deals an additional 1d6 against both favored enemies.', actionCost: null }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Killing Shot', description: 'Once per long rest, when you hit a creature with a ranged weapon attack, you can make it a critical hit regardless of the roll. If the target has fewer than 50 hit points after the damage, it must make a Constitution saving throw (DC 8 + your proficiency bonus + your Dexterity modifier) or drop to 0 hit points.', actionCost: null }
      ],
      18: [
        { name: 'Feral Senses', description: 'You gain preternatural awareness of your surroundings. You have blindsight out to 30 ft. You can see invisible creatures within this range. You have advantage on initiative rolls and cannot be surprised while conscious.', actionCost: null }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Legendary Stalker', description: 'You gain three legendary actions you can use at the end of another creature\'s turn: Shoot (make one ranged attack, costs 1 action), Move (move up to your speed without provoking opportunity attacks, costs 1 action), or Mark (use Hunter\'s Mark on a visible target without using your bonus action, costs 2 actions). You have unlimited uses of Hunter\'s Mark.', actionCost: null }
      ]
    }
  },
  {
    value: 'Magi',
    label: 'Magi (Watcher-Taught Sorcerer)',
    keyAbility: 'INT',
    hpPerLevel: 6,
    startingGold: 50,
    armorProficiencies: [],
    weaponProficiencies: ['Bronze Dagger', 'Staff', 'Wand', 'Orb', 'Rod'],
    description: 'The Magi wields the forbidden knowledge taught by the Watchers — the fallen angels who descended on Mount Hermon. Their power comes from arcane secrets: the reading of stars, the cutting of roots, the binding of words. Every spell risks Corruption Points, for this magic was never meant for mortal hands. The Magi walks the razor\'s edge between power and damnation.',
    role: 'Elemental Damage Caster',
    startingEquipmentOptions: [
      { id: 'arcane_staff', name: 'Watcher-Carved Staff', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'force', desc: 'Eldritch Blast - forbidden Watcher magic', soulTag: 'CP_risk' },
      { id: 'fire_wand', name: 'Wand of Fire', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'fire', desc: 'Fire Bolt - flames of destruction', soulTag: 'CP_risk' },
      { id: 'frost_orb', name: 'Orb of Winter', type: 'spell', useStat: 'INT', damageDice: '1d8', damageType: 'cold', desc: 'Ray of Frost - freezing magic', soulTag: 'CP_risk' },
      { id: 'shock_rod', name: 'Lightning Rod', type: 'spell', useStat: 'INT', damageDice: '1d8', damageType: 'lightning', desc: 'Shocking Grasp - electric touch', soulTag: 'CP_risk' },
      { id: 'poison_focus', name: 'Serpent Focus', type: 'spell', useStat: 'INT', damageDice: '1d12', damageType: 'poison', desc: 'Poison Spray - toxic cloud', soulTag: 'CP_risk' },
      { id: 'ritual_dagger', name: 'Ritual Dagger', type: 'melee', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Ceremonial blade, finesse', soulTag: null }
    ],
    features: {
      1: [
        { name: 'Forbidden Lore', description: 'You carry the secrets of the Watchers. You gain proficiency in Arcana and Occultism. You can read and decipher forbidden texts, star charts, and Watcher inscriptions. When you recall information about Watchers, their teachings, or Nephilim lore, you do so with advantage.', actionCost: null },
        { name: 'Elemental Affinity', description: 'Choose your elemental affinity: Fire (Azazel\'s Gift), Cold (Shamsiel\'s Gift), Lightning (Baraqel\'s Gift), Force (Semyaza\'s Gift), or Poison (Root-Cutting). Spells of your chosen element deal an additional 1 damage per damage die rolled. At level 10, this increases to 2 per die.', actionCost: null },
        { name: 'Corruption Risk', description: 'Whenever you cast a Magi spell of 2nd level or higher, you must make a Corruption check. Roll 1d20: on a result of 1-5, gain 1 Corruption Point. Spells marked with higher CP risk require a roll with higher threshold. Cantrips and 1st-level spells do not risk corruption.', actionCost: null }
      ],
      2: [
        { name: 'Watcher\'s Gift', description: 'You learn one metamagic option from the Watcher\'s teachings: Quickened Spell (spend 1 CP to cast a spell as a bonus action), Subtle Spell (cast without verbal or somatic components, spend 1 CP), or Empowered Spell (reroll damage dice that show 1 or 2, spend 1 CP). You can use one metamagic per spell cast.', actionCost: null }
      ],
      3: [
        { name: 'Spellcasting', description: 'You learn 2nd-level Magi spells. You can cast a number of spells per day according to your spell slots. Your spellcasting ability is Intelligence. Spell save DC = 8 + proficiency bonus + Intelligence modifier. Spell attack modifier = proficiency bonus + Intelligence modifier.', actionCost: null }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Arcane Recovery', description: 'Once per day during a short rest, you can recover expended spell slots with a combined level equal to half your Magi level (rounded up, no slot above 5th level). Using this feature risks 1 CP on a d20 roll of 1-3.', actionCost: null }
      ],
      6: [
        { name: 'Second Metamagic', description: 'You learn a second metamagic option from the Watcher\'s Gift list. Additionally, you can apply two metamagic options to a single spell cast, but doing so always adds 1 CP regardless of the roll.', actionCost: null }
      ],
      7: [
        { name: 'Blood Magic', description: 'When you cast a Magi spell, you can sacrifice hit points instead of spending a spell slot. You take damage equal to 5 times the spell\'s level (this damage cannot be reduced or prevented). You must make a Corruption check with a threshold of 1-7 when using Blood Magic.', actionCost: null }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Watcher\'s Eye', description: 'As an action, you can perceive through the eyes of a creature you can see within 1 mile. You are blind and deaf to your own surroundings while doing this. You can maintain this connection for up to 10 minutes. Once used, you must finish a long rest before using this feature again.', actionCost: 'action' }
      ],
      10: [
        { name: 'Elemental Mastery', description: 'Your Elemental Affinity damage increases to 2 per die. You gain resistance to your chosen element\'s damage type. You can spend 1 minute to attune to a new element, changing your affinity until your next long rest.', actionCost: null }
      ],
      11: [
        { name: 'Forbidden Power', description: 'You learn one 6th-level Magi spell. Casting a spell of 6th level or higher always adds 1 CP, no roll required. Additionally, your Corruption check threshold widens: you now gain 1 CP on a roll of 1-3 (instead of 1-5) for normal spellcasting.', actionCost: null }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Word of Binding', description: 'You can cast Word of Binding once per long rest without using a spell slot. The target must make a Wisdom saving throw or be paralyzed for 1 minute. This casting always adds 2 CP. The target can repeat the save at the end of each of its turns.', actionCost: 'action' }
      ],
      14: [
        { name: 'Third Metamagic', description: 'You learn a third metamagic option. You can now apply two metamagic options to a single spell without the automatic CP cost (still roll for corruption as normal).', actionCost: null }
      ],
      15: [
        { name: 'Watcher\'s Covenant', description: 'Once per long rest, when you would gain a CP from a corruption check, you can choose to instead lose 2d6 hit points (cannot be reduced below 1) and avoid gaining the CP. You hear the whispered taunts of the Watchers when you resist their corruption.', actionCost: 'reaction' }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Azazel\'s Flame', description: 'You can cast Azazel\'s Flame once per long rest without using a spell slot. This creates a 20-ft radius explosion of fire dealing 8d6 fire damage (Dexterity save for half). This casting always adds 2 CP. Creatures that fail the save are also ignited, taking 1d6 fire damage at the start of each turn until extinguished.', actionCost: 'action' }
      ],
      18: [
        { name: 'Spell Resistance', description: 'You have advantage on saving throws against spells. You gain a +2 bonus to AC against spell attacks. Your understanding of forbidden magic lets you partially deflect the spells of others.', actionCost: null }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Arch-Magi', description: 'You gain three legendary actions you can use at the end of another creature\'s turn: Cantrip (cast one Magi cantrip, costs 1 action), Arcane Step (teleport up to 30 ft to an unoccupied space you can see, costs 1 action), or Forbidden Blast (cast one Magi spell of 3rd level or lower without using a spell slot, costs 2 actions). You have immunity to your chosen elemental affinity damage type.', actionCost: null }
      ]
    }
  },
  {
    value: 'Priest',
    label: 'Priest (Keeper of Rituals)',
    keyAbility: 'WIS',
    hpPerLevel: 8,
    startingGold: 60,
    armorProficiencies: ['Padded Cloth', 'Leather', 'Hide', 'Scale Mail', 'Bronze Breastplate', 'Shield'],
    weaponProficiencies: ['Bronze Dagger', 'Bronze Shortsword', 'Spear', 'Sling', 'War Hammer', 'Mace', 'War Pick'],
    description: 'The Priest serves the Divine in an age of apostasy. While Watchers teach forbidden sorcery and the Nephilim oppress the weak, the Priest keeps the ancient covenants alive. Through prayer and sacrifice, the Priest channels divine miracles — healing the wounded, shielding the innocent, and turning back the forces of darkness with the power of the Creator.',
    role: 'Divine Support Caster',
    startingEquipmentOptions: [
      { id: 'holy_staff', name: 'Blessed Bronze Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Inscribed with sacred names', soulTag: 'RP_gain' },
      { id: 'mace', name: 'Ceremonial Mace', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Bronze holy weapon', soulTag: 'RP_gain' },
      { id: 'sacred_light', name: 'Sacred Flame', type: 'spell', useStat: 'WIS', damageDice: '1d8', damageType: 'radiant', desc: 'Divine fire from heaven', soulTag: 'RP_cost' },
      { id: 'divine_smite', name: 'Divine Word', type: 'spell', useStat: 'WIS', damageDice: '1d8', damageType: 'thunder', desc: 'Power of the spoken Name', soulTag: 'RP_cost' },
      { id: 'war_pick', name: "Priest's War Pick", type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'piercing', desc: 'For holy warriors', soulTag: null },
      { id: 'sling_stones', name: 'Blessed Sling', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, like David', soulTag: 'RP_gain' }
    ],
    features: {
      1: [
        { name: 'Divine Miracles', description: 'You can cast Priest spells using Wisdom as your spellcasting ability. Spell save DC = 8 + proficiency bonus + Wisdom modifier. Spell attack modifier = proficiency bonus + Wisdom modifier. You prepare a number of spells from the Priest spell list equal to your Wisdom modifier + your Priest level each day after prayer.', actionCost: null },
        { name: 'Turn Unholy', description: 'As an action, you present your holy symbol and speak a prayer of condemnation. Each demon spirit, undead, or corrupted creature within 30 ft must make a Wisdom saving throw. On a failure, the creature is turned for 1 minute — it must flee and cannot willingly move within 30 ft of you. You can use this feature a number of times equal to your Wisdom modifier (minimum 1) per long rest.', actionCost: 'action' },
        { name: 'Sanctuary', description: 'As a bonus action, you create a 10-ft aura of protection around you that lasts for 1 minute. Any creature that enters or starts its turn in this aura gains 1d4 + your Wisdom modifier temporary hit points. Demons and corrupted creatures that enter the aura take 1d4 radiant damage. Once used, you must finish a short or long rest before using this feature again.', actionCost: 'bonus' }
      ],
      2: [
        { name: 'Healing Touch', description: 'You learn the Healing Touch miracle. As an action, you touch a creature and restore 2d8 + Wisdom modifier hit points. This does not work on demons, undead, or creatures with more CP than RP. Using this feature on a creature with 0 CP grants you 1 RP (once per day per target).', actionCost: 'action' }
      ],
      3: [
        { name: 'Divine Favor', description: 'As a bonus action, you bless yourself or an ally within 30 ft. The target adds 1d4 to all attack rolls and saving throws for 1 minute. You can maintain concentration on this effect. If the target is under 0 CP, the bonus increases to 1d6.', actionCost: 'bonus' }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Righteous Aura', description: 'As an action, you emanate an aura of divine light in a 30-ft radius for 1 minute. Allies in the aura gain +1 RP (once per casting), while enemies with CP take 1d6 radiant damage at the start of their turn. Demons and undead have disadvantage on attack rolls against creatures within the aura. Once used, you must finish a long rest before using this feature again.', actionCost: 'action' }
      ],
      6: [
        { name: 'Blessed Weapon', description: 'Once per long rest, you can perform a 10-minute ritual to bless one weapon. For 24 hours, the weapon deals an additional 1d4 radiant damage. Undead and demon-spirits hit by this weapon have disadvantage on their next attack roll.', actionCost: null }
      ],
      7: [
        { name: 'Shield of Faith', description: 'As a reaction when you or an ally within 30 ft is hit by an attack, you can grant the target +5 AC against that attack, potentially causing it to miss. You can use this feature 2 times per long rest.', actionCost: 'reaction' }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Purify', description: 'As an action, you can purify a 10-ft cube. All disease and poison in the area is neutralized. Cursed objects must make a Wisdom save (using your DC) or have the curse suppressed for 24 hours. Possessed creatures can make a Charisma save with advantage to expel the possessing spirit. You can use this feature once per long rest.', actionCost: 'action' }
      ],
      10: [
        { name: 'Divine Intervention', description: 'Once per long rest, you can call upon the Divine for direct aid. Roll 1d100: if the result is equal to or less than 10 + your Priest level, your prayer is answered — the DM determines the nature of the intervention. If it fails, no effect occurs. The chance of success improves with your devotion.', actionCost: 'action' }
      ],
      11: [
        { name: 'Angelic Ward', description: 'You are under constant protection. You have resistance to necrotic damage and advantage on saving throws against being charmed, frightened, or possessed. Creatures that deal necrotic damage to you take 1d8 radiant damage in return.', actionCost: null }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Mass Turn Unholy', description: 'When you use Turn Unholy, the radius increases to 60 ft. Creatures that fail their save by 5 or more are destroyed (if Challenge Rating is below your Priest level divided by 2).', actionCost: 'action' }
      ],
      14: [
        { name: 'Resurrection', description: 'You can cast Resurrection once per long rest without material components. The target must have died within the last 7 days and must have net positive Righteousness (RP higher than CP). Using this feature costs 3 RP from you.', actionCost: 'action' }
      ],
      15: [
        { name: 'Holy Conduit', description: 'Your connection to the Divine is so strong that you regenerate 1 hit point at the start of each of your turns. When you cast a healing spell on an ally, they also gain 1 RP (once per day per ally). You have advantage on all Wisdom checks.', actionCost: null }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Divine Judgment', description: 'As an action, call down divine judgment on one creature you can see within 60 ft. The target takes 8d6 radiant damage (Constitution save for half). If the target has more CP than RP, the damage is 12d6 instead. If the target is a demon or undead, it is additionally blinded for 1 minute. This feature costs 3 RP to use. Once used, you must finish a long rest before using this feature again.', actionCost: 'action' }
      ],
      18: [
        { name: 'Eternal Sanctuary', description: 'As a 1-minute ritual, you can create a permanent sanctuary in a 30-ft radius. Demons, undead, and creatures with CP exceeding their RP cannot enter. The sanctuary lasts until you create a new one or die. Creatures resting within the sanctuary heal at twice the normal rate and gain 1 RP per long rest.', actionCost: null }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Voice of the Creator', description: 'You gain three legendary actions you can use at the end of another creature\'s turn: Heal (restore 2d8 + Wisdom modifier HP to one creature within 30 ft, costs 1 action), Rebuke (one demon or undead within 30 ft must make a Wisdom save or be destroyed, costs 2 actions), or Bless (all allies within 30 ft gain 1d4 to attack rolls and saving throws for 1 round, costs 2 actions). You can use Divine Intervention with a 100% success rate.', actionCost: null }
      ]
    }
  },
  {
    value: 'Artisan',
    label: 'Artisan (Smith/Builder)',
    keyAbility: 'INT or STR',
    hpPerLevel: 8,
    startingGold: 100,
    armorProficiencies: ['Padded Cloth', 'Leather', 'Hide', 'Scale Mail', 'Bronze Breastplate', 'Shield'],
    weaponProficiencies: ['Bronze Dagger', 'Bronze Shortsword', 'Spear', 'War Hammer', 'Mining Pick', 'Hand Axe', 'Heavy Crossbow', 'Sling', 'Quarterstaff'],
    description: 'The Artisan carries the legacy of Tubal-Cain, the first forger of bronze and iron. Master craftspersons and engineers, Artisans forge the weapons that slay giants, build the walls that hold back demon hordes, and devise the traps that level the playing field for ordinary humans against supernatural threats.',
    role: 'Craftsperson & Tool-User',
    startingEquipmentOptions: [
      { id: 'smith_hammer', name: "Smith's War Hammer", type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Forged by Tubal-Cain (1d10 two-handed)', soulTag: null },
      { id: 'battle_pick', name: 'Mining Pick', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'piercing', desc: 'Tool and weapon', soulTag: null },
      { id: 'hand_axe', name: 'Bronze Hand Axe', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'slashing', desc: 'Light, throwable (20/60)', soulTag: null },
      { id: 'light_crossbow', name: 'Engineering Crossbow', type: 'ranged', useStat: 'DEX', damageDice: '1d8', damageType: 'piercing', desc: 'Range 80/320, mechanical marvel', soulTag: null },
      { id: 'quarterstaff', name: 'Reinforced Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Versatile (1d8 two-handed)', soulTag: null }
    ],
    features: {
      1: [
        { name: 'Master Craftsman', description: 'You gain proficiency in two artisan\'s tools of your choice. When you make an ability check using artisan\'s tools, you add double your proficiency bonus. You can craft nonmagical items at twice the normal speed. You know the value and properties of any crafted item on sight.', actionCost: null },
        { name: 'Bronze Working', description: 'During a short or long rest, you can repair damaged weapons, armor, and shields. You can also forge simple bronze items (ammunition, caltrops, etc.) given raw materials worth half the item\'s cost. At higher levels, you can forge magical items using RP as a power source.', actionCost: null },
        { name: 'Structural Weakness', description: 'You can use your action to study a creature, object, or structure. You learn its Armor Class, hit points, damage immunities, vulnerabilities, and resistances. For structures, you also learn the weakest point, granting advantage on attacks against that point.', actionCost: 'action' }
      ],
      2: [
        { name: 'Trap Maker', description: 'During a short rest, you can create one of the following traps using available materials: Snare (DC 13 DEX save or restrained), Pit Spikes (DC 12 DEX save or 2d6 piercing damage), or Alarm Tripwire (alerts all within 300 ft with a loud noise). You can have up to your Intelligence modifier (minimum 1) traps active at a time.', actionCost: null }
      ],
      3: [
        { name: 'Quick Tinker', description: 'As a bonus action, you can use artisan\'s tools to perform one of: open a lock, disarm a trap, stabilize a structure, or jury-rig a broken mechanism to function for 1 hour. You can use this feature a number of times equal to your Intelligence modifier (minimum 1) per long rest.', actionCost: 'bonus' }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn.', actionCost: null }
      ],
      6: [
        { name: 'Armored Expertise', description: 'You can modify armor to fit any creature regardless of size. You can add spikes (1d6 piercing on grapple), reinforced joints (reduce critical hit damage by half), or hidden compartments (conceal one small item). Modifications take 1 hour each.', actionCost: null }
      ],
      7: [
        { name: 'Siege Engineer', description: 'Your attacks against objects and structures deal double damage. You can construct siege equipment (battering ram, siege tower, or ballista) given 10 minutes and available materials. You and allies using your siege equipment add your proficiency bonus to attack rolls.', actionCost: null }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Weapon Enhancement', description: 'During a long rest, you can enhance one weapon with a temporary magical property that lasts for 24 hours: +1 attack and damage rolls, or add 1d4 fire/cold/lightning damage. You can spend 2 RP to make the enhancement permanent on one weapon.', actionCost: null }
      ],
      10: [
        { name: 'Fortification', description: 'As a 10-minute ritual, you can fortify a 20-ft square area. Creatures within the fortification gain half cover (+2 AC and DEX saves) and advantage on saving throws against effects that move them. Traps within the fortification have their save DCs increased by 2. The fortification lasts until you create a new one.', actionCost: null }
      ],
      11: [
        { name: 'Counter-Construction', description: 'As a reaction when a creature within 30 ft uses a construct, mechanism, or trap against you or an ally, you can cause it to malfunction. The effect fails or targets the user instead. You can use this feature once per short rest.', actionCost: 'reaction' }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Magical Forge', description: 'You can forge magical arms and armor. By spending 1 RP per day for 7 days, you can create a +1 weapon or +1 armor. By spending 2 RP per day for 14 days, you can create a +2 weapon or armor with one elemental property. You must have the appropriate tools and raw materials.', actionCost: null }
      ],
      14: [
        { name: 'Master of Mechanisms', description: 'You have advantage on all checks to disarm traps, open locks, and disable mechanisms. You can bypass any nonmagical lock or trap in 1 round. Magical traps require 3 rounds but you still have advantage.', actionCost: null }
      ],
      15: [
        { name: 'Titan-Forging', description: 'You can forge weapons and armor sized for Large or larger creatures. You can create weapons that deal one size category of additional damage (e.g., a greatsword that deals 3d6 instead of 2d6). Such weapons cannot be used by Medium or smaller creatures. Forging a titan weapon costs 3 RP.', actionCost: null }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Impregnable Construction', description: 'As a 1-hour ritual, you can create a permanent structure that is immune to nonmagical damage and has resistance to magical damage. The structure can be up to 30 ft in each dimension. Creatures inside have total cover. Only you or someone with your permission can open the entrance.', actionCost: null }
      ],
      18: [
        { name: 'Living Forge', description: 'You can repair armor and weapons as a bonus action during combat. You can spend 1 RP to instantly restore a broken magical item. Your crafted items have double the normal hit points.', actionCost: 'bonus' }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Legendary Artisan', description: 'You gain three legendary actions you can use at the end of another creature\'s turn: Strike (make one weapon attack, costs 1 action), Repair (restore 2d8 HP to one construct or object within 30 ft, costs 1 action), or Sabotage (one mechanism, trap, or construct within 30 ft ceases to function for 1 round, costs 2 actions). Anything you forge is considered legendary quality — +3 to attack/damage or +3 AC.', actionCost: null }
      ]
    }
  },
  {
    value: 'Scribe',
    label: 'Scribe (Keeper of Tablets)',
    keyAbility: 'INT',
    hpPerLevel: 6,
    startingGold: 40,
    armorProficiencies: [],
    weaponProficiencies: ['Bronze Dagger', 'Sling', 'Quarterstaff', 'Dart', 'Light Crossbow'],
    description: 'The Scribe preserves the knowledge of the antediluvian world on clay tablets and parchment scrolls. In an age before widespread literacy, the Scribe holds the power of the written word — names of power, prophecies of the Flood, and the secrets of binding spirits. Their knowledge is both weapon and shield in a world where the right words can save or damn.',
    role: 'Knowledge-Based Support',
    startingEquipmentOptions: [
      { id: 'quill_dagger', name: 'Scribe Dagger', type: 'melee', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Light, finesse, concealable', soulTag: null },
      { id: 'quarterstaff', name: 'Walking Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Versatile (1d8 two-handed)', soulTag: null },
      { id: 'dart', name: 'Poison Darts', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Range 20/60, finesse, throwable', soulTag: 'CP_risk' },
      { id: 'sling_scholar', name: "Scholar's Sling", type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, simple', soulTag: null },
      { id: 'arcane_knowledge', name: 'Arcane Knowledge', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'psychic', desc: 'Mind Spike - forbidden knowledge', soulTag: 'CP_risk' }
    ],
    features: {
      1: [
        { name: 'Lorekeeper', description: 'You gain proficiency in four skills: History, Religion, Arcana, and one of your choice. When you make an ability check using any of these skills, you can treat a roll of 7 or lower on the d20 as an 8. You can read and write all languages known in the antediluvian world, including Watcher script and ancient Sumerian.', actionCost: null },
        { name: 'Ancient Languages', description: 'You can read forbidden texts and inscriptions that others cannot decipher. This includes Watcher inscriptions, Enochian tablets, and the Book of Giants fragments. Reading forbidden texts may require a Wisdom save (DC varies) to avoid gaining CP, but you always gain full comprehension.', actionCost: null },
        { name: 'Tactical Analysis', description: 'As a bonus action, you can analyze one creature you can see. Choose one: reveal its current hit points, reveal its damage vulnerabilities and resistances, or grant all allies within 30 ft advantage on their next attack roll against that creature. You can use this feature a number of times equal to your Intelligence modifier (minimum 1) per long rest.', actionCost: 'bonus' }
      ],
      2: [
        { name: 'Ink Magic', description: 'You can inscribe temporary runes on surfaces, weapons, or creatures. Choose one: Warding Rune (grant 1d8 + Intelligence modifier temporary HP to one creature), Marking Rune (one creature\'s next attack has advantage), or Warning Rune (one creature cannot be surprised for 1 hour). Inscribing a rune takes 1 minute. You can maintain up to your Intelligence modifier (minimum 1) active runes.', actionCost: null }
      ],
      3: [
        { name: 'Prophetic Warning', description: 'As a reaction when you or an ally within 30 ft is targeted by an attack, you can grant a flash of precognitive insight. The target adds 1d6 to their AC against that attack. You can use this feature 2 times per long rest.', actionCost: 'reaction' }
      ],
      4: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      5: [
        { name: 'Word of Power', description: 'As an action, you speak a word of ancient power. One creature within 30 ft must make a Wisdom saving throw or take 3d6 psychic damage and be stunned until the end of its next turn. On a success, the creature takes half damage and is not stunned. You can use this feature once per short rest.', actionCost: 'action' }
      ],
      6: [
        { name: 'Scroll Mastery', description: 'You can create spell scrolls during a long rest. You can inscribe one scroll per rest of a spell you know (up to 3rd level). The scroll can be used by anyone to cast the spell once. Creating a scroll costs 10 gp per spell level in materials and 1 CP on a d20 roll of 1-5.', actionCost: null }
      ],
      7: [
        { name: 'Encyclopedic Knowledge', description: 'When you or an ally makes an ability check and you are unsure of the answer, you can spend 1 minute consulting your tablets. You gain a +10 bonus to the check. Alternatively, you can make the check with advantage as a reaction if the check arises suddenly.', actionCost: 'reaction' }
      ],
      8: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      9: [
        { name: 'Binding Words', description: 'As an action, you can inscribe a binding contract on a clay tablet. Two willing creatures who press their mark into the clay are bound by the contract. Breaking the contract causes the breaker to take 4d6 psychic damage and gain 2 CP. The contract lasts for 1 year. You can have one binding contract active at a time.', actionCost: 'action' }
      ],
      10: [
        { name: 'Master Scribe', description: 'You can create forgeries of any document with 1 minute of work. The forgery is indistinguishable from the original by any means short of divine intervention. You can also inscribe permanent magical runes that function as glyphs of warding (2d8 damage, your choice of type).', actionCost: null }
      ],
      11: [
        { name: 'Name of Binding', description: 'As an action, you speak the true name of one creature you have studied for at least 1 hour. The creature must make a Charisma saving throw or be charmed by you for 1 hour. While charmed, it follows your verbal commands. You must know the creature\'s true name to use this feature. Using this feature adds 1 CP regardless of success.', actionCost: 'action' }
      ],
      12: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      13: [
        { name: 'Prophetic Vision', description: 'Once per long rest, you can enter a trance for 1 minute and receive a vision of the future. The vision provides a cryptic clue about events that will occur within the next 24 hours. The DM provides the clue. You also gain advantage on all initiative rolls for the next 24 hours.', actionCost: 'action' }
      ],
      14: [
        { name: 'Word of Command', description: 'As an action, you speak a single word of absolute command to one creature within 30 ft. The creature must make a Wisdom saving throw or follow one command (flee, drop, kneel, or halt) on its next turn. The command lasts for 1 round. Creatures with more CP than RP have disadvantage on the save. Once used, you must finish a short or long rest before using this feature again.', actionCost: 'action' }
      ],
      15: [
        { name: 'Tablet of Judgment', description: 'You can inscribe a Tablet of Judgment during a long rest. When presented to a creature, it must make a Wisdom save. On a failure, the creature\'s alignment and CP/RP balance are revealed to all present, and the creature has disadvantage on all Charisma checks for 24 hours. A creature that willingly reads the tablet gains 1 RP. You can have one Tablet of Judgment active at a time.', actionCost: null }
      ],
      16: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      17: [
        { name: 'Word of Unmaking', description: 'As an action, you speak a word that unravels reality. One creature within 60 ft must make a Constitution saving throw or take 8d8 psychic damage and lose 1d4 CP or RP (your choice). Objects within 20 ft of the target crumble to dust. This feature costs 3 RP or adds 2 CP (your choice). Once used, you must finish a long rest before using this feature again.', actionCost: 'action' }
      ],
      18: [
        { name: 'Omniscient Archive', description: 'You carry a mental archive of all knowledge you have encountered. You have advantage on all Intelligence checks. Once per long rest, you can recall any piece of information that exists in writing anywhere in the world, as long as you have seen or heard of it before.', actionCost: null }
      ],
      19: [
        { name: 'Ability Score Improvement', description: 'Increase one ability score by 2, or two ability scores by 1. You cannot increase a score above 20.', actionCost: null }
      ],
      20: [
        { name: 'Voice of Penemue', description: 'You gain the powers of the Watcher Penemue, who taught writing to humanity. You gain three legendary actions you can use at the end of another creature\'s turn: Insight (reveal one creature\'s current HP, resistances, and vulnerabilities, costs 1 action), Rebuke (one creature within 30 ft must make a Wisdom save or take 3d6 psychic damage and be silenced for 1 round, costs 1 action), or Rewrite (change the outcome of one d20 roll that just occurred by up to ±5, costs 2 actions). You are permanently immune to the silenced condition and cannot be deceived by written forgeries.', actionCost: null }
      ]
    }
  }
];