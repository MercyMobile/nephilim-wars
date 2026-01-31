import React, { useState, useRef, useEffect, useCallback } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const fullscreenContainerRef = useRef(null);

  // Handle fullscreen state changes from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIs3DFullscreen(isFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Toggle native fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = fullscreenContainerRef.current;
    if (!container) return;

    try {
      if (!is3DFullscreen) {
        // Enter fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [is3DFullscreen]);

  // --- EDUCATIONAL CONTENT ---
  const breastplateStones = [
    { name: "Sardius", tribe: "Reuben", gradient: "radial-gradient(ellipse at 30% 20%, #ff6b6b 0%, #dc2626 40%, #7f1d1d 100%)", glow: "rgba(220, 38, 38, 0.6)", meaning: "The Firstborn" },
    { name: "Topaz", tribe: "Simeon", gradient: "radial-gradient(ellipse at 30% 20%, #fef08a 0%, #eab308 40%, #a16207 100%)", glow: "rgba(234, 179, 8, 0.6)", meaning: "Hearing" },
    { name: "Carbuncle", tribe: "Levi", gradient: "radial-gradient(ellipse at 30% 20%, #f87171 0%, #991b1b 40%, #450a0a 100%)", glow: "rgba(153, 27, 27, 0.5)", meaning: "Joined" },
    { name: "Emerald", tribe: "Judah", gradient: "radial-gradient(ellipse at 30% 20%, #6ee7b7 0%, #059669 40%, #064e3b 100%)", glow: "rgba(5, 150, 105, 0.6)", meaning: "Praise" },
    { name: "Sapphire", tribe: "Issachar", gradient: "radial-gradient(ellipse at 30% 20%, #93c5fd 0%, #2563eb 40%, #1e3a8a 100%)", glow: "rgba(37, 99, 235, 0.6)", meaning: "Reward" },
    { name: "Diamond", tribe: "Zebulun", gradient: "radial-gradient(ellipse at 30% 20%, #ffffff 0%, #e2e8f0 30%, #94a3b8 70%, #64748b 100%)", glow: "rgba(255, 255, 255, 0.8)", textDark: true, meaning: "Dwelling" },
    { name: "Jacinth", tribe: "Dan", gradient: "radial-gradient(ellipse at 30% 20%, #fdba74 0%, #ea580c 40%, #7c2d12 100%)", glow: "rgba(234, 88, 12, 0.6)", meaning: "Judge" },
    { name: "Agate", tribe: "Naphtali", gradient: "radial-gradient(ellipse at 30% 20%, #d6d3d1 0%, #78716c 40%, #44403c 100%)", glow: "rgba(120, 113, 108, 0.5)", meaning: "Wrestling" },
    { name: "Amethyst", tribe: "Gad", gradient: "radial-gradient(ellipse at 30% 20%, #c4b5fd 0%, #7c3aed 40%, #4c1d95 100%)", glow: "rgba(124, 58, 237, 0.6)", meaning: "Troop" },
    { name: "Beryl", tribe: "Asher", gradient: "radial-gradient(ellipse at 30% 20%, #5eead4 0%, #0d9488 40%, #134e4a 100%)", glow: "rgba(13, 148, 136, 0.6)", meaning: "Happy" },
    { name: "Onyx", tribe: "Joseph", gradient: "radial-gradient(ellipse at 30% 20%, #525252 0%, #171717 40%, #000000 100%)", glow: "rgba(82, 82, 82, 0.4)", meaning: "Adding" },
    { name: "Jasper", tribe: "Benjamin", gradient: "radial-gradient(ellipse at 30% 20%, #fca5a5 0%, #b91c1c 40%, #450a0a 100%)", glow: "rgba(185, 28, 28, 0.5)", meaning: "Son of Right Hand" }
  ];

  const garmentData = [
    {
      part: "The Ephod (אֵפוֹד)",
      detail: "A woven vest of gold, blue, purple, and scarlet threads—the gold beaten into thin sheets, then cut into threads and woven with the fabric. On its shoulders sat two onyx stones in gold settings, each engraved with six tribal names in birth order. The High Priest literally carried the weight of the nation on his shoulders before God.",
      scripture: "Exodus 28:6-14",
      historicalNote: "The ephod was so central to Israelite worship that the term became synonymous with seeking God's will. When David fled from Saul, he asked Abiathar to 'bring the ephod' to inquire of the LORD (1 Samuel 23:9)."
    },
    {
      part: "The Hoshen (חֹשֶׁן) — Breastplate of Judgment",
      detail: "A square pouch of the same woven material as the ephod, folded double to create a pocket. Twelve precious stones were set in gold filigree, arranged in four rows of three. Inside the fold rested the mysterious Urim and Thummim—'Lights and Perfections'—used to receive divine guidance in matters of national importance.",
      scripture: "Exodus 28:15-30",
      historicalNote: "The Talmud records that the Urim and Thummim functioned by causing specific letters on the stones to light up, spelling out God's answer. After the destruction of Solomon's Temple, the Urim and Thummim were among the five things that 'ceased from Israel' and were never restored."
    },
    {
      part: "The Robe of the Ephod (מְעִיל)",
      detail: "A seamless garment of pure blue wool (<em>tekhelet</em>), woven in one piece with an opening for the head reinforced like armor. The hem was adorned with alternating golden bells and embroidered pomegranates in blue, purple, and scarlet. The bells announced the High Priest's movement in the Holy Place.",
      scripture: "Exodus 28:31-35",
      historicalNote: "The Talmud states: 'Why bells? So his sound shall be heard when he enters the Holy Place before the LORD and when he comes out—that he may not die.' If the bells stopped, the priests outside would know tragedy had struck. A rope was tied to the High Priest's ankle on Yom Kippur to retrieve him if necessary."
    },
    {
      part: "The Golden Plate — Tzitz (צִיץ)",
      detail: "A plate of pure gold worn across the forehead, inscribed with the words קֹדֶשׁ לַיהוָה ('HOLY TO THE LORD') in ancient Hebrew script. It was tied with a blue cord and rested above the turban. This 'flower' (the literal meaning of <em>tzitz</em>) of gold served to 'bear the iniquity' of the holy offerings.",
      scripture: "Exodus 28:36-38",
      historicalNote: "Archaeological parallels exist in Egyptian and Mesopotamian cultures, where royal and priestly figures wore forehead ornaments. But only Israel's bore words dedicating the wearer entirely to their God—a radical statement of exclusive devotion."
    },
    {
      part: "The Turban (מִצְנֶפֶת) and Sash (אַבְנֵט)",
      detail: "The turban was wound from fine white linen, creating a tall headdress upon which the golden plate was fastened. The sash (avnet) was a long woven belt of blue, purple, scarlet, and white linen, wrapped multiple times around the waist in an intricate pattern.",
      scripture: "Exodus 28:39",
      historicalNote: "Josephus, the first-century Jewish historian, described the turban as resembling a crown, rising to a point. The sash was reportedly 32 cubits long (about 48 feet) and wound repeatedly to create a visible reminder of being 'girded' for service."
    },
    {
      part: "The Linen Undergarments",
      detail: "Beneath the visible glory, the High Priest wore simple white linen breeches (מִכְנְסֵי־בָד) and a white linen tunic (כְּתֹנֶת). These humble garments touched his skin directly—a foundation of purity beneath the outward splendor.",
      scripture: "Exodus 28:42-43",
      historicalNote: "On Yom Kippur, the High Priest removed all the golden garments and entered the Holy of Holies wearing only these simple white linens. The most sacred moment of the year was approached in humility, not glory."
    }
  ];

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-stone-900 selection:bg-gold-500/30">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-cinzel text-5xl text-amber-800 tracking-widest uppercase">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-amber-700 mt-2 uppercase italic">Pattern of the Heavenly</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* SIDEBAR NAVIGATION */}
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 border-stone-300 pb-4 lg:pb-0">
          {['sanctuary', 'elements', 'garments', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-xs tracking-widest ${
                activeView === tab 
                  ? 'border-amber-500 bg-stone-900 text-gold-400 font-black lg:translate-x-2 shadow-md' 
                  : 'border-transparent lg:border-stone-300 text-stone-600 hover:text-amber-900 hover:bg-stone-300 font-bold'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 min-h-[600px]">
          
          {/* 3D VIEWER */}
          {activeView === 'sanctuary' && (
            <div className="animate-fadeIn">
                <div
                    ref={fullscreenContainerRef}
                    className={`relative ${is3DFullscreen ? 'bg-black' : ''}`}
                >
                    <iframe
                        src="/humble-tabernacle/gptab.html"
                        title="The Tabernacle of Moses - Interactive 3D Model"
                        className={`${is3DFullscreen ? 'w-screen h-screen' : 'w-full h-[600px] rounded-xl border-2 border-amber-700/50'}`}
                        style={{ border: 'none' }}
                        allow="fullscreen"
                    />
                    <button
                        onClick={toggleFullscreen}
                        className={`absolute ${is3DFullscreen ? 'top-4 right-4' : 'top-2 right-2'} bg-stone-900/80 hover:bg-stone-800 text-gold-400 px-3 py-1.5 rounded-lg border border-amber-600/50 font-cinzel text-xs tracking-wide transition-all hover:scale-105 z-10`}
                    >
                        {is3DFullscreen ? '✕ EXIT' : '⛶ FULLSCREEN'}
                    </button>
                </div>
                {!is3DFullscreen && (
                    <div className="mt-6 p-4 border-l-4 border-amber-600 bg-parchment-100 text-sm text-stone-700 leading-relaxed">
                        <p><strong>Interactive 3D Model:</strong> Click on sacred objects to learn about their biblical significance. The Courtyard measures 100×50 cubits with white linen walls (purity) on bronze pillars (judgment). Inside stands the Mishkan (30×10 cubits) - gold (divinity) resting on silver (redemption).</p>
                    </div>
                )}
            </div>
          )}

          {/* ELEMENTS TAB */}
          {activeView === 'elements' && (
            <div className="animate-fadeIn space-y-8">
                {/* Introduction */}
                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-lg border-l-4 border-amber-600">
                    <h2 className="font-cinzel text-2xl text-amber-800 mb-3">The Sacred Architecture</h2>
                    <p className="text-sm leading-relaxed text-stone-700 italic">
                        "And let them make Me a sanctuary, that I may dwell among them. According to all that I show you—the pattern of the tabernacle and the pattern of all its furnishings—just so you shall make it." <span className="text-amber-700 font-semibold">— Exodus 25:8-9</span>
                    </p>
                </div>

                {/* The Boards */}
                <div className="bg-parchment-100 p-6 rounded-lg shadow-md">
                    <h3 className="font-cinzel text-xl text-amber-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🪵</span> The Boards (Ha'Kerashim)
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed text-stone-800">
                        <p>
                            The walls of the Mishkan were not woven fabric but <strong>48 massive boards of acacia wood</strong>, each overlaid with pure gold. These boards measured 10 cubits tall (approximately 15 feet) and 1.5 cubits wide (27 inches), standing upright like soldiers at attention.
                        </p>
                        <p>
                            The Hebrew word <em>kerashim</em> shares its root with the word for "truth" (<em>kosher</em>). Ancient rabbis noted that when these boards stood "shoulder to shoulder," they formed an unbroken wall of gold—a picture of unified believers standing together in righteousness.
                        </p>
                        <div className="bg-amber-50 p-4 rounded border-l-2 border-amber-400 mt-4">
                            <p className="text-xs text-amber-900">
                                <strong>Historical Note:</strong> Acacia wood (<em>shittim</em>) was the only timber available in the Sinai wilderness. This thorny, twisted tree grows in the harshest conditions—yet when cut and planed, it produces wood of exceptional hardness and beauty. The Talmud says this represents how God takes broken humanity and fashions vessels of glory.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Silver Sockets */}
                    <div className="bg-stone-800 text-parchment-100 p-5 rounded-lg border border-stone-600 shadow-lg">
                        <h4 className="font-cinzel text-amber-400 text-sm tracking-widest mb-3 uppercase">The Silver Sockets (Adanim)</h4>
                        <div className="space-y-3 text-xs leading-relaxed opacity-95">
                            <p>
                                Beneath every golden board sat <strong>two silver sockets</strong>—100 in total, each weighing exactly one talent (approximately 75 pounds). This silver came from a remarkable source: the half-shekel "ransom money" collected during the census of Israel (Exodus 30:11-16).
                            </p>
                            <p>
                                Every Israelite male over twenty years old contributed equally—rich and poor alike. The mathematics are precise: 603,550 men × ½ shekel = 301,775 shekels, or exactly 100 talents plus 1,775 shekels. The 100 talents formed the sockets; the remainder made hooks for the pillars.
                            </p>
                            <p className="text-amber-300 italic border-t border-stone-600 pt-3 mt-3">
                                The entire house of God literally rested upon the price of redemption. No board touched the desert sand—each stood upon purchased silver.
                            </p>
                        </div>
                    </div>

                    {/* The Middle Bar */}
                    <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-parchment-100 p-5 rounded-lg border border-amber-700 shadow-lg">
                        <h4 className="font-cinzel text-gold-400 text-sm tracking-widest mb-3 uppercase">The Middle Bar (Ha'Beriach Ha'Tichon)</h4>
                        <div className="space-y-3 text-xs leading-relaxed opacity-95">
                            <p>
                                Five horizontal bars held the boards together on each of the three walls. Four bars were visible, threaded through gold rings on the outside. But the <strong>fifth bar—the Middle Bar—was hidden</strong>, running through the very heart of the wood from end to end.
                            </p>
                            <p>
                                The Talmud (Shabbat 98b) records a miracle: this bar was made from a single piece of wood that bent around corners, spanning the entire structure without joints—an impossibility by natural means.
                            </p>
                            <p className="text-gold-300 italic border-t border-amber-700 pt-3 mt-3">
                                Jewish tradition identifies this hidden bar with Jacob's staff, preserved from the patriarchal age. It represents the invisible bond of covenant that holds God's people together.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Coverings */}
                <div className="bg-white/80 p-6 rounded-lg shadow-md">
                    <h3 className="font-cinzel text-xl text-amber-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🎪</span> The Four Coverings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded border-l-3 border-blue-400">
                            <h5 className="font-bold text-blue-900 mb-1">1. The Inner Curtain</h5>
                            <p className="text-xs text-stone-700">Fine twisted linen in blue, purple, and scarlet, with cherubim woven throughout. This was the "ceiling" visible from inside—a tapestry of heaven.</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-stone-100 to-stone-200 rounded border-l-3 border-stone-400">
                            <h5 className="font-bold text-stone-800 mb-1">2. Goat Hair Curtain</h5>
                            <p className="text-xs text-stone-700">Eleven panels of goat hair formed the "tent" (<em>ohel</em>). Goat hair is naturally waterproof and was used for bedouin tents throughout the ancient Near East.</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded border-l-3 border-red-400">
                            <h5 className="font-bold text-red-900 mb-1">3. Ram Skins Dyed Red</h5>
                            <p className="text-xs text-stone-700">The third layer—ram skins dyed red (<em>orot eilim m'adamim</em>). The ram connects to the substitute provided for Isaac and to the guilt offering.</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded border-l-3 border-slate-500">
                            <h5 className="font-bold text-slate-800 mb-1">4. Tachash Skins</h5>
                            <p className="text-xs text-stone-700">The mysterious outer layer. The Hebrew <em>tachash</em> is unknown—possibly dugong, giraffe, or an extinct species. This durable hide protected against the elements while appearing plain from outside.</p>
                        </div>
                    </div>
                    <p className="text-xs text-stone-600 mt-4 italic text-center">
                        From outside, the Tabernacle appeared as ordinary animal skins. Only those who entered saw the glory within—woven cherubim, gleaming gold, and the light of the menorah.
                    </p>
                </div>

                {/* The Veil */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-lg shadow-xl">
                    <h3 className="font-cinzel text-xl text-purple-200 mb-4 flex items-center gap-2">
                        <span className="text-2xl">✨</span> The Veil (Parochet)
                    </h3>
                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            The most sacred curtain in the Tabernacle separated the Holy Place from the Holy of Holies. Woven of blue, purple, and scarlet yarn with fine twisted linen, it bore the images of <strong>cherubim</strong>—the guardians of God's presence.
                        </p>
                        <p>
                            According to Jewish tradition, this veil was a <em>handbreadth thick</em> (approximately 4 inches) and required 300 priests to immerse it for washing. The Talmud states it was woven by 82 young women and was so valuable that if it became ritually impure, it required the combined wealth of all Israel to replace.
                        </p>
                        <div className="bg-white/10 p-4 rounded mt-4">
                            <p className="text-purple-200 text-xs">
                                <strong>Prophetic Connection:</strong> When Yeshua died on Passover, the Gospels record that the veil of the Temple was torn from top to bottom (Matthew 27:51). The direction—from heaven downward—indicated that God Himself had opened the way into His presence.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Courtyard Furnishings */}
                <div className="space-y-4">
                    <h3 className="font-cinzel text-xl text-amber-800">Furnishings of the Outer Court</h3>

                    <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                        <h4 className="font-cinzel text-orange-900 mb-2 flex items-center gap-2">
                            <span>🔥</span> The Bronze Altar (Mizbeach Ha'Olah)
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            The first object encountered upon entering the courtyard was the altar of burnt offering—a hollow box of acacia wood overlaid with bronze, measuring 5 cubits square and 3 cubits high. Its four corners bore "horns," and a bronze grating held the sacrifices above the fire. Here, the morning and evening <em>tamid</em> sacrifices burned continually, filling the camp with the aroma the Torah calls "a sweet savor unto the LORD."
                        </p>
                        <p className="text-xs text-orange-800 mt-3 italic">
                            The fire on this altar was never to go out (Leviticus 6:13). Tradition holds this was the original fire that fell from heaven at the altar's dedication.
                        </p>
                    </div>

                    <div className="bg-cyan-50 p-5 rounded-lg border border-cyan-200">
                        <h4 className="font-cinzel text-cyan-900 mb-2 flex items-center gap-2">
                            <span>💧</span> The Bronze Laver (Kiyor)
                        </h4>
                        <p className="text-sm text-stone-700 leading-relaxed">
                            Between the altar and the Tabernacle entrance stood the bronze laver—a basin for priestly washing. Remarkably, the Torah specifies it was made from the <strong>bronze mirrors of the women</strong> who served at the entrance to the Tent of Meeting (Exodus 38:8).
                        </p>
                        <p className="text-xs text-cyan-800 mt-3 italic">
                            Moses initially hesitated to use these "vanity" items, but God insisted. The midrash explains: these mirrors had been used to beautify the Hebrew women in Egypt, keeping their husbands' hope alive during slavery. Now they would reflect the priests' readiness to serve.
                        </p>
                    </div>
                </div>
            </div>
          )}

          {/* GARMENTS TAB */}
          {activeView === 'garments' && (
            <div className="animate-fadeIn space-y-8">
              {/* Header */}
              <div className="text-center">
                <h2 className="font-cinzel text-amber-800 text-2xl mb-2 uppercase tracking-[0.2em]">Vestments of Glory</h2>
                <p className="text-sm text-stone-600 italic max-w-xl mx-auto">
                  "And you shall make holy garments for Aaron your brother, for glory and for beauty."
                  <span className="text-amber-700 font-semibold ml-1">— Exodus 28:2</span>
                </p>
              </div>

              {/* The Sacred Colors Introduction */}
              <div className="bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-red-900/10 p-5 rounded-lg border border-amber-200">
                <h3 className="font-cinzel text-amber-900 text-sm mb-3">The Four Sacred Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 shadow-md"></div>
                    <div><strong>Blue (Tekhelet)</strong><br/><span className="text-stone-500">Heaven, divinity</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-700 shadow-md"></div>
                    <div><strong>Purple (Argaman)</strong><br/><span className="text-stone-500">Royalty, kingship</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600 shadow-md"></div>
                    <div><strong>Scarlet (Tola'at)</strong><br/><span className="text-stone-500">Blood, sacrifice</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white border border-stone-300 shadow-md"></div>
                    <div><strong>White Linen (Shesh)</strong><br/><span className="text-stone-500">Purity, righteousness</span></div>
                  </div>
                </div>
              </div>

              {/* Breastplate Grid */}
              <div className="bg-stone-900 p-6 rounded-xl shadow-2xl">
                <div className="text-center mb-4">
                  <h3 className="font-cinzel text-gold-400 text-lg uppercase tracking-widest">The Hoshen</h3>
                  <p className="text-stone-400 text-xs mt-1">Twelve stones for twelve tribes, worn over the heart</p>
                </div>
                <div className="max-w-sm mx-auto grid grid-cols-3 gap-3 relative">
                  {breastplateStones.map((stone, i) => (
                    <div
                      key={i}
                      className="aspect-square group relative overflow-hidden flex flex-col items-center justify-center cursor-help transition-transform hover:scale-105"
                      style={{
                        background: stone.gradient,
                        boxShadow: `
                          inset 0 -8px 12px rgba(0,0,0,0.4),
                          inset 0 4px 8px rgba(255,255,255,0.25),
                          0 0 15px ${stone.glow},
                          0 4px 6px rgba(0,0,0,0.5)
                        `,
                        clipPath: 'polygon(8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 8%)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}
                    >
                      {/* Facet overlays */}
                      <div className="absolute top-0 left-0 w-1/2 h-1/2 opacity-30" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)' }} />
                      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20" style={{ background: 'linear-gradient(225deg, rgba(255,255,255,0.4) 0%, transparent 50%)' }} />
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-40" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                      <div className="absolute inset-[15%] opacity-20" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)', clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }} />
                      <div className="absolute top-1 left-1 w-3 h-3 rounded-full opacity-80" style={{ background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)' }} />
                      <div className="absolute top-3 left-4 w-1 h-1 rounded-full opacity-90 bg-white" />
                      <div className="absolute top-0 left-[10%] right-[10%] h-[2px] opacity-50" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
                      <span className={`text-[7px] font-bold uppercase z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${stone.textDark ? 'text-stone-800' : 'text-white/95'}`}>{stone.tribe}</span>
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center backdrop-blur-sm">
                        <span className="text-[9px] text-gold-300 font-bold">{stone.name}</span>
                        <span className="text-[7px] text-stone-300 mt-1">{stone.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-stone-500 text-[10px] mt-4 italic">
                  Hover over each stone to see its name and the meaning of the tribe
                </p>
              </div>

              {/* Garment Details */}
              <div className="space-y-5">
                <h3 className="font-cinzel text-xl text-amber-800 border-b border-amber-200 pb-2">The Eight Garments of the High Priest</h3>
                {garmentData.map((g, i) => (
                  <div key={i} className="bg-white/70 p-5 rounded-lg border-l-4 border-amber-500 hover:bg-white transition-colors shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-cinzel text-amber-900 font-bold">{g.part}</h4>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{g.scripture}</span>
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: g.detail }}></p>
                    <div className="bg-stone-100 p-3 rounded text-xs text-stone-600 border-l-2 border-stone-400">
                      <strong className="text-stone-700">Historical Note:</strong> {g.historicalNote}
                    </div>
                  </div>
                ))}
              </div>

              {/* The Ordinary Priests */}
              <div className="bg-gradient-to-r from-stone-100 to-stone-200 p-6 rounded-lg">
                <h3 className="font-cinzel text-stone-800 text-lg mb-3">The Ordinary Priests (Kohanim)</h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-4">
                  While the High Priest wore eight garments, the ordinary priests serving in the Tabernacle wore only four: the white linen tunic, the linen breeches, the sash, and a simple linen turban (different from the High Priest's). These "garments of service" emphasized purity over splendor—yet even these required specific craftsmanship and were considered holy.
                </p>
                <p className="text-xs text-stone-600 italic">
                  "No priest could serve with even a single garment missing or torn. To approach God required complete preparation—nothing casual, nothing careless."
                </p>
              </div>
            </div>
          )}

          {/* ARCHAEOLOGY TAB */}
          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-900/20 to-transparent p-6 rounded-lg border-l-4 border-amber-600">
                    <h2 className="text-2xl font-cinzel text-amber-800 uppercase tracking-widest mb-2">The Witness of the Spade</h2>
                    <p className="text-sm text-stone-600 italic">
                        "Go now to My place which was in Shiloh, where I set My name at the first, and see what I did to it..."
                        <span className="text-amber-700 font-semibold ml-1">— Jeremiah 7:12</span>
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-parchment-100 p-5 rounded-lg">
                    <p className="text-sm text-stone-700 leading-relaxed">
                        For centuries, skeptics dismissed the Tabernacle as a literary invention—a fictional "retrojection" of Solomon's Temple into the wilderness period. But modern archaeology has begun to tell a different story. From the sands of Shiloh to the treasures of Egypt, evidence continues to emerge that the Tabernacle was not only possible but probable.
                    </p>
                </div>

                {/* The Journey Section */}
                <div className="bg-stone-800 p-6 rounded-xl text-parchment-100">
                    <h3 className="font-cinzel text-gold-400 text-lg mb-4 flex items-center gap-2">
                        <span>🏕️</span> The Tabernacle's Journey Through History
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="bg-stone-900/50 p-3 rounded border-l-2 border-amber-500">
                            <div className="text-amber-400 font-bold mb-1">SINAI → KADESH</div>
                            <p className="text-stone-400">~1446-1406 BC</p>
                            <p className="text-stone-500 mt-1">Constructed at Sinai. Traveled with Israel for 40 years.</p>
                        </div>
                        <div className="bg-stone-900/50 p-3 rounded border-l-2 border-amber-500">
                            <div className="text-amber-400 font-bold mb-1">GILGAL</div>
                            <p className="text-stone-400">~1406-1400 BC</p>
                            <p className="text-stone-500 mt-1">First camp in Canaan after crossing Jordan (Joshua 4:19).</p>
                        </div>
                        <div className="bg-stone-900/50 p-3 rounded border-l-2 border-amber-500">
                            <div className="text-amber-400 font-bold mb-1">SHILOH</div>
                            <p className="text-stone-400">~1400-1050 BC</p>
                            <p className="text-stone-500 mt-1">369 years as Israel's central sanctuary (Joshua 18:1).</p>
                        </div>
                        <div className="bg-stone-900/50 p-3 rounded border-l-2 border-amber-500">
                            <div className="text-amber-400 font-bold mb-1">NOB → GIBEON</div>
                            <p className="text-stone-400">~1050-960 BC</p>
                            <p className="text-stone-500 mt-1">After Shiloh's destruction. Solomon sacrificed at Gibeon (1 Kings 3:4).</p>
                        </div>
                    </div>
                </div>

                {/* Tel Shiloh Section */}
                <div className="space-y-4">
                    <h3 className="font-cinzel text-xl text-amber-800 border-b border-amber-200 pb-2 flex items-center gap-2">
                        <span>🔍</span> Excavations at Tel Shiloh
                    </h3>

                    <div className="bg-white/80 p-5 rounded-lg shadow-md">
                        <p className="text-sm text-stone-700 leading-relaxed mb-4">
                            Tel Shiloh (Khirbet Seilun) sits 20 miles north of Jerusalem in the hills of Ephraim. Excavations led by Israel Finkelstein (1981-84) and later by Dr. Scott Stripling (2017-present) have uncovered remarkable evidence of Israelite cultic activity dating to the Iron Age I period—precisely when the Bible places the Tabernacle there.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Northern Platform */}
                        <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-5 rounded-lg border border-stone-600 text-parchment-100">
                            <h4 className="text-amber-400 font-cinzel text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span>📐</span> The Northern Platform
                            </h4>
                            <p className="text-xs text-stone-300 leading-relaxed mb-3">
                                On the northern slope of the tel, archaeologists discovered a <strong>deliberately leveled bedrock platform</strong> measuring approximately 26 × 12 meters. Intriguingly, this aligns closely with the biblical dimensions of the Tabernacle courtyard (100 × 50 cubits = ~45 × 22.5 meters for the full courtyard).
                            </p>
                            <p className="text-xs text-stone-300 leading-relaxed">
                                <strong>Rock-cut depressions</strong> around the perimeter suggest post holes for a semi-permanent tent structure. Unlike typical Canaanite temple architecture (which was always stone), this site shows evidence of a <em>portable</em> structure that stood for an extended period.
                            </p>
                        </div>

                        {/* Bone Deposits */}
                        <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-5 rounded-lg border border-stone-600 text-parchment-100">
                            <h4 className="text-amber-400 font-cinzel text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span>🦴</span> The Sacrificial Bone Deposits
                            </h4>
                            <p className="text-xs text-stone-300 leading-relaxed mb-3">
                                Massive deposits of animal bones were found in pits near the platform. Analysis revealed they were almost <strong>exclusively kosher species</strong>: sheep, goats, and cattle—with virtually no pig bones (common at Canaanite sites).
                            </p>
                            <p className="text-xs text-stone-300 leading-relaxed">
                                Even more striking: a <strong>disproportionate number of right-side bones</strong>, particularly right thighs. Leviticus 7:32 commands that the "right thigh" be given to the officiating priest. The bones at Shiloh appear to be the discarded remains of priestly meals—physical evidence of Torah observance.
                            </p>
                        </div>
                    </div>

                    {/* Ceramic Pomegranate */}
                    <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 flex flex-col md:flex-row gap-5 items-center">
                        <div className="w-20 h-20 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
                            🍎
                        </div>
                        <div className="flex-1">
                            <h4 className="text-amber-900 font-cinzel text-sm uppercase tracking-widest mb-2">The Ceramic Pomegranates</h4>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                Multiple ceramic pomegranate artifacts have been recovered from Shiloh's sacred precinct, dating to the Iron Age I period. The High Priest's robe was adorned with embroidered pomegranates alternating with golden bells (Exodus 28:33-34). While we cannot prove these specific artifacts are from priestly garments, their presence in a cultic context at the biblical location is suggestive.
                            </p>
                            <p className="text-xs text-amber-700 mt-2 italic">
                                A famous ivory pomegranate inscribed "Belonging to the Temple of [Yahwe]h" was once thought to be from Solomon's Temple, though its authenticity remains debated.
                            </p>
                        </div>
                    </div>

                    {/* Destruction Layer */}
                    <div className="bg-gradient-to-r from-red-900/90 to-red-950 p-5 rounded-lg text-white">
                        <h4 className="font-cinzel text-red-200 text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span>🔥</span> The Destruction of Shiloh (~1050 BC)
                        </h4>
                        <p className="text-xs text-red-100 leading-relaxed mb-3">
                            Excavations revealed a <strong>massive destruction layer</strong> with evidence of intense fire, dating to the mid-11th century BC. This aligns precisely with the biblical account: after the Philistines captured the Ark at the Battle of Aphek (1 Samuel 4), Shiloh was abandoned. Jeremiah later used Shiloh's fate as a warning to Jerusalem (Jeremiah 7:12-14, 26:6).
                        </p>
                        <p className="text-xs text-red-200 italic">
                            Psalm 78:60 remembers: "He forsook the tabernacle of Shiloh, the tent He had placed among men."
                        </p>
                    </div>
                </div>

                {/* Egyptian Parallels */}
                <div className="space-y-4">
                    <h3 className="font-cinzel text-xl text-amber-800 border-b border-amber-200 pb-2 flex items-center gap-2">
                        <span>🏛️</span> Egyptian & Ancient Near Eastern Parallels
                    </h3>

                    <div className="bg-gradient-to-r from-yellow-900/10 to-amber-900/10 p-5 rounded-lg border border-amber-200">
                        <p className="text-sm text-stone-700 leading-relaxed mb-4">
                            Critics once claimed that a portable tent-shrine was an anachronism—that such structures didn't exist in the Bronze Age. Archaeological discoveries have proven otherwise.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-yellow-500">
                            <h5 className="font-bold text-amber-900 text-sm mb-2">The Tent of Tutankhamun</h5>
                            <p className="text-xs text-stone-600 leading-relaxed">
                                Discovered in his tomb (1323 BC), Tutankhamun's portable shrine was a wooden frame covered with gold, containing a nested series of gilded boxes protecting sacred objects. The structural concept mirrors the Tabernacle's design.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-yellow-500">
                            <h5 className="font-bold text-amber-900 text-sm mb-2">The Tent of Ramesses II</h5>
                            <p className="text-xs text-stone-600 leading-relaxed">
                                Reliefs at Abu Simbel and Luxor depict Ramesses II's royal war tent—a portable pavilion with a central reception area and an inner private chamber, divided by curtains. The layout parallels the Holy Place / Holy of Holies division.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md border-t-4 border-yellow-500">
                            <h5 className="font-bold text-amber-900 text-sm mb-2">Midianite Tent Shrines</h5>
                            <p className="text-xs text-stone-600 leading-relaxed">
                                Excavations at Timna (1969) uncovered a Midianite tent shrine from the 12th century BC with a copper serpent—strikingly similar to Moses' bronze serpent. Moses' father-in-law was a Midianite priest (Exodus 18:1).
                            </p>
                        </div>
                    </div>

                    <div className="bg-stone-100 p-4 rounded-lg text-sm text-stone-700">
                        <p className="leading-relaxed">
                            <strong>The Significance:</strong> Far from being impossible or anachronistic, portable tent-shrines were common throughout the ancient Near East. The Tabernacle fits perfectly within the cultural context of Late Bronze Age religious practice—while remaining theologically distinct in its exclusive worship of YHWH.
                        </p>
                    </div>
                </div>

                {/* Additional Evidence */}
                <div className="space-y-4">
                    <h3 className="font-cinzel text-xl text-amber-800 border-b border-amber-200 pb-2 flex items-center gap-2">
                        <span>📜</span> Additional Lines of Evidence
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                            <h5 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                                <span>🐌</span> The Tekhelet Mystery Solved
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                For centuries, the identity of <em>tekhelet</em> (the sacred blue dye) was lost. Modern research confirmed it came from the <em>Murex trunculus</em> sea snail. Remarkably, this dye produces blue only when exposed to UV light during processing—a technique the ancients somehow knew. Archaeological dye vats have been found along the Phoenician coast dating to the correct period.
                            </p>
                        </div>

                        <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                            <h5 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-2">
                                <span>🧵</span> The Textile Evidence
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                Linen and woolen textiles from the Bronze Age have been found in Egyptian tombs and the Timna mines. Analysis shows the technology described in Exodus—fine twisted linen, dyed threads, woven and embroidered work—was not only possible but represented the highest craftsmanship of the era.
                            </p>
                        </div>

                        <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                            <h5 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                                <span>⚱️</span> The Incense Altars
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                Small horned incense altars matching the biblical description have been found throughout Israel—at Megiddo, Beersheba, Arad, and elsewhere. The Arad temple even had two altars in its Holy of Holies, and the Beersheba altar had its "horns" cut off (cf. Amos 3:14).
                            </p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                            <h5 className="font-bold text-green-900 text-sm mb-2 flex items-center gap-2">
                                <span>🌿</span> The Incense Recipe
                            </h5>
                            <p className="text-xs text-stone-700 leading-relaxed">
                                The four ingredients of the sacred incense (Exodus 30:34)—stacte, onycha, galbanum, and frankincense—have all been identified as resins traded along ancient Near Eastern spice routes. Residue analysis of incense altars has confirmed these substances were actually burned in Israelite worship.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Conclusion */}
                <div className="bg-gradient-to-r from-stone-800 to-stone-900 p-6 rounded-xl text-parchment-100">
                    <h3 className="font-cinzel text-gold-400 text-lg mb-3">The Cumulative Case</h3>
                    <p className="text-sm text-stone-300 leading-relaxed mb-4">
                        No single artifact proves the Tabernacle existed. But the cumulative weight of evidence—Egyptian parallels for portable shrines, Midianite tent sanctuaries, the Shiloh excavations, the bone deposits following Levitical law, the recovery of tekhelet technology, and the consistent cultural context—demonstrates that the biblical account is historically plausible and fits precisely into its claimed time period.
                    </p>
                    <p className="text-xs text-gold-300 italic text-center">
                        "The absence of evidence is not evidence of absence—especially for a portable structure made of organic materials in a region where such materials rarely survive."
                    </p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabernacleViewer;
