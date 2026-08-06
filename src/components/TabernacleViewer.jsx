import React, { useState, useRef, useEffect, useCallback } from 'react';
import STARS from '../data/stars.json';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const [openStone, setOpenStone] = useState(null);   // index of the clicked stone, or null
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
    // ================================================================
    // THE TWELVE STONES — Exodus 28:17-20
    //
    // NOT ONE of these twelve identifications is secure, and the page used to
    // present all twelve as settled. Checked 2026-07-27 against the Hebrew
    // (Westminster Leningrad Codex), the Septuagint, the Vulgate, the KJV, the
    // NASB and Strong's, all installed locally.
    //
    // Strong's hedges on EVERY stone ("probably", "perhaps", "supposed to be",
    // "or some other red gem"), and it CONTRADICTS the KJV outright on five:
    // bareket, nophekh, yahalom, tarshish and shoham. On shevo it offers no
    // identification at all — just "a gem".
    //
    // So the Hebrew is given first, because that is the one thing that is not in
    // dispute. `hue` is how we DRAW it, and is art direction, not a claim.
    // ! ASSUMPTION - Claude: every hue below is mine.
    //
    // ---- RE-VERIFIED 2026-07-27 against primary texts in docs/scribe-texts ----
    // heb   12/12 vs bib/tan/exo028.md (pointed Hebrew)          VERIFIED
    // lxx   12/12 vs bib/sep/exo028.md (Greek)                   VERIFIED
    // kjv   12/12 vs bib/kjv/exo028.md                           VERIFIED (exact)
    // nasb  12/12 vs the NASB                                    VERIFIED
    // vulg  order+substance correct; 7 spellings CORRECTED below
    //       to match bib/vul/exo028.md
    // strongs  NOT verified - no lexicon found in the corpus.
    // meaning  NOT verified - no source checked for any of these. See flag below.
    //
    // ---- WHO GETS WHICH STONE IS **NOT** IN EXODUS ----
    // Ex 28:21 and 39:14 say twelve stones bear twelve names. NEITHER VERSE SAYS
    // WHICH TRIBE GOES ON WHICH STONE. The pairing below is not biblical.
    // It matches Pseudo-Philo (bib/bap/bap42.md) exactly, twelve for twelve --
    // that text's own front matter dates itself late 1st c. CE, but that dating
    // is one site-editor's line and is NOT independently confirmed.
    // ! The UI must say "tribe order: Pseudo-Philo, not Exodus". It now does.
    //
    // ---- optics / structure: HOW THE MINERAL BEHAVES ----
    // Added so the render obeys the stone instead of drawing twelve identical
    // gems. optics = transparent | translucent | opaque.
    // structure = plain | banded | included | mottled.
    // ! ASSUMPTION - Claude: these follow the BEST-ATTESTED reading of each
    // ! stone. Where the witnesses split, `disputed` says so and the panel shows
    // ! it. None of this is a claim that the identification is settled.
    //
    // Ex 28:21 calls them PITTUCHEI CHOTAM, "engravings of a signet", and 28:20
    // MESHUBBATSIM ZAHAV, "set in gold filigree". BOTH read in the pointed
    // Hebrew, bib/tan/exo028.md. Those two are TEXT.
    // ! ASSUMPTION - Claude: drawing them as polished DOMES follows from those
    // ! verses only by MY inference (a signet has to take an engraved name).
    // ! I have NOT sourced anything about ancient lapidary technique, and an
    // ! earlier claim of mine that faceted cuts are anachronistic was retracted
    // ! as unsourced. The dome is art direction, not an argument.
    // ================================================================
    // ---- mineral / ri / luster / diaph: MEASURED OPTICAL DATA ----
    // Read 2026-07-27 from TWO independent references, which agree:
    //   webmineral.com/data/<Mineral>.shtml
    //   handbookofmineralogy.org/pdfs/<mineral>.pdf  (Mineralogical Soc. of America)
    // Diamond: adamantine, n=2.4175 (589nm), and the Handbook states
    //   "Dispersion: Strong" with n running 2.4354 (486) to 2.4076 (687) --
    //   that spread across the spectrum IS the fire, so it is drawn with it.
    // Turquoise: BOTH sources say waxy / subtranslucent-to-opaque when massive,
    //   so nophekh is NO LONGER a faceted transparent gem. Corrected.
    // Beryl has the LOWEST ri here (1.56-1.60) -> emerald and beryl are drawn
    //   softer than corundum. Quartz 1.544/1.553 (both sources, exact match).
    // Corundum: sources CONFLICT slightly -- Handbook "adamantine to vitreous",
    //   webmineral "vitreous". Recorded as the range, not resolved.
    // Zircon luster (adamantine) is ONE SOURCE, webmineral only.
    // ! ONE SOURCE (webmineral only) for the refractive indices of corundum,
    // ! beryl, topaz, zircon and turquoise. Only DIAMOND and QUARTZ have n from
    // ! both references. The brilliance ramp below inherits that weakness.
    // ! ASSUMPTION - Claude: the MAPPING from refractive index to pixels --
    // ! facet contrast, highlight size and opacity -- is mine. The optical
    // ! constants are measured; how brightly they are drawn is art direction.
    // These are MEASURED PROPERTIES OF THE MINERALS. Which mineral each Hebrew
    // word denotes is still NOT settled -- see the trad/witness columns.
    //
    // ---- trad / ctx: TRADITIONAL RABBINIC IDENTIFICATIONS ----
    // Supplied by Cisco 2026-07-27 as the page's editorial line. These are a
    // DIFFERENT CLASS from the lxx/vulg/kjv/nasb columns, which I read directly
    // from primary texts. I have NOT checked these against any rabbinic source
    // -- they are Cisco's, and the palette now follows them.
    // Two stones changed colour: nophekh and yashpeh were drawn RED, and are
    // now blue-green and green per the traditional identification.
    // The shoham shoulder note IS text: Ex 28:9-12 (NASB, read) and Josephus
    // Ant. 3 describes two sardonyxes at the shoulders.
    //
    // vulg spellings below CORRECTED 2026-07-27 to bib/vul/exo028.md (7 changed).
    // optics/struct/split: ! ASSUMPTION - Claude, per header note.
    { heb: "odem",     strongs: "H124",  tribe: "Reuben",   meaning: "The Firstborn",
      lxx: "sardion",     vulg: "sardius",     kjv: "Sardius",   nasb: "Ruby",
      note: '"redness ... the ruby, garnet OR SOME OTHER RED GEM"',
      trad: "Ruby / Sardius", ctx: "The Hebrew root means “red.” Traditionally a deep red ruby.",
      mineral: "corundum", ri: 1.77, luster: "adamantine-vitreous", diaph: "transparent",
      optics: "transparent", struct: "plain", split: false,
      hue: "#c81e3a", deep: "#5c0a18", lite: "#ff8095" },
    { heb: "pitdah",   strongs: "H6357", tribe: "Simeon",   meaning: "Hearing",
      lxx: "topazion",    vulg: "topazius",    kjv: "Topaz",     nasb: "Topaz",
      note: '"a gem, PROBABLY the topaz"',
      trad: "Topaz", ctx: "Traditionally a highly refractive yellow or golden stone.",
      mineral: "topaz", ri: 1.62, luster: "vitreous", diaph: "transparent",
      optics: "transparent", struct: "plain", split: false,
      hue: "#e0a80f", deep: "#6b4a06", lite: "#ffec96" },
    { heb: "bareket",  strongs: "H1304", tribe: "Levi",     meaning: "Joined",
      lxx: "smaragdos",   vulg: "smaragdus",   kjv: "Carbuncle", nasb: "Emerald",
      note: '"a gem (as FLASHING), PERHAPS the emerald" — KJV says carbuncle, LXX and Vulgate say emerald',
      trad: "Carbuncle / Emerald", ctx: "The root b-r-q means “lightning” or “flash” — a brilliant, flashing stone.",
      mineral: "beryl", ri: 1.58, luster: "vitreous-resinous", diaph: "transparent",
      optics: "transparent", struct: "included", split: true,
      hue: "#16a34a", deep: "#07351f", lite: "#8dffc4" },
    { heb: "nophekh",  strongs: "H5306", tribe: "Judah",    meaning: "Praise",
      lxx: "anthrax",     vulg: "carbunculus", kjv: "Emerald",   nasb: "Turquoise",
      note: '"PROBABLY THE GARNET" — three witnesses, three different stones',
      trad: "Emerald / Turquoise", ctx: "Traditionally a deep, glowing green or blue-green precious stone.",
      mineral: "turquoise", ri: 1.62, luster: "waxy", diaph: "subtranslucent",
      optics: "translucent", struct: "plain", split: true,
      hue: "#0f93a8", deep: "#03323b", lite: "#79e8f5" },
    { heb: "sappir",   strongs: "H5601", tribe: "Issachar", meaning: "Reward",
      lxx: "sapphiros",   vulg: "sapphirus",   kjv: "Sapphire",  nasb: "Sapphire",
      note: '"PROBABLY the sapphire" — the one all four witnesses agree on',
      trad: "Sapphire", ctx: "The direct linguistic source of the modern word “sapphire.”",
      mineral: "corundum", ri: 1.77, luster: "adamantine-vitreous", diaph: "transparent",
      optics: "transparent", struct: "plain", split: false,
      hue: "#2457c5", deep: "#0b1f5e", lite: "#8fb4ff" },
    { heb: "yahalom",  strongs: "H3095", tribe: "Zebulun",  meaning: "Dwelling",
      lxx: "iaspis",      vulg: "jaspis",      kjv: "Diamond",   nasb: "Diamond",
      note: '"in the sense of HARDNESS ... PROBABLY ONYX" — LXX and Vulgate both read jasper, not diamond',
      trad: "Diamond", ctx: "The root h-l-m means “to strike hard” — an exceptionally hard, unbreakable stone.",
      mineral: "diamond", ri: 2.42, luster: "adamantine", diaph: "transparent",
      optics: "transparent", struct: "plain", split: true,
      hue: "#dfe6ee", deep: "#798593", lite: "#ffffff" },
    { heb: "leshem",   strongs: "H3958", tribe: "Dan",      meaning: "Judge",
      lxx: "ligyrion",    vulg: "ligurius",    kjv: "Ligure",    nasb: "Jacinth",
      note: '"of UNCERTAIN meaning; a gem, PERHAPS the jacinth"',
      trad: "Ligure / Jacinth", ctx: "Traditionally a warm amber or deep orange-red hue.",
      mineral: "zircon", ri: 1.95, luster: "adamantine", diaph: "transparent",
      optics: "transparent", struct: "plain", split: true,
      hue: "#d8641c", deep: "#63250a", lite: "#ffb277" },
    { heb: "shevo",    strongs: "H7618", tribe: "Naphtali", meaning: "Wrestling",
      lxx: "achates",     vulg: "achates",     kjv: "Agate",     nasb: "Agate",
      note: 'Strong\'s gives NO identification — only "meaning to flame; a gem"',
      trad: "Agate", ctx: "Traditionally a beautifully banded, multi-coloured stone.",
      mineral: "quartz (chalcedony)", ri: 1.55, luster: "vitreous", diaph: "translucent",
      optics: "translucent", struct: "banded", split: false,
      bands: ["#f3e3c8","#8a6a45","#d8c19a","#5e452c","#e8d3ae","#a07f55"],
      hue: "#b08d63", deep: "#4a3524", lite: "#f0dcc0" },
    { heb: "achlamah", strongs: "H306",  tribe: "Gad",      meaning: "Troop",
      lxx: "amethystos",  vulg: "amethystus",  kjv: "Amethyst",  nasb: "Amethyst",
      note: '"perhaps ... DREAM STONE; a gem, PROBABLY the amethyst"',
      trad: "Amethyst", ctx: "A highly prized, deep purple gemstone.",
      mineral: "quartz", ri: 1.55, luster: "vitreous", diaph: "transparent",
      optics: "transparent", struct: "plain", split: false,
      hue: "#7c46c9", deep: "#33165e", lite: "#c9a8ff" },
    { heb: "tarshish", strongs: "H8658", tribe: "Asher",    meaning: "Happy",
      lxx: "chrysolithos", vulg: "chrysolithus", kjv: "Beryl",   nasb: "Beryl",
      note: '"a gem, PERHAPS THE TOPAZ" — KJV prints beryl; LXX and Vulgate read chrysolite',
      trad: "Beryl / Chrysolite", ctx: "Traditionally a sea-green or golden-yellow stone.",
      mineral: "beryl", ri: 1.58, luster: "vitreous-resinous", diaph: "transparent",
      optics: "transparent", struct: "plain", split: true,
      hue: "#2f9e8f", deep: "#0a3b34", lite: "#8ff0e0" },
    { heb: "shoham",   strongs: "H7718", tribe: "Joseph",   meaning: "Adding",
      lxx: "beryllion",   vulg: "onychinus",   kjv: "Onyx",      nasb: "Onyx",
      note: '"PROBABLY THE BERYL (from its pale green colour)" — KJV prints onyx',
      trad: "Onyx", ctx: "Two larger shoham stones were also engraved and mounted on the ephod’s shoulders (Ex 28:9-12).",
      mineral: "quartz (chalcedony)", ri: 1.55, luster: "vitreous", diaph: "opaque",
      optics: "opaque", struct: "banded", split: true,
      hue: "#4a4744", deep: "#0e0d0c", lite: "#c9c4bd" },
    { heb: "yashpeh",  strongs: "H3471", tribe: "Benjamin", meaning: "Son of Right Hand",
      lxx: "onychion",    vulg: "beryllus",    kjv: "Jasper",    nasb: "Jasper",
      note: '"SUPPOSED TO BE jasper (from the RESEMBLANCE IN NAME)" — the weakest reason of all twelve',
      trad: "Jasper", ctx: "Traditionally a highly polished, precious green jasper.",
      mineral: "quartz (chalcedony)", ri: 1.55, luster: "vitreous", diaph: "opaque",
      optics: "opaque", struct: "mottled", split: true,
      hue: "#3f7d4a", deep: "#16301c", lite: "#93c9a0" }
  ];


  // ---- A STONE IS A SHAPE, NOT A SQUARE ------------------------------------
  // First pass drew rounded squares with gradients on them. That is a button.
  // Real geometry now: an octagonal CUT with individually shaded crown facets
  // for the transparent stones, and a domed CABOCHON for the translucent and
  // opaque ones. Drawn in SVG so the silhouette, the girdle and the facet
  // edges are actual geometry instead of CSS box tricks.
  //
  // Ex 28:20 MESHUBBATSIM ZAHAV ("set in gold filigree") and 28:21
  // PITTUCHEI CHOTAM ("engravings of a signet") are TEXT, read in the pointed
  // Hebrew, bib/tan/exo028.md -- so every stone sits in a gold bezel with
  // prongs and carries an engraved name.
  // Optical constants now come from webmineral + Handbook of Mineralogy (see
  // the data header). ! ASSUMPTION - Claude: which stones are cut vs domed,
  // the facet counts, the angles and the mapping from refractive index to
  // pixels are still MY art direction. A drawing, not a gemmological claim.
  const octagon = (r, cx = 50, cy = 50) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI / 180) * (22.5 + 45 * i);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
  const pts = (arr) => arr.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

  const Stone = ({ s, i = 0 }) => {
    const uid = s.heb;
    // facet contrast and highlight sharpness scale with the MEASURED refractive
    // index: quartz 1.55 -> diamond 2.42. Sourced, see header.
    const bril = Math.min(1, Math.max(0, ((s.ri || 1.55) - 1.5) / 0.95));
    const adamantine = (s.luster || '').startsWith('adamantine');
    const waxy = (s.luster || '').includes('waxy');
    const fire = s.mineral === 'diamond';
    // ! ASSUMPTION - Claude: highlight placement varies per stone so the twelve
    // ! are not stamped with one identical blob. Values are art direction.
    const hl = [
      { x: 37, y: 30, rx: 9,   ry: 5.5, rot: -22 }, { x: 41, y: 27, rx: 7.5, ry: 4.4, rot: 14 },
      { x: 34, y: 33, rx: 10,  ry: 4.8, rot: -38 }, { x: 39, y: 25, rx: 6.8, ry: 5.2, rot: 30 },
      { x: 43, y: 32, rx: 8.4, ry: 4.2, rot: -8  }, { x: 33, y: 28, rx: 7.2, ry: 6.0, rot: 46 },
      { x: 45, y: 29, rx: 9.6, ry: 4.0, rot: -30 }, { x: 36, y: 35, rx: 6.4, ry: 5.6, rot: 8  },
      { x: 40, y: 31, rx: 8.8, ry: 4.6, rot: -46 }, { x: 31, y: 30, rx: 7.8, ry: 5.0, rot: 22 },
      { x: 44, y: 34, rx: 6.6, ry: 4.4, rot: -14 }, { x: 38, y: 27, rx: 9.2, ry: 5.8, rot: 38 }
    ][i % 12];
    const cut = s.optics === 'transparent';          // faceted cut
    const outer = octagon(41);
    const table = octagon(19);
    const girdle = octagon(41);

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full block" aria-hidden="true">
        <defs>
          <clipPath id={`clip-${uid}`}>
            {cut ? <polygon points={pts(outer)} /> : <ellipse cx="50" cy="50" rx="41" ry="38" />}
          </clipPath>
          <radialGradient id={`dome-${uid}`} cx="36%" cy="28%" r="78%">
            <stop offset="0%"  stopColor={s.optics === 'opaque' ? s.lite : '#ffffff'}
                  stopOpacity={s.optics === 'opaque' ? '.55' : '.95'} />
            <stop offset="26%" stopColor={s.lite} stopOpacity={s.optics === 'opaque' ? '.5' : '.95'} />
            <stop offset="62%" stopColor={s.hue} />
            <stop offset="100%" stopColor={s.deep} />
          </radialGradient>
          <linearGradient id={`gold-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#f8e08e" />
            <stop offset="38%"  stopColor="#c79a33" />
            <stop offset="64%"  stopColor="#7c5c14" />
            <stop offset="100%" stopColor="#f0cf72" />
          </linearGradient>
        </defs>

        {/* GOLD BEZEL -- the stone is SET, per Ex 28:20 */}
        {cut
          ? <polygon points={pts(octagon(47))} fill={`url(#gold-${uid})`} />
          : <ellipse cx="50" cy="50" rx="47" ry="44" fill={`url(#gold-${uid})`} />}
        {cut
          ? <polygon points={pts(octagon(43.5))} fill="#241a06" opacity=".85" />
          : <ellipse cx="50" cy="50" rx="43.5" ry="40.5" fill="#241a06" opacity=".85" />}

        <g clipPath={`url(#clip-${uid})`}>
          {/* body */}
          <rect x="0" y="0" width="100" height="100" fill={`url(#dome-${uid})`} />

          {/* CROWN FACETS -- separate planes, hard edges, each lit differently */}
          {cut && outer.map((p0, i) => {
            const p1 = outer[(i + 1) % 8], t0 = table[i], t1 = table[(i + 1) % 8];
            const base = [0.42, 0.20, 0.10, 0.16, 0.34, 0.55, 0.62, 0.55][i];
            const lit = Math.min(0.95, base * (0.55 + 1.15 * bril));
            return (
              <polygon key={i} points={pts([p0, p1, t1, t0])}
                       fill={i < 4 ? s.lite : s.deep} opacity={lit}
                       stroke={s.lite} strokeOpacity=".28" strokeWidth=".5" />
            );
          })}
          {/* TABLE -- the flat top the name is cut into */}
          {cut && <polygon points={pts(table)} fill={s.hue} opacity=".55"
                           stroke={s.lite} strokeOpacity=".45" strokeWidth=".6" />}

          {/* BANDING -- agate, onyx: irregular layers, varied width */}
          {s.struct === 'banded' && (
            <g opacity=".82">
              {[6, 16, 25, 35, 44, 54, 63, 73, 82, 91].map((y, k) => {
                const cols = s.bands || [s.lite, s.deep];
                const h = [6, 4, 8, 5, 7, 4, 9, 5, 6, 7][k];
                const a = [5, 3, 6, 4, 7, 3, 5, 4, 6, 4][k];
                const d = `M -25,${y} C 5,${y - a} 35,${y + a} 62,${y - a * 0.5}`
                        + ` S 105,${y + a} 125,${y}`
                        + ` L 125,${y + h} C 95,${y + h + a} 55,${y + h - a} 28,${y + h + a * 0.5}`
                        + ` S -5,${y + h - a} -25,${y + h} Z`;
                return <path key={k} d={d} fill={cols[k % cols.length]}
                             opacity={[.85,.6,.9,.55,.8,.65,.9,.5,.75,.8][k]} />;
              })}
            </g>
          )}

          {/* INCLUSIONS -- emerald's jardin */}
          {s.struct === 'included' && (
            <g opacity=".6" fill={s.deep}>
              <ellipse cx="62" cy="38" rx="6" ry="3.4" transform="rotate(24 62 38)" />
              <ellipse cx="35" cy="63" rx="4" ry="2.2" transform="rotate(-38 35 63)" />
              <path d="M22,58 L46,40 L48,43 L25,61 Z" opacity=".5" />
            </g>
          )}
          {/* MOTTLING -- jasper is impure and patchy */}
          {s.struct === 'mottled' && (
            <g opacity=".55">
              <ellipse cx="33" cy="36" rx="19" ry="13" fill={s.deep} transform="rotate(-20 33 36)" />
              <ellipse cx="68" cy="62" rx="16" ry="19" fill={s.lite} opacity=".4" />
              <ellipse cx="58" cy="27" rx="12" ry="9" fill={s.deep} opacity=".7" />
              <ellipse cx="40" cy="76" rx="14" ry="8" fill={s.deep} opacity=".5" />
            </g>
          )}

          {/* DISPERSION -- Handbook of Mineralogy: diamond "Dispersion: Strong",
              n 2.4354 (486nm) to 2.4076 (687nm). Only diamond gets spectral fire. */}
          {fire && (
            <g opacity=".9">
              {[[12,'#7fb3ff'],[47,'#8affd8'],[96,'#ffe98a'],[143,'#ff9ec4'],
                [198,'#9fd4ff'],[243,'#c9ff9f'],[295,'#ffd08a'],[331,'#ffa6d6']].map(([deg, c], k) => {
                const a = (Math.PI / 180) * deg, w = (Math.PI / 180) * 5;
                const r1 = 13, r2 = 40;
                const q = [
                  [50 + r1 * Math.cos(a - w),       50 + r1 * Math.sin(a - w)],
                  [50 + r2 * Math.cos(a - w * 0.5), 50 + r2 * Math.sin(a - w * 0.5)],
                  [50 + r2 * Math.cos(a + w * 0.5), 50 + r2 * Math.sin(a + w * 0.5)],
                  [50 + r1 * Math.cos(a + w),       50 + r1 * Math.sin(a + w)]
                ];
                return <polygon key={k} points={pts(q)} fill={c}
                                opacity={[.6,.42,.66,.48,.55,.38,.6,.44][k]} />;
              })}
            </g>
          )}

          {/* pavilion darkening -- depth below the girdle */}
          <ellipse cx="50" cy="86" rx="46" ry="26" fill={s.deep} opacity=".55" />

          {/* specular: tight + bright on cut stones, broad + dull on opaque */}
          {s.optics === 'opaque'
            ? <ellipse cx={hl.x + 2} cy={hl.y + 3} rx={hl.rx * 1.5} ry={hl.ry * 1.5}
                       fill="#fff" opacity=".14" transform={`rotate(${hl.rot} ${hl.x} ${hl.y})`} />
            : <>
                <ellipse cx={hl.x} cy={hl.y}
                         rx={hl.rx * (waxy ? 2.1 : adamantine ? 0.75 : 1)}
                         ry={hl.ry * (waxy ? 2.1 : adamantine ? 0.75 : 1)}
                         fill="#fff"
                         opacity={waxy ? '.13' : adamantine ? '.95' : (0.45 + 0.4 * bril).toFixed(2)}
                         transform={`rotate(${hl.rot} ${hl.x} ${hl.y})`} />
                {s.optics === 'transparent' &&
                  <circle cx={hl.x + 5} cy={hl.y - 4} r="1.9" fill="#fff" opacity=".95" />}
              </>}
        </g>

        {/* GIRDLE -- the bright rim where crown meets pavilion */}
        {cut
          ? <polygon points={pts(girdle)} fill="none" stroke={s.lite} strokeOpacity=".55" strokeWidth="1.1" />
          : <ellipse cx="50" cy="50" rx="41" ry="38" fill="none" stroke={s.lite} strokeOpacity=".4" strokeWidth="1.1" />}

        {/* the witnesses disagree -- marked ON the setting, not floating beside it */}
        {s.split && (
          <g>
            <circle cx="83" cy="17" r="5.2" fill="#1a1206" stroke="#ffd76a" strokeWidth="1.3" />
            <text x="83" y="20.4" textAnchor="middle" fontSize="8" fontWeight="bold"
                  fill="#ffd76a" fontFamily="Georgia, serif">?</text>
          </g>
        )}

        {/* PRONGS holding the stone */}
        {[[50,7],[93,50],[50,93],[7,50]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4.6" fill={`url(#gold-${uid})`} stroke="#5c440f" strokeWidth=".5" />
        ))}
      </svg>
    );
  };


  // ---- WHAT THE HEBREW TEXT NAMES IN THE SKY -------------------------------
  // Every celestial PROPER NAME in the Hebrew Bible, read from the pointed
  // Hebrew in docs/scribe-texts/bib/tan/. FOUR names - but four names is not
  // the whole of what the text says about the sky. The lights are set for
  // signs and appointed times [Gen 1:14], the host is led out by number and
  // called by name [Isa 40:26; Ps 147:4], and Job 38:33 calls the whole
  // arrangement "the ordinances of the heavens". Job names the four as things
  // God alone made and governs; 2 Kings names the mazzalot among things
  // Israel was forbidden to burn incense to. An ordered, lawlike sky whose
  // order serves its Maker - no myth narrated, no fate read out of it.
  // REWRITTEN 2026-08-06: an earlier version of this note treated "four
  // names, no story" as the whole picture, which under-stated the order the
  // text itself asserts. Full case: docs/MAZZAROTH.md.
  // ! ASSUMPTION - Claude: the English identifications (Pleiades, Orion, Bear)
  // kesil/fool: VERIFIED 2026-07-27 by consonantal search of all of bib/tan/ --
  // 75 lines contain כסיל, concentrated in Proverbs and Ecclesiastes, and the
  // NASB renders those "fool" (Prov 26:4, 26:11, 17:10; Eccl 2:14 checked).
  // That the STAR-NAME is the same word remains unstated by the text.
  // ! ASSUMPTION - Claude: the English identifications (Pleiades, Orion, Bear)
  // ! are the TRANSLATORS' readings, not the text's. The little star-patterns
  // ! drawn below follow those conventional identifications and are my art.

  // ---- THE ACTUAL SKY -------------------------------------------------------
  // Real star positions, not a diagram. HYG Database v4.1 (astronexus/HYG-
  // Database), filtered to naked-eye magnitude <= 5.2, with the catalogue's
  // Sol entry removed -- it carries a placeholder position of RA 0 / Dec 0 and
  // magnitude -26.7, which rendered as a disc in the corner of the sky.
  // Each record is [ra(hours), dec(deg), mag, group, colourIndex, proper, con].
  //   group 1 = a star lying in one of the twelve zodiacal constellations
  //             (Ari Tau Gem Cnc Leo Vir Lib Sco Sgr Cap Aqr Psc) -- the circle
  //             Josephus called the one "the Greeks call the Zodiac".
  //   group 2 = Orion, Ursa Major, and the seven named Pleiades -- the objects
  //             the HEBREW text actually names (Kesil, Ash/Ayish, Kimah).
  // Star colour comes from the catalogue's colour index; size and opacity from
  // magnitude. Nothing here is drawn by hand.
  // ! ASSUMPTION - Claude: equirectangular projection, and the highlight
  // ! palette (gold for the zodiacal band, blue for the Hebrew-named) are my
  // ! presentation choices. The positions and magnitudes are catalogue data.
  const starColour = (ci) =>
    ci < -0.05 ? '#cfe0ff' : ci < 0.30 ? '#ffffff' : ci < 0.60 ? '#fff6e0'
    : ci < 1.00 ? '#ffe2b0' : '#ffc48a';

  const SkyMap = () => {
    const W = 960, H = 480;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block rounded-lg" role="img"
           aria-label="Star map showing the zodiacal constellations and the objects named in the Hebrew Bible">
        <defs>
          <radialGradient id="skybg" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#0b1226" /><stop offset="100%" stopColor="#03050d" />
          </radialGradient>
          <filter id="glowBlue" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowGold" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#skybg)" />

        {/* the ecliptic band, where the twelve sit */}
        {/* the ecliptic -- extended past both edges so no stroke cap shows */}
        <path d={Array.from({length: 105}, (_, k) => {
                  const ra = -1 + k * 0.25;
                  const dec = 23.44 * Math.sin((ra / 24) * 2 * Math.PI);
                  return `${k ? 'L' : 'M'}${(ra / 24 * W).toFixed(1)},${((90 - dec) / 180 * H).toFixed(1)}`;
                }).join(' ')}
              fill="none" stroke="#ffd76a" strokeOpacity=".055" strokeWidth="34" strokeLinecap="butt" />

        {STARS.map((st, i) => {
          const [ra, dec, mag, grp, ci] = st;
          const x = ra / 24 * W, y = (90 - dec) / 180 * H;
          const base = Math.max(0.4, (5.6 - mag) * 0.62);
          const op = Math.min(1, Math.max(0.22, (5.6 - mag) / 4.6));
          if (grp === 2) return (
            <g key={i}>
              <circle cx={x} cy={y} r={base * 2.6} fill="#5aa8ff" opacity={op * 0.30} filter="url(#glowBlue)" />
              <circle cx={x} cy={y} r={base * 1.35} fill="#dbeaff" opacity={Math.min(1, op * 1.5)} />
            </g>
          );
          if (grp === 1) return (
            <g key={i}>
              <circle cx={x} cy={y} r={base * 1.9} fill="#ffd76a" opacity={op * 0.42} filter="url(#glowGold)" />
              <circle cx={x} cy={y} r={base * 1.15} fill="#fff3cf" opacity={Math.min(1, op * 1.45)} />
            </g>
          );
          return <circle key={i} cx={x} cy={y} r={base} fill={starColour(ci)} opacity={op * 0.72} />;
        })}
      </svg>
    );
  };


  // A crop of the SAME catalogue used by the big map -- centred on each object's
  // real position (centres computed from the data, not typed by hand). No
  // hand-placed dots anywhere on this page.
  const SkyCrop = ({ view }) => {
    if (!view) return (
      <svg viewBox="0 0 60 60" className="w-16 h-16 shrink-0" aria-hidden="true">
        <rect width="60" height="60" fill="#05070f" rx="4" />
        <text x="30" y="36" textAnchor="middle" fontSize="20" fill="#4a5568">?</text>
      </svg>
    );
    const halfDec = view.span / 2;
    const halfRa  = (view.span / 2) / 15 / Math.max(0.2, Math.cos(view.dec * Math.PI / 180));
    const inView = STARS.filter(([ra, dec]) =>
      Math.abs(dec - view.dec) <= halfDec &&
      Math.abs(((ra - view.ra + 36) % 24) - 12) <= halfRa);
    return (
      <svg viewBox="0 0 60 60" className="w-16 h-16 shrink-0" aria-hidden="true">
        <rect width="60" height="60" fill="#05070f" rx="4" />
        {inView.map(([ra, dec, mag, grp, ci], k) => {
          const dRa = ((ra - view.ra + 36) % 24) - 12;
          const x = 30 - (dRa / halfRa) * 28;
          const y = 30 - ((dec - view.dec) / halfDec) * 28;
          const r = Math.max(0.5, (5.6 - mag) * 0.42);
          const op = Math.min(1, Math.max(0.3, (5.6 - mag) / 4.6));
          return grp === 2
            ? <g key={k}>
                <circle cx={x} cy={y} r={r * 2.2} fill="#5aa8ff" opacity={op * 0.35} />
                <circle cx={x} cy={y} r={r} fill="#dbeaff" opacity={Math.min(1, op * 1.5)} />
              </g>
            : <circle key={k} cx={x} cy={y} r={r * 0.8} fill={starColour(ci)} opacity={op * 0.5} />;
        })}
      </svg>
    );
  };

  const heavenNames = [
    { heb: "כִּימָה", tr: "Kimah", eng: "rendered Pleiades",
      where: "Job 9:9 · Job 38:31 · Amos 5:8",
      says: "Job 38:31 asks whether you can bind its ma'adannot — its bonds or chains. Amos names it among what the LORD made.",
      view: { ra: 3.781, dec: 24.17, span: 1.6 } },
    { heb: "כְּסִיל", tr: "Kesil", eng: "rendered Orion",
      where: "Job 9:9 · Job 38:31 · Amos 5:8",
      says: "The same verse asks whether you can loose its moshkhot — its cords. The same consonants spell kesil, 'fool' — 75 occurrences across the Tanakh, almost all of them in Proverbs and Ecclesiastes. Whether the star-name is that same word, the text never says.",
      view: { ra: 5.492, dec: -0.48, span: 22 } },
    { heb: "עָשׁ / עַיִשׁ", tr: "Ash / Ayish", eng: "rendered the Bear",
      where: "Job 9:9 (עָשׁ) · Job 38:32 (עַיִשׁ)",
      says: "Job 38:32 speaks of guiding Ayish al-baneha — with her sons. Two spellings, one apparent referent.",
      view: { ra: 11.243, dec: 52.96, span: 46 } },
    { heb: "מַזָּרוֹת", tr: "Mazzarot", eng: "read as the zodiacal band",
      where: "Job 38:32 — ONCE, in the whole Hebrew Bible (mazzalot, 2 Kings 23:5, is the related word)",
      says: "A hapax legomenon: it occurs exactly one time. The verse asks whether you can bring it out in its season — a named grouping led out on schedule, which is why the traditional reading is the zodiacal band, month by month. Job itself never numbers it; twelve is not stated. The count comes from the wider order the sources document, not from this verse.",
      view: null },
  ];

  const garmentData = [
    {
      part: "The Ephod (אֵפוֹד)",
      detail: "Gold was hammered into sheets and cut into threads, then woven in with the violet, purple and scarlet and the fine linen (Ex 39:3). On the shoulder pieces sat two onyx stones in gold filigree, six tribal names cut into each like a signet, carried as stones of memorial (Ex 28:9-12). Josephus, writing in Greek in the first century, saw the same thing: two sardonyxes clasping the shoulders, the names of Jacob&rsquo;s sons engraved six to a stone &mdash; and he adds, in his own words, that they were cut <em>in our native letters, in our own tongue</em>, with the elder names on the right shoulder.",
      scripture: "Exodus 28:6-14",
      historicalNote: "TEXT: Ex 28:6-14, 28:9-12, 39:3, read in the Hebrew. WITNESS: Josephus, Antiquities 3.165-166, read in Greek (Niese 1892). The claim that the term 'ephod' became shorthand for seeking God's will is not sourced here.",
      witness: "TEXT + 1st-century Jewish witness"
    },
    {
      part: "The Hoshen (חֹשֶׁן) — Breastplate of Judgment",
      detail: "Square and folded double, a span each way &mdash; a pouch, not a plaque (Ex 28:15-16). Twelve stones in four rows of three, set in gold filigree, each cut with a tribal name like the engraving of a seal (Ex 28:17-21). Josephus calls it the <em>essen</em>, and says the Greeks would call it an oracle; he describes the twelve as surpassing in size and beauty, an adornment no man could purchase for the excess of their worth. And of the twelve he says more: whether they be understood as the months, or as the like number of the signs of that circle <em>which the Greeks call the Zodiac</em>, &ldquo;we shall not miss from the right meaning&rdquo; &mdash; and Philo reads the four rows of three as the four seasons. The covenant&rsquo;s twelve, worn over the heart in the arrangement of the heavens&rsquo; twelve: carried, never consulted (the HEAVENS tab traces that order). Into the fold went the Urim and the Thummim, over the heart, whenever Aaron went in before the LORD (Ex 28:30).",
      scripture: "Exodus 28:15-30",
      historicalNote: "The Urim and Thummim appear seven times in the whole Hebrew Bible — Ex 28:30, Lev 8:8, Num 27:21, Deut 33:8, 1 Sam 28:6, Ezra 2:63, Neh 7:65 — and NOT ONCE does any text describe what they looked like. No material, no shape, no number. That silence is the honest state of the evidence. Later tradition (Talmud, Yoma) holds they were inquired of only when the high priest wore all eight garments, and only for the king, the head of the court, or one whom the public had need of. WITNESS for the celestial reading: Josephus, Antiquities 3.186; Philo, Life of Moses 2.124-126. The correspondence they witness is twelve-to-twelve and rows-to-seasons — no stone-to-sign assignment is claimed for these twelve, whose identifications remain unsettled (see each stone's record above). Full case: docs/MAZZAROTH.md.",
      witness: "TEXT + 1st-century Jewish witness + later rabbinic tradition"
    },
    {
      part: "The Robe of the Ephod (מְעִיל)",
      detail: "A robe of blue worn under the ephod, its hem ringed with golden bells and pomegranates alternating (Ex 28:31-34). Josephus read the pair as a sign of the storm: the bells for thunder, the pomegranates for lightning.",
      scripture: "Exodus 28:31-35",
      historicalNote: "The reason for the bells is given by Scripture itself, not by later commentary — Ex 28:35: the sound is heard when he enters and leaves the Holy Place before the LORD, so that he will not die. (An earlier version of this page attributed that line to the Talmud. It is Exodus.)",
      witness: "TEXT + 1st-century Jewish witness"
    },
    {
      part: "The Golden Plate — Tzitz (צִיץ)",
      detail: "A plate of pure gold engraved like a signet with <span dir='rtl'>קֹדֶשׁ לַיהוָה</span> &mdash; Holy to the LORD (Ex 28:36). It sat on Aaron&rsquo;s forehead so that he would bear the guilt of the holy things Israel consecrated, and the gifts be accepted (Ex 28:38). Josephus describes a golden crown bearing the sacred name, and remarks that it consists of four vowels.",
      scripture: "Exodus 28:36-38",
      historicalNote: "TEXT: Ex 28:36-38, read in the Hebrew. WITNESS: Josephus, Jewish War 5. The comparison to Egyptian and Mesopotamian forehead ornaments that stood here before is not sourced and has been removed.",
      witness: "TEXT + 1st-century Jewish witness"
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
          {['sanctuary', 'elements', 'garments', 'heavens', 'archaeology'].map(tab => (
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
                  {breastplateStones.map((stone, i) => {
                    const open = openStone === i;
                    return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setOpenStone(open ? null : i)}
                      aria-label={`${stone.tribe} \u2014 ${stone.heb}`}
                      aria-pressed={open}
                      className={`aspect-square group relative transition-transform hover:scale-110 focus:outline-none ${open ? 'scale-110' : ''}`}
                      style={{ filter: `drop-shadow(0 3px 5px rgba(0,0,0,.65)) drop-shadow(0 0 7px ${stone.hue}55)` }}
                    >
                      <span className="block w-full h-full relative">
                        <Stone s={stone} i={i} />

                        {/* the ENGRAVED name -- cut into the stone face */}
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[7px] font-bold uppercase tracking-wide"
                                style={{ color: 'rgba(0,0,0,.5)', textShadow: `0 .5px 0 ${stone.lite}aa, 0 -.5px 1px rgba(0,0,0,.55)` }}>
                            {stone.tribe}
                          </span>
                        </span>


                        {/* HOVER -- Hebrew first */}
                        <span className="absolute inset-0 rounded-full bg-black/88 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center backdrop-blur-sm">
                          <span className="text-[10px] text-gold-300 font-bold italic leading-tight">{stone.heb}</span>
                          <span className="text-[6px] text-stone-300 mt-0.5 leading-tight">LXX {stone.lxx}</span>
                          <span className="text-[6px] text-stone-400 leading-tight">KJV {stone.kjv} · NASB {stone.nasb}</span>
                          <span className="text-[6px] text-amber-300/80 mt-0.5">click</span>
                        </span>
                      </span>
                    </button>
                    );
                  })}
                </div>

                {/* CLICKED STONE -- the full record */}
                {openStone !== null && (() => {
                  const s = breastplateStones[openStone];
                  return (
                    <div className="mt-4 bg-stone-950/80 border border-gold-400/40 rounded-lg p-4 text-left relative">
                      <button type="button" onClick={() => setOpenStone(null)}
                              className="absolute top-2 right-3 text-stone-400 hover:text-gold-300 text-sm" aria-label="close">&times;</button>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-gold-300 font-bold text-lg italic">{s.heb}</span>
                        <span className="text-stone-400 text-xs">{s.strongs}</span>
                        <span className="text-stone-300 text-xs">— {s.tribe}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[11px] text-stone-300">
                        <div><span className="text-stone-500">Septuagint</span> {s.lxx}</div>
                        <div><span className="text-stone-500">Vulgate</span> {s.vulg}</div>
                        <div><span className="text-stone-500">KJV</span> {s.kjv}</div>
                        <div><span className="text-stone-500">NASB</span> {s.nasb}</div>
                      </div>
                      <p className="text-[12px] text-gold-200 mt-3">{s.trad}</p>
                      <p className="text-[10px] text-stone-500 mt-1">
                        drawn as {s.mineral} — refractive index {s.ri}, {s.luster} lustre, {s.diaph}
                        <span className="text-stone-600"> (webmineral + Handbook of Mineralogy)</span>
                      </p>
                      <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">{s.ctx}</p>
                      <p className="text-[11px] text-amber-200/80 mt-3 leading-relaxed italic">{s.note}</p>
                      {s.split && (
                        <p className="text-[10px] text-amber-300/90 mt-2">
                          The ancient witnesses do not agree on this stone. What you see is our drawing of the
                          best-attested reading — not a settled identification.
                        </p>
                      )}
                      <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
                        Tribe order follows Pseudo-Philo, not Exodus — Ex 28:21 and 39:14 say twelve stones bore
                        twelve names, but neither verse says which tribe went on which stone. The meaning given for
                        the tribe name is unsourced.
                      </p>
                    </div>
                  );
                })()}

                <p className="text-center text-stone-500 text-[10px] mt-4 italic">
                  Hover a stone for its Hebrew name; click it for every witness. A gold dot marks the stones the
                  ancient sources disagree about.
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
                    {g.witness && (
                      <div className="mb-2">
                        <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded px-2 py-0.5">
                          {g.witness}
                        </span>
                      </div>
                    )}
                    <div className="bg-stone-100 p-3 rounded text-xs text-stone-600 border-l-2 border-stone-400">
                      <strong className="text-stone-700">Where this comes from:</strong> {g.historicalNote}
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
          {activeView === 'heavens' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-cinzel text-amber-800 text-2xl mb-2 uppercase tracking-[0.2em]">What They Knew of the Stars</h2>
                <p className="text-sm text-stone-600 italic max-w-2xl mx-auto">
                  Four proper names &mdash; and behind them an ordered system: lights set for signs and appointed times, a host led out by number and called by name, kept under what Job calls <em>the ordinances of the heavens</em>. Ordered, lawlike, angelically administered &mdash; and never worshiped.
                </p>
              </div>

              <div className="bg-stone-950 rounded-xl p-4 md:p-6 shadow-2xl">
                <SkyMap />
                <div className="flex flex-wrap justify-center gap-4 mt-3 mb-5 text-[11px]">
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#dbeaff] shadow-[0_0_7px_3px_rgba(90,168,255,.75)]" />
                    named in the Hebrew text — Kimah, Kesil, Ash
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-300">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#fff3cf] shadow-[0_0_6px_2px_rgba(255,215,106,.7)]" />
                    the twelve zodiacal constellations
                  </span>
                  <span className="text-stone-500">2,072 stars to magnitude 5.2 · HYG Database v4.1 · real positions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {heavenNames.map((h, i) => (
                    <div key={i} className="bg-black/40 border border-gold-400/25 rounded-lg p-4 flex gap-4">
                      <SkyCrop view={h.view} />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-gold-300 text-lg" dir="rtl">{h.heb}</span>
                          <span className="text-stone-200 text-sm font-bold">{h.tr}</span>
                          <span className="text-stone-500 text-[11px] italic">{h.eng}</span>
                        </div>
                        <p className="text-[11px] text-amber-200/70 mt-1">{h.where}</p>
                        <p className="text-[11px] text-stone-300 mt-2 leading-relaxed">{h.says}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-stone-500 mt-4 text-center italic">
                  The English identifications are the translators&rsquo; readings, not the text&rsquo;s. The star-patterns follow those conventional identifications and are our drawing.
                </p>
              </div>

              <div className="bg-white/70 p-5 rounded-lg border-l-4 border-amber-500 shadow">
                <h3 className="font-cinzel text-amber-900 font-bold mb-2">The question God asks</h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Job 38 does not explain the stars. It asks whether Job can <em>tie</em> the bonds of Kimah or <em>loose</em> the cords of Kesil, bring out Mazzarot in its season, guide Ayish with her sons &mdash; and then, &ldquo;do you know the ordinances of the heavens?&rdquo; Every clause is a question about authorship and control: whose the order is, not what it predicts.
                </p>
                <div className="mt-2"><span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded px-2 py-0.5">TEXT — Job 38:31-33, read in the Hebrew</span></div>
              </div>

              <div className="bg-white/70 p-5 rounded-lg border-l-4 border-red-700/60 shadow">
                <h3 className="font-cinzel text-amber-900 font-bold mb-2">And the line they drew</h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  The related word <em>mazzalot</em> appears once too &mdash; in 2 Kings 23:5, where Josiah does away with the priests who burned incense to Baal, to the sun, to the moon, to the constellations and to all the host of heaven. The dispute was never whether the heavens possessed signs, stations, and ordered behavior &mdash; it was strictly over whom that order served. Named and admired, yes. Consulted, feared, burned to &mdash; never.
                </p>
                <div className="mt-2"><span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded px-2 py-0.5">TEXT — 2 Kings 23:5</span></div>
              </div>

              <div className="bg-stone-100 p-5 rounded-lg border-l-4 border-stone-400 shadow">
                <h3 className="font-cinzel text-stone-800 font-bold mb-2">What later Jewish writers added</h3>
                <p className="text-sm text-stone-700 leading-relaxed mb-2">
                  <strong>Enoch</strong> describes an administered order rather than a myth &mdash; not a machine (that metaphor belongs to a later age) but a law: the sun rising and setting through six portals at either edge of heaven, the whole reckoning shown to Enoch by the angel Uriel &mdash; and a warning that when the chiefs of the stars transgress their prescribed order, men will go astray over them.
                </p>
                <p className="text-sm text-stone-700 leading-relaxed mb-2">
                  <strong>Qumran</strong> kept that order with instruments: 4Q319 reckons signs across a 294-year cycle of jubilees; 4Q320 synchronizes the phases of the moon with the 364-day calendar and the priestly courses; and 4Q318 maps the moon through an explicit twelve-sign zodiac in Jewish Aramaic &mdash; with a thunder-omen text bound to it on the same scroll, a boundary this page does not hide.
                </p>
                <p className="text-sm text-stone-700 leading-relaxed">
                  <strong>Josephus</strong>, describing this very breastplate, wrote that whether the twelve stones are understood as the twelve months or as the twelve signs of the circle <em>which the Greeks call the Zodiac</em>, &ldquo;we shall not miss from the right meaning.&rdquo; The name is Greek; the correspondence he owns. <strong>Philo</strong> says it outright: the twelve stones are the twelve signs, in four rows of three for the seasons.
                </p>
                <div className="mt-2"><span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded px-2 py-0.5">WITNESS — 1 Enoch 72, 80; 4Q318–4Q320; Josephus, Antiquities 3.7.7; Philo, Life of Moses 2.124–126</span></div>
              </div>

              <div className="bg-stone-900 text-parchment-100 p-5 rounded-lg border border-gold-400/30">
                <h3 className="font-cinzel text-gold-400 mb-2">The order, and the boundaries</h3>
                <p className="text-sm leading-relaxed text-stone-300 mb-2">
                  The Hebrew Bible itself lists no twelve signs and reads no narrative out of the sky &mdash; that stands. But the space between Job&rsquo;s four names and the later twelve is not empty: 4Q318 maps the twelve signs in Jewish Aramaic; Josephus and Philo read the breastplate&rsquo;s twelve stones as that circle; the camp of Numbers 2 stood in four divisions whose banners tradition ties to the four fixed signs &mdash; the lion, ox, man, and eagle that guard the throne in Ezekiel 1 and Revelation 4; and Revelation 21 founds the city on twelve stones the old lapidaries assign to the signs, in reverse order &mdash; the fated circuit run backwards, its lamp the Lamb.
                </p>
                <p className="text-sm leading-relaxed text-stone-300">
                  The evidence supports Mazzarot as part of an ancient proto-zodiacal celestial order. It does not prove that Job carried the later standardized zodiac, nor that every Jewish use of the scheme stayed clear of divination &mdash; and the tribe-to-sign banners are tradition, labeled as such. The twelve was never surrendered to paganism; it was reclaimed, de-absolutized, and covenantally renamed. Full case: <span className="text-gold-300">docs/MAZZAROTH.md</span>.
                </p>
              </div>
            </div>
          )}

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
