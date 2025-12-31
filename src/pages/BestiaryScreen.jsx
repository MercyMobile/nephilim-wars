import React, { useState } from 'react';

// Complete Bestiary Data from Ancient Texts
const BESTIARY_DATA = {
  giants: {
    title: "Giants — The Forbidden Offspring",
    intro: "Born of Watcher and human unions, the Nephilim terrorize the earth. Their strength is beyond mortal comprehension, their cruelty boundless.",
    icon: "⚔️",
    creatures: [
      {
        name: "Ohya, Son of Semyaza",
        image: "/images/bestiary/Ohya.png",
        hd: 14, hp: 140, def: 18,
        attack: "Sword of Wrath +14 (4d10+8 fire)",
        special: "Legendary, Prophetic Dreams",
        desc: "The wrathful first-born of Semyaza.",
        lore: "In the Book of Giants, Ohya is plagued by nightmares. He dreamt of a great tablet submerged in water, where names were washed away until only three remained (symbolizing Noah's sons). He is the more violent brother, constantly arguing against the judgment that Mahway brings news of.",
        legendary: true
      },
      {
        name: "Hahya, Brother of Ohya",
        image: "/images/bestiary/Hahya.png",
        hd: 12, hp: 110, def: 16,
        attack: "Greataxe +11 (3d12+6)",
        special: "Legendary, Dream Visions",
        desc: "The contemplative brother.",
        lore: "Hahya had a distinct dream of a garden where gardeners (angels) watered 200 trees and great shoots, only to burn the garden and leave one tree standing. He represents the giants' realization that their 'fathers' (the Watchers) cannot save them from the coming Flood.",
        legendary: true
      },
      {
        name: "Mahway, the Winged",
        image: "/images/bestiary/Mahway.png",
        hd: 10, hp: 95, def: 19,
        attack: "Diving Attack +12 (4d8+5)",
        special: "Legendary, True Flight",
        desc: "Son of Barakel, the messenger.",
        lore: "Mahway is unique among giants for his ability to fly. In the texts, he is sent by the other giants to fly to the 'ends of the earth' to find Enoch the Scribe and petition for mercy. He returns with the Tablet of Judgment, sealing the giants' fate.",
        legendary: true
      },
      {
        name: "Gilgamesh",
        image: "/images/bestiary/Gilgamesh.png",
        hd: 12, hp: 120, def: 17,
        attack: "Hero's Blade +12 (3d10+7)",
        special: "Legendary, Wrestler Supreme",
        desc: "The legendary hero-king.",
        lore: "Mentioned explicitly in the Dead Sea Scrolls fragments of the Book of Giants. Unlike the Mesopotamian hero, here he is one of the Nephilim offspring, a mighty warrior confused by the nightmares plaguing his brethren.",
        legendary: true
      },
      {
        name: "Greater Giant (1st Gen)",
        image: "/images/bestiary/GreaterGiant.png",
        hd: 16, hp: 160, def: 16,
        attack: "Massive Club +12 (4d12+8)",
        special: "Colossal, Terrifying Presence",
        desc: "Towering 15-20 feet tall.",
        lore: "The first generation, direct offspring of Watchers and women. These are the 'men of renown' who became tyrant-kings, devouring all provisions and turning to cannibalism when resources failed."
      },
      {
        name: "Gibborim (2nd Gen)",
        image: "/images/bestiary/Gibborim.png",
        hd: 10, hp: 100, def: 17,
        attack: "Bronze Sword +10 (3d10+6)",
        special: "Giant-Sized, Watcher's Blood",
        desc: "The 'mighty men of old.'",
        lore: "These are the Gibborim, the mighty men of renown. While smaller than their first-generation sires, they rule city-states with iron fists and possess superior strength to any mortal man."
      },
      {
        name: "Nephilim Sorcerer",
        image: "/images/bestiary/NephilimSorceror.png",
        hd: 8, hp: 70, def: 14,
        attack: "Watcher's Fire +10 (3d8 fire)",
        special: "Forbidden Sorcery, Spirit Sight",
        desc: "Taught the dark arts by their fathers.",
        lore: "Semyaza taught enchantments and root-cutting. These sorcerers use that forbidden knowledge to bind spirits and corrupt the land."
      },
      {
        name: "Elioud Hunter",
        image: "/images/bestiary/NephilimHunter.jpg",
        hd: 6, hp: 55, def: 15,
        attack: "Barbed Spear +8 (2d8+4)",
        special: "Large, Darkvision, Ambush",
        desc: "Twisted with cruelty.",
        lore: "The third generation (Elioud) were smaller but more vicious, serving as the scouts and hunters for the great giant kings."
      },
      {
        name: "Elioud Deceiver",
        image: "/images/bestiary/ElioudDeceiver.jpg",
        hd: 5, hp: 45, def: 13,
        attack: "Hidden Blade +7 (2d6+3)",
        special: "Shapeshifting, Silver Tongue",
        desc: "Can compress their forms.",
        lore: "Some Elioud inherited the shape-shifting deception of the Watchers, able to pass as large humans to infiltrate settlements."
      },
      {
        name: "Giant Thrall",
        image: "/images/bestiary/Thrall.png",
        hd: 4, hp: 35, def: 12,
        attack: "Crude Club +5 (2d8+3)",
        special: "Large, Enslaved",
        desc: "Lesser giants.",
        lore: "Runts of the litter, enslaved by their stronger brothers to haul stones for the great cyclopean cities."
      }
    ]
  },
  watchers: {
    title: "The Watchers — Fallen Angels",
    intro: "The 200 angels who descended upon Mount Hermon, bound by oath to corrupt humanity. Now imprisoned, their legacy endures.",
    icon: "👁️",
    creatures: [
      {
        name: "Azazel (Bound)",
        image: "/images/bestiary/Azazel.jpg",
        hd: 20, hp: 200, def: 22,
        attack: "Burning Blade +16 (5d10+10)",
        special: "Bound in Dudael, Weapon Mastery",
        desc: "Bound beneath jagged rocks.",
        lore: "The chief corrupter who taught men to make swords, knives, shields, and breastplates. By divine command, Raphael bound him hand and foot and cast him into the darkness of Dudael, piling rough and jagged rocks upon him. On the Day of Judgment, he will be cast into the fire.",
        legendary: true,
        bound: true
      },
      {
        name: "Semyaza",
        image: "/images/bestiary/Semyaza.png",
        hd: 18, hp: 180, def: 20,
        attack: "Arcane Bolt +15 (4d10+8)",
        special: "Master of Oaths, Root-Cutting",
        desc: "Leader of the rebellion.",
        lore: "The leader of the 200. He feared to descend alone, so he made all 200 swear an oath (anathema) on Mount Hermon to fulfill their deed together. He taught enchantments and the properties of roots. He is bound between heaven and earth, suspended in Tartarus.",
        legendary: true
      },
      {
        name: "Shemihazah",
        image: "/images/bestiary/Semyaza.png",
        hd: 17, hp: 170, def: 20,
        attack: "Chain Lightning +14 (4d8+8)",
        special: "Storm Caller, Oath-Binder",
        desc: "Variant name of Semyaza.",
        lore: "In some texts, Shemihazah is the chief of the Watchers. He hangs between heaven and earth in the constellation Orion, a warning to all who would rebel.",
        legendary: true
      },
      {
        name: "Baraqel",
        image: null,
        hd: 15, hp: 150, def: 18,
        attack: "Lightning Strike +13 (3d10+7)",
        special: "Astrologer, Weather Control",
        desc: "Teacher of the stars.",
        lore: "Baraqel taught astrology—the observation and interpretation of the stars. While seeming innocent, this knowledge gave humanity power over the heavenly bodies, disrupting the ordained order.",
        legendary: false
      },
      {
        name: "Kokabiel",
        image: null,
        hd: 15, hp: 145, def: 18,
        attack: "Star Fire +13 (3d10+6)",
        special: "Constellation Master",
        desc: "Star of God.",
        lore: "Kokabiel taught the constellations and their meanings, giving humanity forbidden knowledge of the heavens' patterns and cycles.",
        legendary: false
      }
    ]
  },
  corrupted: {
    title: "Corrupted Humanity",
    intro: "Those who have abandoned the Creator to serve the giants and practice forbidden arts. Their souls are twisted beyond redemption.",
    icon: "🗡️",
    creatures: [
      {
        name: "Baal-Priest",
        image: null,
        hd: 6, hp: 50, def: 13,
        attack: "Sacrificial Knife +6 (2d6+2)",
        special: "Dark Sorcery, Blood Magic",
        desc: "Priests of the Nephilim god-kings.",
        lore: "Humans who have abandoned the Creator to worship the Nephilim as gods, performing blood sacrifices to fuel their dark miracles. They channel demonic power through ritualistic murder."
      },
      {
        name: "Lamech the Avenger",
        image: null,
        hd: 9, hp: 85, def: 17,
        attack: "Tubal-Cain's Blade +11 (3d8+5)",
        special: "Legendary, Vengeance Oath",
        desc: "The infamous Cainite.",
        lore: "Seventh from Adam in the line of Cain. He boasted to his wives Adah and Zillah that he had slain a man for wounding him, claiming a vengeance seventy-seven fold. His blade was forged by Tubal-Cain, the first metalworker.",
        legendary: true
      },
      {
        name: "Cainite Warrior",
        image: null,
        hd: 5, hp: 45, def: 14,
        attack: "Bronze Sword +7 (2d8+3)",
        special: "Mark of Cain, Vengeance",
        desc: "Descendants of the first murderer.",
        lore: "The line of Cain built the first cities and developed metalworking. They are marked by violence and innovation, bearing weapons superior to the Sethites."
      }
    ]
  },
  spirits: {
    title: "Demon Spirits — Disembodied Nephilim",
    intro: "When a giant's physical body is slain, their immortal soul cannot die nor return to heaven. They become the evil spirits that wander the earth.",
    icon: "👻",
    creatures: [
      {
        name: "Lilith",
        image: "/images/bestiary/Lilith.png",
        hd: 15, hp: 120, def: 19,
        attack: "Midnight Talons +12 (4d6+6)",
        special: "Flight, Night Terror, Child-Stealer",
        desc: "Ancient demon queen.",
        lore: "Often associated with the night wind and screech owls (Isaiah 34:14). In this era, she is the mother of monsters, haunting the desolate places. She preys upon newborns and women in childbirth, draining their life force.",
        legendary: true
      },
      {
        name: "Giant-Spirit (Refa'im)",
        image: null,
        hd: 8, hp: 65, def: 15,
        attack: "Spectral Slam +8 (3d8+4)",
        special: "Incorporeal, Possession",
        desc: "Wandering spirit of slain giant.",
        lore: "When a giant's physical body is killed, their immortal soul (half-angelic) cannot die nor return to heaven. They become the 'evil spirits' that wander the earth, oppressing, corrupting, and possessing humanity. These are the refa'im, the shades."
      },
      {
        name: "Succubus",
        image: null,
        hd: 7, hp: 55, def: 16,
        attack: "Life Drain +9 (2d8+3 + drain)",
        special: "Shapeshifting, Dream Walking",
        desc: "Female demon seductress.",
        lore: "Daughters of Lilith or corrupted human spirits. They appear in dreams and seduce mortals, stealing their vitality and sometimes producing offspring."
      }
    ]
  },
  beasts: {
    title: "Corrupted Beasts — Primordial Monsters",
    intro: "The great beasts of creation, twisted by the corruption spreading across the earth. Some say they predate even Adam.",
    icon: "🐲",
    creatures: [
      {
        name: "Behemoth",
        image: "/images/bestiary/Behemoth.png",
        hd: 18, hp: 180, def: 18,
        attack: "Tail Sweep +14 (5d10+8)",
        special: "Colossal Beast, Unstoppable",
        desc: "The greatest land beast.",
        lore: "The primeval land-monster created on the sixth day. His tail moves like a cedar; the sinews of his stones are wrapped together. He is the masterpiece of God's physical creation, now roaming the wilderness. Only the Creator can bring a sword against him (Job 40:19).",
        legendary: true
      },
      {
        name: "Leviathan",
        image: null,
        hd: 20, hp: 200, def: 22,
        attack: "Crushing Jaws +16 (6d10+10)",
        special: "Fire Breath, Impervious Scales",
        desc: "The twisted sea serpent.",
        lore: "The great sea dragon, companion to Behemoth. His scales are his pride, shut together as with a close seal. Out of his mouth go burning lamps, and sparks of fire leap out (Job 41). He is unconquerable by mortal means.",
        legendary: true
      },
      {
        name: "Ziz",
        image: null,
        hd: 16, hp: 150, def: 20,
        attack: "Talon Strike +13 (4d10+7)",
        special: "Legendary Flight, Storm Wings",
        desc: "The great bird of the heavens.",
        lore: "The primordial bird, counterpart to Behemoth (land) and Leviathan (sea). His wingspan blocks out the sun. In Jewish tradition, he is destined to be served at the feast of the righteous in the World to Come.",
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
                        <span className="text-xs text-stone-500 uppercase">HD</span>
                        <div className="text-lg font-bold text-amber-500">{creature.hd}</div>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                        <span className="text-xs text-stone-500 uppercase">HP</span>
                        <div className="text-lg font-bold text-amber-500">{creature.hp}</div>
                      </div>
                      <div className="bg-[#0c0a09] border border-[#44403c] px-3 py-2 rounded">
                        <span className="text-xs text-stone-500 uppercase">Defense</span>
                        <div className="text-lg font-bold text-amber-500">{creature.def}</div>
                      </div>
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
