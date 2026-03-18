import os
import json

# Deep Research Data - Consolidated
BESTIARY_ENTRIES = [
    {
        "id": "michael", "name": "Michael", "hebrew": "מִיכָאֵל", "translation": "Who is like God?", "type": "Angel", "classification": "Archangel", 
        "roles": ["Protector of Israel", "Psychopomp", "Defeater of Satan"],
        "description": "Michael stands as the preeminent warrior among all angels. He is explicitly called 'one of the chief princes' and 'the great prince who stands guard over the sons of your people'.",
        "theology": { "biblical": ["Daniel 10:13, 21", "Jude 1:9", "Revelation 12:7-9"], "extraBiblical": ["1 Enoch 20:5", "War Scroll (1QM)", "Testament of Abraham"] },
        "academicDossier": {
            "scholarlySynthesis": "Scholarly consensus, led by James Davila, views Michael as a Jewish polemic against the high-ranking 'Vizier' deities of Mesopotamia. In the DSS, he is the 'Prince of Light' whose victory is the cosmic anchor for the community's hope.",
            "anthropologicalLinks": ["Zoroastrian Amesha Spenta (Vohu Manah) parallels", "Mesopotamian 'Sar' (Prince) archetypes"],
            "manuscripts": ["1QM (The War Scroll)", "4Q201 (En^a)", "Testament of Abraham"],
            "esotericTraditions": "In Hekhalot literature, Michael is the high priest of the heavenly Tabernacle. Kabbalistic tradition assigns him to the Sefirah of Chesed (Mercy)."
        }
    },
    {
        "id": "gabriel", "name": "Gabriel", "hebrew": "גַּבְרִיאֵל", "translation": "God is my strength", "type": "Angel", "classification": "Archangel",
        "roles": ["Interpreter of Visions", "Herald of Messiah"],
        "description": "Gabriel serves as God's primary herald, entrusted with delivering the most significant announcements in salvation history.",
        "theology": { "biblical": ["Daniel 8:15", "Daniel 9:20", "Luke 1:19, 26"], "extraBiblical": ["1 Enoch 9:1", "1 Enoch 20:7"] },
        "academicDossier": {
            "scholarlySynthesis": "Gabriel evolved from a simple messenger to a complex revealer of eschatological secrets. In the Enochic tradition, he is specifically assigned to 'all the powers' and the serpents.",
            "anthropologicalLinks": ["Mesopotamian messenger god (Nabu) parallels", "Sumerian Gibil (fire/messenger) associations"],
            "manuscripts": ["4Q246 (The 'Son of God' text)", "1 Enoch 10:9"],
            "esotericTraditions": "Kabbalistically associated with the Sefirah of Gevurah (Strength/Severity). In the Solomonic Tradition, he is the ruler of the Moon's sphere."
        }
    },
    {
        "id": "raphael", "name": "Raphael", "hebrew": "רְפָאֵל", "translation": "God heals", "type": "Angel", "classification": "Archangel",
        "roles": ["Binder of Demons", "Guide of Travelers", "Healer"],
        "description": "Raphael embodies God's compassionate care, serving as the celestial physician. In 1 Enoch, he is commissioned to bind Azazel and 'heal the earth'.",
        "theology": { "biblical": ["Tobit 3:17", "Tobit 12:15"], "extraBiblical": ["1 Enoch 10:4", "1 Enoch 20:3", "Jubilees 10:10"] },
        "academicDossier": {
            "scholarlySynthesis": "Emphasized as a 'disguised' divine agent. His command to 'heal the earth' in 1 Enoch is interpreted as a reversal of the biological and spiritual contamination introduced by the Watchers.",
            "anthropologicalLinks": ["Mesopotamian healing deities (Ea/Enki) polemics", "Levantine apotropaic (protective) magic traditions"],
            "manuscripts": ["Book of Tobit", "4Q202 (En^b)", "Jubilees 10"],
            "esotericTraditions": "Known in the Hekhalot as the angel who teaches the secrets of healing and exorcism. Delivered the 'Seal' to Solomon."
        }
    },
    {
        "id": "uriel", "name": "Uriel", "hebrew": "אוּרִיאֵל", "translation": "God is my light", "type": "Angel", "classification: "Archangel",
        "roles": ["Illuminator of Truth", "Overseer of Tartarus", "Guardian of Eden"],
        "description": "Uriel stands as the archangel of divine illumination. He carries the flame of enlightenment and the scroll of knowledge.",
        "theology": { "biblical": ["Genesis 3:24 (Tradition)"], "extraBiblical": ["1 Enoch 20:2", "2 Esdras 4"] },
        "academicDossier": {
            "scholarlySynthesis": "Analyzed as the 'Angel of the Abyss' managing the transition between spheres. In the Book of Luminaries, he is the celestial astronomer.",
            "anthropologicalLinks": ["Solar deity (Shamash) polemics", "Greek Helios/Apollo parallels"],
            "manuscripts": ["1 Enoch 72-82", "2 Esdras (4 Ezra)"],
            "esotericTraditions": "In Gnosticism, associated with the 'repentant' Archon. Regent of the Sun in Hekhalot."
        }
    },
    {
        "id": "sariel", "name": "Sariel", "hebrew": "שַׂרִיאֵל", "translation": "Prince of God", "type": "Angel", "classification": "Archangel",
        "roles": ["Angel of Death", "Teacher of Lunar Courses", "Avenger of Spirits"],
        "description": "Sariel serves as one of the seven archangels, often associated with judgment and the lunar calendar.",
        "theology": { "biblical": [], "extraBiblical": ["1 Enoch 20:6", "1 Enoch 9:1"] },
        "academicDossier": {
            "scholarlySynthesis": "Bridges angelic revealers and agents of punishment. His DSS role emphasizes military and apotropaic (protective) significance.",
            "anthropologicalLinks": ["Lunar deity (Sin) polemics", "Ancient Near Eastern protective spirits (Shedu)"],
            "manuscripts": ["1QM Column 9", "4Q201 (Enoch)"],
            "esotericTraditions: "Hekhalot 'Prince of the Presence' associated with the 'Eye' (divine and evil)."
        }
    },
    {
        "id": "raguel", "name": "Raguel", "hebrew": "רְעוּאֵל", "translation": "Friend of God", "type": "Angel", "classification": "Archangel",
        "roles": ["Angel of Justice", "Overseer of Luminaries"],
        "description": "Raguel holds a unique position as the enforcer of divine order among the angels themselves.",
        "theology": { "biblical": [], "extraBiblical": ["1 Enoch 20:4", "1 Enoch 23:4"] },
        "academicDossier": {
            "scholarlySynthesis": "The 'Cosmic Auditor.' Reflected concern with the regularity of the laws of nature as a sign of divine sovereignty.",
            "anthropologicalLinks": ["ANE concepts of 'Divine Assembly' order", "Social control mechanisms"],
            "manuscripts": ["1 Enoch 20:4", "1 Enoch 23"],
            "esotericTraditions": "Resolves disputes in Solomonic lore. Represents Gevurah in its purest organizational form."
        }
    },
    {
        "id": "remiel", "name": "Remiel", "hebrew": "רְמִיאֵל", "translation": "Thunder of God", "type": "Angel", "classification": "Archangel",
        "roles": ["Angel of Resurrection", "Guide of Souls"],
        "description": "Remiel serves as the archangel of resurrection and hope. He is 'set over those who rise'.",
        "theology": { "biblical": [], "extraBiblical": ["1 Enoch 20:8", "2 Baruch", "2 Esdras 4:36"] },
        "academicDossier": {
            "scholarlySynthesis": "Primary eschatological guide. In 2 Baruch, he manages the timeline of human history and the transition to the world to come.",
            "anthropologicalLinks": ["Near Eastern concepts of 'Souls in Pit' recovery", "Hermes/Psychopomp parallels"],
            "manuscripts": ["2 Esdras 4:36", "2 Baruch 55-74"],
            "esotericTraditions": "Hekhalot angel of 'True Visions' and guardian of the threshold of death."
        }
    },
    {
        "id": "metatron", "name": "Metatron", "hebrew": "מֵטַטְרוֹן", "translation": "Guardian", "type": "Angel", "classification": "High Angel",
        "roles": ["Celestial Scribe", "Voice of God"],
        "description": "Metatron stands as the greatest angel in Jewish mystical tradition, often identified as the divinized patriarch Enoch.",
        "theology": { "biblical": ["Genesis 5:24 (Implied)"], "extraBiblical": ["3 Enoch", "Babylonian Talmud"] },
        "academicDossier": {
            "scholarlySynthesis": "Represents a 'Second God' complex (Lesser YHWH) - a polemic against Babylonian scribal traditions (Enmeduranki).",
            "anthropologicalLinks": ["Sumero-Akkadian scribal god (Nabu) polemics", "Antediluvian king (Enmeduranki) parallels"],
            "manuscripts": ["3 Enoch", "Talmud Hagigah 15a"],
            "esotericTraditions": "Central figure of Merkabah Mysticism. Master of Metatron's Cube."
        }
    },
    {
        "id": "raziel", "name": "Raziel", "hebrew": "רְזִיאֵל", "translation": "Secret of God", "type": "Angel", "classification": "High Angel",
        "roles": ["Keeper of Mysteries", "Teacher of Adam"],
        "description": "Raziel is the angel of mysteries who stands near God's throne recording all divine secrets.",
        "theology": { "biblical": [], "extraBiblical": ["Sefer Raziel HaMalakh", "Zohar"] },
        "academicDossier": {
            "scholarlySynthesis": "Represents the 'Hermetic' side of Jewish tradition. Transmitted original divine wisdom (Prisca Theologia) to Adam.",
            "anthropologicalLinks": ["Thoth/Hermes parallels", "Mesopotamian Sages (Apkallu)"],
            "manuscripts": ["Sefer Raziel HaMalakh", "Zohar Part I, 37b"],
            "esotericTraditions": "In Practical Kabbalah, his Sefer is a powerful protective talisman. Master of Chokhmah."
        }
    },
    {
        "id": "azrael", "name": "Azrael", "hebrew": "עֲזַרְאֵל", "translation": "Whom God Helps", "type": "Angel", "classification": "Angel of Death",
        "roles": ["Psychopomp", "Separator of Soul"],
        "description": "Azrael separates the soul from the body at death, serving with compassion and accuracy.",
        "theology": { "biblical": [], "extraBiblical": ["Jewish Mysticism", "Islamic Tradition"] },
        "academicDossier": {
            "scholarlySynthesis": "Evolved from the generic 'Angel of Death' to a systematized figure synthesizing psychopomp traditions.",
            "anthropologicalLinks": ["Egyptian Anubis parallels", "Greek Charon/Thanatos archetypes"],
            "manuscripts": ["Quran 32:11", "Kabbalistic manuscripts"],
            "esotericTraditions": "Watcher of the Grave. The spirit whom no other spirit can avoid or defeat."
        }
    },
    {
        "id": "lilith", "name": "Lilith", "hebrew": "לִילִית", "translation": "Night Creature / Night Hag", "type": "Demon", "classification": "Demoness / Archetypal Shadow", 
        "roles": ["Mother of Monsters", "Night Terror", "Gnostic Norea (Link)"],
        "description": "A primordial female entity whose trajectory moves from a class of Mesopotamian storm demons to the singular 'First Wife' of Adam.",
        "theology": { "biblical": ["Isaiah 34:14"], "extraBiblical": ["Dead Sea Scrolls 4Q510", "Alphabet of Ben-Sira", "Zohar"] },
        "academicDossier": {
            "scholarlySynthesis": "Scholars like Annette Yoshiko Reed trace Lilith's origins to the Sumero-Akkadian Lilitu storm demons. Anthropologically, she represents a 'theodicy of infant death'.",
            "anthropologicalLinks": ["Mesopotamian Lamashtu/Lilitu", "Levantine 'Child-Stealing Witch' archetypes"],
            "manuscripts": ["4Q510-511 (Songs of the Sage)", "The Hypostasis of the Archons"],
            "esotericTraditions": "In the Solomonic Tradition, she is bound by divine names. Consort of Samael."
        }
    },
    {
        "id": "satan", "name": "Satan / Sammael", "hebrew": "שָׂטָן", "translation": "The Adversary", "type": "Demon", "classification": "Demon Prince",
        "roles": ["Accuser", "Father of Lies", "Ruler of this World"],
        "description": "The supreme mystery of evil. Originally a high-ranking angel who chose rebellion.",
        "theology": { "biblical": ["Job 1-2", "Isaiah 14", "Revelation 12"], "extraBiblical": ["Life of Adam and Eve", "Martyrdom of Isaiah"] },
        "academicDossier": {
            "scholarlySynthesis": "Research by Elaine Pagels emphasizes the development of Satan from an 'adversary' within the divine council to a cosmic personification of evil.",
            "anthropologicalLinks": ["Zoroastrian Ahriman parallels", "Chaos-monster (Tiamat) archetypes"],
            "manuscripts": ["1QM (War Scroll)", "Apocalypse of Abraham"],
            "esotericTraditions": "In the Zohar, he is Sammael, the 'Left Side' of the divine. Solomonic tradition views him as the primary avoidant power."
        }
    },
    {
        "id": "semyaza", "name": "Semyaza", "hebrew": "שֶׁמְחֲזַאי", "translation": "The Name has Seen", "type": "Fallen", "classification": "Fallen Watcher",
        "roles": ["Leader of the 200", "Progenitor of Giants"],
        "description": "Leader of the Watchers who descended on Mount Hermon. He bound his brethren by an oath to corrupt humanity.",
        "theology": { "biblical": ["Genesis 6:1-4 (Implied)"], "extraBiblical": ["1 Enoch 6-10", "Book of Giants"] },
        "academicDossier": {
            "scholarlySynthesis": "Represents the 'human' side of the fall - the desire for the material. George Nickelsburg notes his role as a counter-figure to the high priest.",
            "anthropologicalLinks": ["Mesopotamian Apkallu (Sages) polemics", "Prometheus 'Bringer of Knowledge' parallels"],
            "manuscripts": ["4Q201 (En^a)", "Book of Giants"],
            "esotericTraditions": "Bound to the constellation of Orion, forever hanging between earth and heaven."
        }
    },
    {
        "id": "azazel", "name": "Azazel", "hebrew": "עֲזָאזֵל", "translation": "Scapegoat", "type": "Fallen", "classification": "Fallen Watcher",
        "roles": ["Teacher of Warfare", "Corrupter"],
        "description": "Azazel taught humanity the arts of war and vanity (cosmetics), corrupting the earth thoroughly.",
        "theology": { "biblical": ["Leviticus 16"], "extraBiblical": ["1 Enoch 8:1", "1 Enoch 10:4", "Apocalypse of Abraham"] },
        "academicDossier": {
            "scholarlySynthesis": "Scholars like Devorah Dimant argue Azazel's role in Enoch is a secondary interpolation to explain origin of sin through technology.",
            "anthropologicalLinks": ["Promethean 'Civilization Hero' reversal", "Levantine desert demonology"],
            "manuscripts": ["1 Enoch 8", "4Q180 (Ages of Creation)"],
            "esotericTraditions": "The Scapegoat of Yom Kippur. Master of the Mountain of Darkness."
        }
    }
]

COMBAT_ENEMIES = [
    {
        "id": "nephilim_warrior", "name": "Nephilim Warrior", "type": "Giant", "level": 8, "size": "Large",
        "description": "Offspring of the Watchers and human women, standing 12-15 feet tall.",
        "stats": {"hp": 120, "defense": 26, "speed": 25},
        "actions": [{"name": "Bronze Greatsword", "damageDice": "2d12", "damageBonus": 8}],
        "academicDossier": {
            "scholarlySynthesis": "Ronald Hendel views the Nephilim as a polemic against divinized kings. They represent the monstrous distortion of the divine-human boundary.",
            "anthropologicalLinks": ["Mesopotamian Apkallu hybridity", "Greek Titanomachy parallels"],
            "manuscripts": ["Genesis 6", "1 Enoch 7", "Book of Giants"],
            "esotericTraditions": "The origin of 'unclean spirits' (demons) after their physical death."
        }
    }
]

# Style and HTML Templates
STYLE = """    <style>
        :root {
            --primary: #8B2E3F; --secondary: #4A6FA5; --accent: #C19A6B; --dark: #0c0a09; --light: #F3E9DC;
            --angel: #4A6FA5; --demon: #8B2E3F; --fallen: #6B3FA0; --giant: #8B6914; --human: #5A7247;
            --cave: #6B5B4B; --mighty: #A85B20; --under: #4B6B6B; --archive-bg: #14110f; --archive-border: #3d342d;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: var(--dark);
            background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png'),
                radial-gradient(circle at 20% 50%, rgba(139,46,63,0.04) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(74,111,165,0.04) 0%, transparent 50%);
            color: var(--light); font-family: 'Roboto Condensed', sans-serif; min-height: 100vh;
        }
        .modal-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.92); z-index: 200; align-items: center; justify-content: center; padding: 2rem; }
        .modal-overlay.open { display: flex; }
        .modal-card { background: var(--archive-bg); border: 1px solid var(--archive-border); border-radius: 4px; max-width: 1200px; width: 95%; height: 90vh; display: flex; flex-direction: row; overflow: hidden; box-shadow: 0 0 100px rgba(0,0,0,1); position: relative; }
        #modalContent { display: flex; flex-direction: row; width: 100%; height: 100%; overflow: hidden; }
        .modal-sidebar { width: 400px; min-width: 400px; background: #080706; border-right: 1px solid var(--archive-border); display: flex; flex-direction: column; overflow-y: auto; color: var(--light); }
        .modal-main { flex: 1; padding: 3rem; overflow-y: auto; background-image: radial-gradient(circle at top right, rgba(193,154,107,0.03), transparent); position: relative; background-color: var(--archive-bg); color: var(--light); }
        .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(0,0,0,0.5); border: 1px solid var(--archive-border); color: var(--accent); width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 4px; cursor: pointer; z-index: 100; font-size: 1.5rem; }
        .modal-close:hover { background: var(--accent); color: var(--dark); }
        .modal-art { width: 100%; height: 400px; object-fit: cover; border-bottom: 1px solid var(--archive-border); }
        .scholarly-section { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid rgba(193,154,107,0.1); }
        .scholarly-section h3 { font-family: 'Cinzel', serif; font-size: 1rem; color: var(--accent); text-transform: uppercase; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.8rem; }
        .scholarly-section h3::after { content: ''; flex: 1; height: 1px; background: rgba(193,154,107,0.1); }
        .academic-text { font-size: 1rem; line-height: 1.8; color: rgba(243,233,220,0.8); text-align: justify; }
        .manuscript-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.8rem; margin-top: 0.8rem; }
        .manuscript-item { font-size: 0.8rem; color: var(--secondary); background: rgba(74,111,165,0.05); padding: 0.6rem; border-left: 2px solid var(--secondary); }
        header { background: rgba(26,18,11,0.98); backdrop-filter: blur(12px); padding: 1rem 2rem; border-bottom: 2px solid var(--accent); position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; }
        header h1 { font-family: 'Cinzel', serif; color: var(--accent); font-size: 1.8rem; letter-spacing: 0.15em; }
        header h1 span { color: var(--secondary); font-size: 0.5em; display: block; }
        .filter-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
        .filter-btn { background: rgba(193,154,107,0.1); border: 1px solid rgba(193,154,107,0.3); color: var(--light); padding: 0.4rem 1rem; border-radius: 4px; cursor: pointer; text-transform: uppercase; font-size: 0.75rem; }
        .filter-btn.active { background: var(--accent); color: var(--dark); }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; padding: 2rem; max-width: 1600px; margin: 0 auto; }
        .mtg-card { perspective: 1000px; cursor: pointer; height: 480px; }
        .mtg-card-inner { position: relative; width: 100%; height: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .card-frame { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; border: 3px solid; border-radius: 16px; overflow: hidden; }
        .card-frame[data-type="Angel"]   { border-color: var(--angel); }
        .card-frame[data-type="Demon"]   { border-color: var(--demon); }
        .card-frame[data-type="Fallen"]  { border-color: var(--fallen); }
        .card-frame[data-type="Giant"]   { border-color: var(--giant); }
        .card-frame[data-type="Human"]   { border-color: var(--human); }
        .card-frame[data-type="Cave Dweller"] { border-color: var(--cave); }
        .card-frame[data-type="Mighty One"]   { border-color: var(--mighty); }
        .card-frame[data-type="Under-Walker"] { border-color: var(--under); }
        .card-title-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0.8rem; background: rgba(26,18,11,0.95); border-bottom: 1px solid rgba(193,154,107,0.3); }
        .card-name { font-family: 'Cinzel', serif; font-weight: 700; font-size: 0.95rem; color: var(--accent); }
        .card-art { height: 200px; overflow: hidden; border-bottom: 2px solid rgba(193,154,107,0.4); }
        .card-art img { width: 100%; height: 100%; object-fit: cover; }
        .card-type-line { display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0.8rem; background: rgba(26,18,11,0.9); font-size: 0.7rem; text-transform: uppercase; }
        .card-text-box { flex: 1; padding: 0.6rem 0.8rem; background: rgba(26,18,11,0.92); overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; }
        .card-hebrew { font-size: 1rem; color: var(--accent); text-align: center; }
        .card-description { font-size: 0.75rem; line-height: 1.5; color: rgba(243,233,220,0.85); }
        @media (max-width: 900px) { .modal-card { flex-direction: column; height: 95vh; } .modal-sidebar { width: 100%; min-width: 100%; height: 400px; border-right: none; } }
    </style>
"""

with open("card2.html", "w", encoding="utf-8") as f:
    f.write(f"<!DOCTYPE html>\n<html lang='en'>\n<head>\n<meta charset='UTF-8'><title>Archives</title>\n{STYLE}\n</head>\n")
    f.write("<body>\n<header><h1>Archives</h1><div class='filter-bar'><button class='filter-btn active' data-filter='all'>All</button></div></header>\n")
    f.write("<div class='card-grid' id='cardGrid'></div>\n")
    f.write("<div class='modal-overlay' id='modalOverlay'><div class='modal-card'><button class='modal-close' id='modalClose'>&times;</button><div id='modalContent'></div></div></div>\n")
    f.write("<script>\n")
    f.write(f"const bestiaryData = {{ entries: {json.dumps(BESTIARY_ENTRIES)} }};\n")
    f.write(f"const combatBestiaryData = {{ enemies: {json.dumps(COMBAT_ENEMIES)} }};\n")
    f.write("const creaturesData = { giants: { entries: [] }, corrupted: { entries: [] }, beasts: { entries: [] } };\n")
    f.write("""
function buildCardHTML(card) {
    return `<div class="mtg-card-inner"><div class="card-frame" data-type="${card.type}"><div class="card-title-bar"><span class="card-name">${card.name}</span></div><div class="card-art"><img src="images/rutkowski/${card.type}/${card.id}.png"></div><div class="card-type-line"><span>${card.type}</span></div><div class="card-text-box"><div class="card-hebrew">${card.hebrew || ''}</div><p>${card.description}</p></div></div></div>`;
}
function openModal(card) {
    const overlay = document.getElementById('modalOverlay'); const content = document.getElementById('modalContent');
    content.innerHTML = `<div id="modalContent" style="display:flex; width:100%; height:100%;"><div class="modal-sidebar"><div style="padding:2rem;"><h2>${card.name}</h2></div></div><div class="modal-main"><h3>Synthesis</h3><p>${card.academicDossier ? card.academicDossier.scholarlySynthesis : 'Pending...'}</p></div></div>`;
    overlay.classList.add('open');
}
function renderCards(cards) {
    const grid = document.getElementById('cardGrid'); grid.innerHTML = '';
    cards.forEach(card => {
        const el = document.createElement('div'); el.className = 'mtg-card'; el.innerHTML = buildCardHTML(card);
        el.addEventListener('click', () => openModal(card)); grid.appendChild(el);
    });
}
document.getElementById('modalClose').addEventListener('click', () => document.getElementById('modalOverlay').classList.remove('open'));
renderCards([...bestiaryData.entries, ...combatBestiaryData.enemies]);
</script></body></html>
""")
