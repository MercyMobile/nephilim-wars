import React, { useState } from 'react';

// Complete Bestiary Data — PF2e Stats from Manual Chapter 13
const BESTIARY_DATA = {
  giants: {
    title: "Giants — The Forbidden Offspring",
    intro: "Born of Watcher and human unions, the Nephilim terrorize the earth. Their strength is beyond mortal comprehension, their cruelty boundless.",
    icon: "⚔️",
    creatures: [
      {
        name: "Nephilim Warlord",
        image: "/images/bestiary/GreaterGiant.png",
        level: 16, hp: 320, ac: 40,
        attack: "Masterwork Bronze Greatsword +34 (3d12+17 slashing + 1d6 radiant)",
        special: "Titanic Cleave, Commanding Presence (60ft), Earth-Shattering Stomp, Watcher's Blessing",
        desc: "The most powerful first-generation giants. Campaign-defining antagonists.",
        lore: "Standing 14-16 feet tall, Nephilim Warlords claim descent from Azazel, Semyaza, or Baraqel. They are immune to fear and mental effects, resist radiant damage, and command armies through sheer presence. Their Earth-Shattering Stomp shakes a 30ft burst for 8d6 bludgeoning, and Watcher's Blessing grants +4 attack/damage with +2d6 force for one minute.",
        legendary: true,
        saves: "Fort +33, Ref +26, Will +30"
      },
      {
        name: "Nephilim Warrior",
        image: null,
        level: 12, hp: 220, ac: 32,
        attack: "Bronze Greatsword +28 (2d12+14 slashing)",
        special: "Crushing Blow, Titanic Presence (30ft), Earth-Shaking Step, Watcher's Legacy",
        desc: "Direct offspring of the Watchers and human women. 12-15 feet tall with immense strength.",
        lore: "Born from forbidden unions on Mount Hermon, these titans became tyrant-kings. Their Crushing Blow forces a DC 28 Fort save or be knocked prone and take 2d10 extra bludgeoning. Their Titanic Presence aura forces DC 26 Will saves or become frightened. They gain Corruption Points when slaying foes.",
        saves: "Fort +27, Ref +19, Will +22"
      },
      {
        name: "Nephilim Scout",
        image: null,
        level: 8, hp: 150, ac: 26,
        attack: "Bronze Spear +22 (1d8+10 piercing)",
        special: "Ambush Tactics (+2d6 precision), Watcher's Eyes (see invisible 60ft), Stealthy Giant",
        desc: "Eyes and ears of giant warbands. 11-13 feet tall, more agile than warriors.",
        lore: "Nephilim Scouts are the cunning hunters of the giant armies. They negate the size penalty to Stealth and deal +2d6 precision damage against flat-footed targets after Sneaking. Their Watcher's Eyes can see invisible creatures within 60 feet, and they cannot be tracked by non-magical means.",
        saves: "Fort +21, Ref +21, Will +18"
      },
      {
        name: "Ohya, Son of Semyaza",
        image: "/images/bestiary/Ohya.png",
        level: 15, hp: 260, ac: 36,
        attack: "Enchanted Bronze Khopesh +28 (2d8+12 slashing)",
        special: "Semyaza's Enchantment (DC 34), Dream Walker, Spellcasting (DC 34)",
        desc: "Son of the Watcher leader. Warrior-poet plagued by prophetic nightmares of the Flood.",
        lore: "Ohya dreamt of a great tablet submerged in water where names were washed away until only three remained. He is a sorcerer of immense power — casting charm, dominate, dimension door, and plane shift. His Dream Walker ability lets him enter the dreams of creatures within a mile, planting suggestions and observing memories. Begins with 5 CP.",
        legendary: true,
        saves: "Fort +26, Ref +23, Will +30"
      },
      {
        name: "Hahya, Brother of Ohya",
        image: "/images/bestiary/Hahya.png",
        level: 13, hp: 230, ac: 32,
        attack: "Ceremonial Bronze Mace +26 (2d6+11 bludgeoning)",
        special: "Turn the Corrupted (DC 31), Spirit Sense (60ft), Interpreter of Dreams, Healing Spells",
        desc: "The contemplative brother who secretly studied Enoch's teachings.",
        lore: "Hahya dreamt of a garden where 200 trees were burned leaving only one standing — symbolizing the Flood. Unlike his brother, he is a healer who can cast bless, heal, restoration, and commune. His Turn the Corrupted ability forces undead within 30ft to make DC 31 Will saves or flee. A potential ally who works to reduce his Corruption.",
        legendary: true,
        saves: "Fort +25, Ref +20, Will +29"
      },
      {
        name: "Mahway, the Winged",
        image: "/images/bestiary/Mahway.png",
        level: 11, hp: 190, ac: 30,
        attack: "Bronze Dagger +25/+27 ranged (1d6+9 piercing)",
        special: "Fly 50ft, Sky Dive, Celestial Messenger (plane travel 1/day), Voice of Warning (1 mile)",
        desc: "Son of Baraqel. Born with wings, sent to find Enoch at the ends of the earth.",
        lore: "Mahway is unique among giants for his ability to fly at 50ft (100ft when scouting). His Sky Dive grants +2 attack on dive Strikes and can knock targets prone. He carries Enoch's Seal granting +2 saves vs corruption. He is primarily a messenger and non-combatant NPC who returned bearing the Tablet of Judgment.",
        legendary: true,
        saves: "Fort +23, Ref +27, Will +25"
      },
      {
        name: "Gilgamesh, Hero-King",
        image: "/images/bestiary/Gilgamesh.png",
        level: 14, hp: 270, ac: 36,
        attack: "Uruk's Blade +32 (2d12+15 slashing + 1d6 radiant)",
        special: "Heroic Strike (+2d10/+3d10 vs corrupted), King of Uruk (30ft aura), Epic Resilience",
        desc: "Two-thirds divine king. Potential ally, rival, or mentor.",
        lore: "Mentioned in Dead Sea Scrolls fragments. His King of Uruk aura gives allies +2 to attack and saves. Epic Resilience lets him drop to 1 HP instead of 0 once per day. Quest for Immortality grants a full heal once per week through meditation. He wields Righteous Judgment dealing +1d6 radiant against corrupted foes. Starts at 4 CP but works to reduce it.",
        legendary: true,
        saves: "Fort +31, Ref +24, Will +28"
      },
      {
        name: "Rephaim Champion",
        image: null,
        level: 12, hp: 210, ac: 32,
        attack: "Masterwork Bronze Flail +28 (2d8+13 bludgeoning)",
        special: "Death Strike (+2d6 negative, DC 28), Death Lord's Aura (30ft), Command the Dead, Animate Dead 1/day",
        desc: "Death cult leaders. 10-12 feet tall. Necromancers who command the restless dead.",
        lore: "Rephaim Champions are the terrifying leaders of death cults. Their Death Strike deals 2d6 negative damage with a DC 28 Fort save — critical failure inflicts drained 1. Their 30ft aura forces DC 28 Will saves or become frightened, and their Grave Lord aura makes undead immune to Turn Undead within 60ft. Starts at 5 CP.",
        legendary: true,
        saves: "Fort +29, Ref +22, Will +27"
      },
      {
        name: "Rephaim Warrior",
        image: null,
        level: 8, hp: 140, ac: 24,
        attack: "Bronze War Club +22 (2d8+11 bludgeoning)",
        special: "Spirit Strike (+1d6 negative), Deathly Aura (15ft), Death Gaze, Spirit Sight",
        desc: "Second-generation giants associated with death. 9-11 feet tall, gaunt and skeletal.",
        lore: "The Rephaim are the 'Shades' — second-generation giants whose very presence reeks of mortality. Their Spirit Strike adds 1d6 negative damage with a DC 21 Fort save or become sickened. They can see invisible creatures and perceive the Ethereal Plane. Their Death Gaze forces a DC 21 Will save or become frightened.",
        saves: "Fort +21, Ref +16, Will +19"
      },
      {
        name: "Rephaim Death Speaker",
        image: null,
        level: 10, hp: 170, ac: 26,
        attack: "Ceremonial Bronze Dagger +20 (1d4+8 piercing + 1d6 negative)",
        special: "Death Touch (+3d6 negative, DC 29), Spellcasting (DC 29), Spirit Communion, Death Ward",
        desc: "Spiritual leaders and necromancers of the Rephaim. 9-11 feet tall.",
        lore: "Death Speakers commune with Refa'im spirits and command the undead. They cast animate dead, command undead, harm, speak with dead, circle of death, and create undead. Their Death Touch deals 3d6 negative with DC 29 Fort — failure inflicts drained. Their Spirit Communion lets them interrogate nearby Refa'im. Starts at 6 CP.",
        saves: "Fort +23, Ref +18, Will +28"
      },
      {
        name: "Anakim Chain-Bearer",
        image: null,
        level: 11, hp: 190, ac: 30,
        attack: "Masterwork Bronze Greatsword +27 (2d12+14 slashing + 1d6 radiant)",
        special: "Chain Whirlwind (20ft reach), Crushing Chains (free grapple damage), Chain of Azazel (+1d6 fire)",
        desc: "Elite Anakim warriors. 12-14 feet tall. House champions bearing ancestral chains.",
        lore: "Chain-Bearers are the elite of Anakim noble houses, wielding ancestral chains with 20ft reach. Chain Whirlwind Strikes all creatures within reach. Successful grapples deal 2d6 bludgeoning and restrain. Their Chain of Azazel ability adds 1d6 fire damage and +2 to attack for one minute. Noble Presence imposes -1 on smaller enemies within 30ft. Starts at 3 CP.",
        legendary: true,
        saves: "Fort +28, Ref +20, Will +24"
      },
      {
        name: "Anakim Noble",
        image: null,
        level: 9, hp: 160, ac: 26,
        attack: "Bronze Greatsword +23 (2d6+12 slashing)",
        special: "Chain Strike (free Trip), Heavy Chains (+2 AC), Noble Command (DC 23)",
        desc: "The 'Long-Necked Ones.' 10-13 feet tall. Sophisticated warrior culture centered on honor.",
        lore: "Anakim Nobles bear heavy bronze chains as symbols of status that also grant +2 AC. Their Chain Strike allows a free Trip action after a successful melee Strike. Noble Command forces a DC 23 Will save or compels a creature to perform an action for 1 round. They value honor and maintain detailed genealogies tracing back to specific Watchers.",
        saves: "Fort +23, Ref +17, Will +21"
      },
      {
        name: "Gibborim Elite",
        image: "/images/bestiary/Gibborim.png",
        level: 9, hp: 150, ac: 28,
        attack: "Masterwork Bronze Greatsword +24 (2d8+11 slashing + 1d6 radiant)",
        special: "Devastating Blow (+2d6), Tireless Rage, War Leader (allies +2 attack/+1 AC)",
        desc: "Pinnacle of hybrid martial prowess. 7-8.5 feet tall. Medium size.",
        lore: "Gibborim Elites are the finest warriors among the mighty ones. Tireless Rage grants +3 damage and resistance 10 to all damage at the cost of -1 AC. War Leader gives nearby allies +2 to attack and +1 AC. They wield two-handed weapons in one hand without penalty through Improved Giant's Grip. Starts at 2 CP.",
        saves: "Fort +24, Ref +19, Will +21"
      },
      {
        name: "Gibborim Champion",
        image: null,
        level: 7, hp: 120, ac: 24,
        attack: "Bronze Greatsword +20 (2d6+9 slashing)",
        special: "Mighty Blow (+1d6), Heroic Feat (+2 STR 1/day), Giant's Grip",
        desc: "Elite hybrid warriors bridging human and giant worlds. 6.5-8 feet tall.",
        lore: "The 'Mighty Men of Old' — human-giant hybrids who combine mortal cunning with giant strength. Giant's Grip lets them wield two-handed weapons in one hand at -2. Heroic Feat grants +2 to Strength skills and damage for one minute. They serve as captains, commanders, and mercenary champions. Starts at 1 CP.",
        saves: "Fort +19, Ref +15, Will +16"
      },
      {
        name: "Horim Stone-Shaper",
        image: null,
        level: 8, hp: 110, ac: 24,
        attack: "Stone Dagger +19 (1d4+7 piercing + 1d4 force)",
        special: "Earth Glide, Crystal Ward (resist 10), Stone Form, Tremorsense 30ft",
        desc: "Master artisans and spiritual leaders of the cave-dwellers. Crystalline skin patterns.",
        lore: "Horim Stone-Shapers can move through solid stone via Earth Glide and sense vibrations through Tremorsense. Crystal Ward grants resistance 10 for one minute, and Stone Form gives resistance 15 to physical damage and immunity to precision/crits. Crystal Strike restrains foes in crystalline prisons on a failed DC 20 Reflex. Starts at 2 CP.",
        legendary: true,
        saves: "Fort +18, Ref +20, Will +15"
      },
      {
        name: "Horim Cave-Dweller",
        image: null,
        level: 5, hp: 85, ac: 20,
        attack: "Stone Dagger +13 (1d4+5 piercing)",
        special: "Earth Sense (+2 Perception underground), Tunnel Fighter, Stone Skin (resist 5 bludgeoning), Climb 20ft",
        desc: "Smallest giant lineage. 6-7 feet tall. Pale translucent skin, superior darkvision.",
        lore: "The Horim retreated underground, adapting to the darkness with 120ft darkvision and skin that resists bludgeoning damage. They detect creatures in contact with the ground within 30ft through Earth Sense and gain +1 to attacks in confined spaces. Sunlight Sensitivity dazzles them in bright light. Starts at 1 CP.",
        saves: "Fort +14, Ref +15, Will +12"
      },
      {
        name: "Elioud Champion",
        image: null,
        level: 7, hp: 110, ac: 23,
        attack: "Masterwork Bronze Greatsword +20 (2d6+10 slashing)",
        special: "Ancestral Strike (+1d8), Champion's Aura (20ft), Diplomatic Presence",
        desc: "Elite third-generation warriors and diplomats. 6'6\"-7'2\". Bridge human and giant societies.",
        lore: "Elioud Champions combine martial prowess with diplomatic skill. Their Champion's Aura gives allies +1 to attack and saves while forcing enemies to make DC 18 Will saves or become frightened. Ancestral Strike adds 1d8 extra damage. They possess enough giant blood to command respect among larger kin while moving freely in human settlements. Starts at 1 CP.",
        saves: "Fort +19, Ref +16, Will +16"
      },
      {
        name: "Elioud Deceiver",
        image: "/images/bestiary/ElioudDeceiver.jpg",
        level: 4, hp: 65, ac: 18,
        attack: "Bronze Dagger +14 (1d4+5 piercing)",
        special: "Deceptive Strike (+1d6 precision), Master of Disguise, Silver Tongue, Blending In",
        desc: "Third-generation infiltrators. Nearly indistinguishable from large humans.",
        lore: "Elioud Deceivers are spies and infiltrators who can pass as human with +2 to Deception and Stealth. Deceptive Strike deals +1d6 precision against flat-footed targets. Blending In grants a DC 15 flat check to avoid detection once per day. They serve as scouts, saboteurs, and agents provocateurs for giant warlords. Starts at 1 CP.",
        saves: "Fort +10, Ref +14, Will +9"
      }
    ]
  },
  watchers: {
    title: "The Watchers — Fallen Angels",
    intro: "The 200 angels who descended upon Mount Hermon, bound by oath to corrupt humanity. Now imprisoned, their legacy endures through their teachings and offspring.",
    icon: "👁️",
    creatures: [
      {
        name: "Semyaza",
        image: "/images/bestiary/Semyaza.png",
        level: 20, hp: 400, ac: 44,
        attack: "Arcane Bolt +38 (4d10+12 force)",
        special: "Master of Oaths, Root-Cutting, Storm Caller, Enchantment Mastery",
        desc: "Leader of the 200 Watchers. Bound between heaven and earth in Tartarus.",
        lore: "The leader of the 200 (also called Shemihazah). He feared to descend alone, so he made all 200 swear an oath on Mount Hermon. He taught enchantments and the properties of roots. He is suspended between heaven and earth — some say he hangs in the constellation Orion as a warning. His Enchantment Mastery makes his charm and dominate effects nearly irresistible.",
        legendary: true,
        bound: true
      },
      {
        name: "Azazel",
        image: "/images/bestiary/Azazel.jpg",
        level: 20, hp: 420, ac: 46,
        attack: "Burning Blade +40 (4d12+14 slashing + 2d6 fire)",
        special: "Weapon Mastery, Forge of War, Teacher of Vanity, Bound in Dudael",
        desc: "Chief corrupter. Taught humanity weapons, armor, and cosmetics.",
        lore: "The most blame-bearing of the Watchers. Azazel taught men to make swords, knives, shields, and breastplates, and taught women the art of cosmetics and ornaments. By divine command, Raphael bound him hand and foot and cast him into the darkness of Dudael, piling rough and jagged rocks upon him. 'The whole earth has been corrupted through the works taught by Azazel: to him ascribe all sin.' (1 Enoch 10:8)",
        legendary: true,
        bound: true
      },
      {
        name: "Baraqel",
        image: null,
        level: 18, hp: 340, ac: 40,
        attack: "Lightning Strike +34 (3d12+10 lightning)",
        special: "Astrology Mastery, Weather Control, Star Reading, Storm Summoning",
        desc: "Teacher of astrology and the observation of the stars.",
        lore: "Baraqel taught astrology — the observation and interpretation of the stars. While seeming innocent, this knowledge gave humanity power over the heavenly bodies, disrupting the ordained order. His Weather Control can summon devastating storms, and his Star Reading reveals hidden truths. Father of Mahway, the Winged.",
        legendary: true,
        bound: true
      },
      {
        name: "Kokabiel",
        image: null,
        level: 18, hp: 330, ac: 40,
        attack: "Star Fire +34 (3d10+10 radiant + 1d6 fire)",
        special: "Constellation Master, Celestial Illusions, Star Mapping",
        desc: "'Star of God.' Teacher of the constellations and their meanings.",
        lore: "Kokabiel taught the constellations and their meanings, giving humanity forbidden knowledge of the heavens' patterns and cycles. His Celestial Illusions can create convincing visions in the night sky, and his mastery of stellar magic makes him a formidable foe even bound.",
        legendary: true,
        bound: true
      },
      {
        name: "Gadreel",
        image: null,
        level: 18, hp: 350, ac: 42,
        attack: "Serpent's Blade +36 (3d10+12 slashing + 1d8 poison)",
        special: "Tempter, Teacher of Weapons, Deception Mastery",
        desc: "The angel who led Eve astray. Teacher of death-dealing weapons.",
        lore: "Identified in 1 Enoch 69:6 as the angel who led Eve astray in the Garden. He also taught humanity the art of making weapons of death — specifically the killing blow. His influence combines the corruption of innocence with the tools of murder. His Deception Mastery makes his lies indistinguishable from truth.",
        legendary: true,
        bound: true
      },
      {
        name: "Penemue",
        image: null,
        level: 17, hp: 300, ac: 38,
        attack: "Ink of Binding +32 (3d8+8 psychic)",
        special: "Forbidden Writing, Knowledge Corruption, Bitter and Sweet",
        desc: "Taught the bitter and the sweet — the art of writing with ink and paper.",
        lore: "Penemue taught humanity to write with ink and paper. While this seems beneficial, 1 Enoch 69:8 says 'on account of this, many sinned from eternity to eternity.' Written knowledge made corruption permanent and transmissible — forbidden formulas, dark contracts, and blasphemous texts could now persist beyond living memory.",
        legendary: true,
        bound: true
      },
      {
        name: "Armaros",
        image: null,
        level: 17, hp: 310, ac: 38,
        attack: "Hex Bolt +32 (3d8+8 occult)",
        special: "Counter-Magic, Enchantment Breaking, Resolving of Enchantments",
        desc: "Taught the resolving of enchantments — counter-magic and curse-breaking.",
        lore: "Armaros taught humanity how to resolve enchantments — the art of breaking curses, dispelling magic, and countering supernatural effects. This gave mortals power to defy divine will and undo celestial protections. His Counter-Magic can negate even the most powerful wards.",
        legendary: true,
        bound: true
      },
      {
        name: "Kasdeja",
        image: null,
        level: 17, hp: 290, ac: 38,
        attack: "Shadow Lash +32 (3d8+8 negative)",
        special: "Demonic Smiting, Spirit Assault, Shadow Magic",
        desc: "Taught the smiting of spirits and demons — and the smiting of the embryo in the womb.",
        lore: "Kasdeja taught the darkest arts — how to strike at spirits, assault demons, and perform abortions. His knowledge represents the weaponization of the spiritual realm and the destruction of life at its most vulnerable. His Shadow Magic operates in darkness, and his Spirit Assault can damage incorporeal beings.",
        legendary: true,
        bound: true
      }
    ]
  },
  corrupted: {
    title: "Corrupted Humanity",
    intro: "Those who have abandoned the Creator to serve the giants and practice forbidden arts. From lowly cultists to legendary kings, corruption spreads through mortal hearts.",
    icon: "🗡️",
    creatures: [
      {
        name: "Lamech the Avenger",
        image: null,
        level: 10, hp: 160, ac: 28,
        attack: "Tubal-Cain's Blade +24 (2d12+13 slashing + 1d6 radiant)",
        special: "Avenger's Strike (+3d8/+4d8), Seventy-and-Sevenfold, Tribal War Cry, Unbreakable",
        desc: "Seventh from Adam in Cain's line. Father of Tubal-Cain and Naamah.",
        lore: "He boasted to his wives: 'If Cain shall be avenged sevenfold, truly Lamech seventy and sevenfold.' His Seventy-and-Sevenfold ability triggers on death — the attacker makes DC 26 Will or takes 7d10 divine damage and is marked for vengeance for 24 hours. Unbreakable makes him immune to debuffs and lets him drop to 1 HP once per day. Starts at 7 CP.",
        legendary: true,
        saves: "Fort +24, Ref +20, Will +21"
      },
      {
        name: "Baal-Priest",
        image: null,
        level: 6, hp: 90, ac: 22,
        attack: "Sacrificial Bronze Dagger +14 (1d4+5 piercing + 1d6 negative)",
        special: "Blood Curse (DC 21, +3d6 negative), Sacrificial Ritual (heal 4d8), Demonic Communion, Spellcasting (DC 23)",
        desc: "Corrupted religious leaders practicing blood magic and necromancy.",
        lore: "Baal-Priests channel demonic power through ritualistic sacrifice. They cast animate dead, harm, vampiric touch, circle of death, and finger of death. Blood Curse deals 3d6 negative with DC 21 Fort — failure inflicts drained. Sacrificial Ritual kills a creature to heal 4d8 + temporary HP. Demonic Communion boosts spell DCs but risks gaining CP. Starts at 8 CP.",
        saves: "Fort +13, Ref +14, Will +15"
      },
      {
        name: "Watcher Cult Leader",
        image: null,
        level: 5, hp: 75, ac: 20,
        attack: "Masterwork Ritual Dagger +13 (1d4+4 piercing + 1d6 negative)",
        special: "Corrupting Touch (DC 19, target gains CP), Watcher's Gift, Blood Sacrifice, Cult Leader's Aura (20ft)",
        desc: "High priests of Watcher cults. Wielders of forbidden knowledge.",
        lore: "Cult Leaders are sorcerers who channel Watcher power. Their Corrupting Touch forces a DC 19 Fort save — failure gives the target 1-2 Corruption Points. They cast charm, darkness, fear, invisibility, dominate, and shadow blast. Their 20ft aura gives allies +1 to attack/saves and forces enemies to make DC 19 Will or become frightened. Starts at 6 CP.",
        saves: "Fort +11, Ref +12, Will +13"
      },
      {
        name: "Cainite Warrior",
        image: null,
        level: 3, hp: 50, ac: 18,
        attack: "Bronze Sword +10 (1d8+4 slashing)",
        special: "Shield Block (reduce 5), Mark of Cain (divine retribution on killer)",
        desc: "City guards and mercenaries. Not inherently evil. Bear the Mark of Cain.",
        lore: "Descendants of Cain who built the first cities and mastered metalworking. Their Mark of Cain triggers when killed — the attacker makes DC 15 Will or takes 1d6 divine damage per turn for one minute. They fight with bronze swords and shields, organized as city militia. Starts at 1 CP.",
        saves: "Fort +11, Ref +9, Will +8"
      },
      {
        name: "Watcher Cultist",
        image: null,
        level: 2, hp: 35, ac: 16,
        attack: "Ritual Dagger +8 (1d4+3 piercing + 1d4 negative)",
        special: "Dark Whisper (DC 15, fascinate + CP), Blood Ritual (self-harm for Focus), Cultist's Zeal",
        desc: "Humans who embraced Watcher teachings. Operate in secret societies.",
        lore: "The lowest rank of Watcher worshippers. Dark Whisper forces DC 15 Will — critical failure gives the target +1 CP. Blood Ritual deals 1d4 bleed to themselves to gain a Focus Point. Cultist's Zeal grants +1 to attack and damage after killing a foe. They cast charm, illusory disguise, and unseen servant. Starts at 3 CP.",
        saves: "Fort +8, Ref +9, Will +7"
      }
    ]
  },
  spirits: {
    title: "Demon Spirits — Disembodied Nephilim",
    intro: "When a giant's physical body is slain, their immortal soul cannot die nor return to heaven. They become the evil spirits (Refa'im) that wander the earth, possessing and corrupting.",
    icon: "👻",
    creatures: [
      {
        name: "Lilith, Night Mother",
        image: "/images/bestiary/Lilith.png",
        level: 15, hp: 240, ac: 38,
        attack: "Shadow Claws +32 (2d8+11 slashing + 2d6 negative)",
        special: "Midnight Talons (DC 32, drained 2-3), Night Terror (1 mile), Shadow Step (120ft), Lunar Blessing, Fly 40ft",
        desc: "Enigmatic night demon. Morally ambiguous — protects outcasts while terrorizing the wicked.",
        lore: "Associated with screech owls and the night wind (Isaiah 34:14). Her Midnight Talons deal 4d6 negative with DC 32 Fort — drained 2 or 3. Night Terror affects all sleeping creatures within one mile, inflicting frightened + CP. Shadow Step teleports her 120ft to any dim light or darkness. Moon Vulnerability gives her -2 to all checks in full moonlight. Starts at 5 CP but resists further corruption.",
        legendary: true,
        saves: "Fort +27, Ref +34, Will +31"
      },
      {
        name: "Refa'im Wraith",
        image: null,
        level: 7, hp: 90, ac: 23,
        attack: "Wraith Touch +18 (2d6+6 negative)",
        special: "Possession Mastery (DC 22), Corrupting Whisper (30ft, DC 22), Soul Drain, Spirit Command (60ft)",
        desc: "Most powerful disembodied Nephilim spirits. Former chieftains and warlords.",
        lore: "Refa'im Wraiths are the spirits of slain Nephilim leaders. Incorporeal and immune to bleed, disease, poison, and precision damage. They resist all damage except force and positive energy. Possession Mastery has DC 22 — critical failure means no new saves for 1 minute. Their Corrupting Whisper affects all living creatures within 30ft, inflicting CP and frightened. Starts at 10 CP.",
        legendary: true,
        saves: "Fort +13, Ref +17, Will +16"
      },
      {
        name: "Refa'im Spirit",
        image: null,
        level: 3, hp: 40, ac: 17,
        attack: "Spectral Touch +12 (1d6+3 negative)",
        special: "Possession Attempt (DC 16), Ethereal Jaunt, Whisper of Corruption (DC 16, +CP), Spiritual Drain",
        desc: "Disembodied spirits of slain Nephilim. Wander the earth seeking bodies to possess.",
        lore: "When a giant dies, the angelic portion of their nature cannot find rest. These spirits become the wandering demons — the Refa'im or 'shades.' They are incorporeal, immune to most physical damage, and resist everything except force and positive energy. Possession Attempt forces DC 16 Will to take over a living body. Whisper of Corruption can give targets CP. They heal when reducing creatures to 0 HP.",
        saves: "Fort +7, Ref +11, Will +10"
      }
    ]
  },
  beasts: {
    title: "Primordial Beasts — Guardians of Creation",
    intro: "The great beasts created by God to guard the wild places of the earth. Unlike the corrupted Nephilim, these ancient creatures exist outside the moral framework — they cannot gain Corruption Points.",
    icon: "🐲",
    creatures: [
      {
        name: "Behemoth",
        image: "/images/bestiary/Behemoth.png",
        level: 18, hp: 450, ac: 42,
        attack: "Bite +38 (4d10+20 piercing) / Tail Sweep +36 (3d12+18 bludgeoning) / Trample +38 (4d12+20 bludgeoning)",
        special: "Earthquake Stomp (60ft, DC 40, 10d6), Primordial Roar (120ft, DC 38), Unstoppable, Living Mountain, Purifying Presence",
        desc: "The greatest land beast. Gargantuan. Bones like bronze, limbs like iron.",
        lore: "From the Book of Job (40:15-24): 'He is the first of the ways of God.' This primordial guardian occupies a 30ft square with 25ft reach. Earthquake Stomp devastates a 60ft burst for 10d6 bludgeoning + prone + difficult terrain. Unstoppable lets him drop to 1 HP instead of 0. He is immune to Corruption and purifies the land within 1 mile — creatures resting nearby lose 1 CP per day. Only the Creator can bring a sword against him.",
        legendary: true,
        saves: "Fort +40, Ref +28, Will +32"
      },
      {
        name: "Leviathan",
        image: null,
        level: 20, hp: 500, ac: 46,
        attack: "Crushing Jaws +42 (6d10+16 piercing)",
        special: "Fire Breath (60ft cone, 12d6 fire), Impervious Scales (resist 20 physical), Tidal Wave, Immune to Corruption",
        desc: "The great sea dragon. His scales are shut together as with a close seal.",
        lore: "From Job 41: 'Out of his mouth go burning lamps, and sparks of fire leap out. His heart is as firm as a stone.' Leviathan is the primordial sea monster, counterpart to Behemoth. His Impervious Scales grant resistance 20 to non-magical physical damage. Fire Breath creates a 60ft cone dealing 12d6 fire. He cannot be corrupted and exists as a testament to divine power over the deep.",
        legendary: true
      },
      {
        name: "Ziz",
        image: null,
        level: 19, hp: 480, ac: 44,
        attack: "Talon Strike +40 (4d10+14 slashing)",
        special: "Storm Wings (hurricane 120ft), Wing Buffet (DC 38), Legendary Flight, Immune to Corruption",
        desc: "The primordial bird of the heavens. His wingspan blocks out the sun.",
        lore: "The primordial sky creature, completing the triad of Behemoth (land), Leviathan (sea), and Ziz (air). His Storm Wings can generate hurricane-force winds in a 120ft radius. Wing Buffet forces DC 38 Reflex or be knocked prone and pushed 30ft. In Jewish tradition, he protects the earth from the southern winds and is destined to be served at the feast of the righteous in the World to Come.",
        legendary: true
      }
    ]
  }
};

const BestiaryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('giants');
  const [expandedCreature, setExpandedCreature] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentCategory = BESTIARY_DATA[selectedCategory];

  const categories = [
    { id: 'giants', name: 'Giants', icon: '⚔️' },
    { id: 'watchers', name: 'Watchers', icon: '👁️' },
    { id: 'corrupted', name: 'Corrupted', icon: '🗡️' },
    { id: 'spirits', name: 'Spirits', icon: '👻' },
    { id: 'beasts', name: 'Beasts', icon: '🐲' }
  ];

  return (
    <>
      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Creature"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-2 border-amber-900"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x800/1c1917/f59e0b?text=Image+Not+Found';
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/80 text-amber-500 p-3 rounded-full hover:bg-black transition border border-amber-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="h-full bg-[#0c0a09] text-[#d6d3d1] font-serif overflow-auto">
        <div className="max-w-7xl mx-auto p-6">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel font-bold text-amber-500 mb-2">BESTIARY OF THE ANCIENT WORLD</h1>
            <div className="h-1 w-48 sm:w-64 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-3"></div>
            <p className="text-stone-400 italic text-base sm:text-lg">Creatures from the Days of Noah</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-cinzel font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-900/40 text-amber-400 border-2 border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1c1917] text-stone-400 border-2 border-[#78350f] hover:border-amber-700 hover:text-amber-500'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="uppercase tracking-wider">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Category Introduction */}
          <div className="bg-[#1c1917] border-2 border-[#78350f] rounded-lg p-6 mb-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h2 className="text-3xl font-cinzel font-bold text-amber-500 mb-3 flex items-center gap-3">
              <span className="text-4xl">{currentCategory.icon}</span>
              {currentCategory.title}
            </h2>
            <p className="text-stone-300 text-lg italic leading-relaxed">
              {currentCategory.intro}
            </p>
          </div>

          {/* Creatures Grid */}
          <div className="space-y-6">
            {currentCategory.creatures.map((creature, idx) => (
              <div
                key={idx}
                className={`bg-[#1c1917] border-2 rounded-lg overflow-hidden transition-all ${
                  creature.legendary
                    ? 'border-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
                    : 'border-[#78350f]'
                } ${
                  expandedCreature === idx ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">

                  {/* Image Section */}
                  {creature.image && (
                    <div
                      className="md:w-96 lg:w-[28rem] flex-shrink-0 cursor-pointer group relative overflow-hidden bg-black"
                      onClick={() => setSelectedImage(creature.image)}
                    >
                      <img
                        src={creature.image}
                        alt={creature.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x400/1c1917/f59e0b?text=${creature.name.replace(/ /g, '+')}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 p-6">

                    {/* Name and Tags */}
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <h3 className="text-2xl font-cinzel font-bold text-amber-500 flex items-center gap-2 flex-wrap">
                        {creature.name}
                        {creature.legendary && (
                          <span className="text-amber-400 text-lg">★ LEGENDARY</span>
                        )}
                        {creature.bound && (
                          <span className="text-red-500 text-sm bg-red-900/30 border border-red-800 px-2 py-1 rounded">⛓️ BOUND</span>
                        )}
                      </h3>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                        <span className="text-xs text-stone-500 uppercase">Level</span>
                        <div className="text-lg font-bold text-amber-500">{creature.level}</div>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                        <span className="text-xs text-stone-500 uppercase">HP</span>
                        <div className="text-lg font-bold text-amber-500">{creature.hp}</div>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                        <span className="text-xs text-stone-500 uppercase">AC</span>
                        <div className="text-lg font-bold text-amber-500">{creature.ac}</div>
                      </div>
                      {creature.saves && (
                        <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                          <span className="text-xs text-stone-500 uppercase">Saves</span>
                          <div className="text-xs font-bold text-amber-500">{creature.saves}</div>
                        </div>
                      )}
                    </div>

                    {/* Attack & Special */}
                    <div className="space-y-2 mb-4">
                      <p className="text-stone-300">
                        <strong className="text-amber-500">Attack:</strong> {creature.attack}
                      </p>
                      <p className="text-stone-300">
                        <strong className="text-amber-500">Special:</strong> {creature.special}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-stone-400 italic mb-4 leading-relaxed">
                      {creature.desc}
                    </p>

                    {/* Lore Section (Expandable) */}
                    {creature.lore && (
                      <div>
                        <button
                          onClick={() => setExpandedCreature(expandedCreature === idx ? null : idx)}
                          className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition mb-3"
                        >
                          <span className={`transform transition-transform ${expandedCreature === idx ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          <span className="text-xs uppercase tracking-widest flex items-center gap-2">
                            📜 Ancient Lore
                          </span>
                        </button>

                        {expandedCreature === idx && (
                          <div className="bg-[#0c0a09] border-l-4 border-amber-600 p-4 rounded text-stone-300 leading-relaxed">
                            <p className="text-sm">{creature.lore}</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-stone-600 text-sm border-t border-[#78350f] pt-6">
            <p className="italic">
              "There were giants in the earth in those days; and also after that, when the sons of God came in unto the daughters of men, and they bare children to them, the same became mighty men which were of old, men of renown."
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest">— Genesis 6:4</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default BestiaryScreen;
