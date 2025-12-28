// NEPHILIM WARS - LORE DATABASE
// Add new entries here. Ensure you maintain the comma , between brackets } {

const database = [
    // --- ARCHANGELS ---
    { 
        name: "Michael",
        hebrew: "\u05DE\u05D9\u05DB\u05D0\u05DC (Mikha'el)", 
        type: "angel",
        category: "archangel",
        description: "Prince of Israel, great warrior angel, supreme commander of heavenly hosts.",
        fullDescription: `
            <p><strong>The Name and Its Meaning:</strong> Michael (\u05DE\u05D9\u05DB\u05D0\u05DC) means "Who is like God?" — a rhetorical question asserting that none can compare to YHWH. This name itself functions as a battle cry against the hubris of rebellious celestial beings.</p>
            
            <h3>The Biblical Foundation</h3>
            <p><strong>Daniel 10:13, 21:</strong> During Daniel's three-week fast, a heavenly messenger reveals he was delayed twenty-one days by "the prince of the kingdom of Persia" until "Michael, one of the chief princes" came to help. The messenger adds: "There is none who contends by my side against these except Michael, your prince." This establishes:</p>
            <ul>
                <li>Michael holds the rank of "chief prince" (sar rishon).</li>
                <li>He serves specifically as Israel's guardian.</li>
                <li>He engages in direct combat against territorial spirits (sarim).</li>
            </ul>
            
            <p><strong>Daniel 12:1:</strong> "At that time shall arise Michael, the great prince who has charge of your people." Here his eschatological role emerges: he will "stand up" (ya'amod) at the unprecedented tribulation preceding Israel's deliverance.</p>
            
            <p><strong>Jude 9:</strong> Preserves a tradition about Michael disputing with the devil over Moses' body. He "did not presume to pronounce a blasphemous judgment, but said, 'The Lord rebuke you.'" This demonstrates Michael's humility—even as heaven's commander, he defers ultimate authority to God.</p>
            
            <h3>The Apocalyptic War (Revelation 12:7-9)</h3>
            <p>"Now war arose in heaven, Michael and his angels fighting against the dragon..." John's vision shows Michael commanding heaven's loyal armies in direct warfare against the primordial serpent. This cosmic battle results in Satan's permanent expulsion from the heavenly court.</p>
            
            <h3>The Enochic Tradition</h3>
            <p>The Book of Enoch provides the richest pre-Christian angelology:</p>
            <ul>
                <li><strong>1 Enoch 10:11-15:</strong> God commissions Michael to bind Semyaza and the fallen Watchers for seventy generations. He executes God's decrees rather than his own vengeance.</li>
                <li><strong>1 Enoch 20:5:</strong> Lists Michael's portfolio as "set over the best part of mankind, over chaos." This may indicate his role in maintaining cosmic order.</li>
                <li><strong>1 Enoch 40:9:</strong> Identifies Michael as "the merciful and long-suffering."</li>
            </ul>
            
            <h3>The War Scroll (1QM)</h3>
            <p>The Dead Sea Scrolls envision a forty-year conflict between the "Sons of Light" and "Sons of Darkness." <strong>1QM 17:6-8</strong> states God will send eternal assistance "by the might of the majestic angel of the authority of Michael." He is the "Prince of Light" (Sar ha'Or) leading heavenly forces against Belial.</p>
            
            <h3>Offices and Titles</h3>
            <table style="width:100%; border-collapse: collapse; margin-top:10px; font-size: 0.9em; border: 1px solid #444;">
                <tr style="background: rgba(255,255,255,0.1); border-bottom: 1px solid #78350f;">
                    <th style="padding: 8px; text-align: left;">Title</th>
                    <th style="padding: 8px; text-align: left;">Source</th>
                    <th style="padding: 8px; text-align: left;">Significance</th>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Chief Prince</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Daniel 10:13</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Highest angelic rank</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Prince of Light</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">1QM (War Scroll)</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Leader of righteous hosts</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">The Merciful</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">1 Enoch 40</td>
                    <td style="padding: 8px; border-bottom: 1px solid #444;">Character attribute</td>
                </tr>
            </table>
        `,
        role: "Military Commander, National Guardian of Israel, Advocate, Executor of Judgment.",
        hierarchy: "Chief Archangel, Prince of the Presence, Sar Rishon (Chief Prince).",
        attributes: "Humble before God, fierce against evil, patient ('long-suffering'), bears the sword of divine justice.",
        biblicalReferences: "Daniel 10:13, 21; 12:1; Jude 9; Revelation 12:7-9.",
        extraBiblical: "1 Enoch 9, 10, 20, 40; War Scroll (1QM); Assumption of Moses; Rabbinic tradition (Yoma 37a, Hagigah 12b).",
        sources: ["Daniel", "Revelation", "1 Enoch", "Dead Sea Scrolls (War Scroll)", "Talmud"]
    },
    { 
        name: "Gabriel", 
        hebrew: "\u05D2\u05D1\u05E8\u05D9\u05D0\u05DC (Gavri'el)", 
        type: "angel", 
        category: "archangel", 
        description: "God's messenger, revealer of mysteries, announcer of the Messiah.", 
        fullDescription: "Gabriel is the primary herald of the Almighty, appearing to Daniel to interpret visions and to Mary to announce the birth of Jesus. In 1 Enoch, he is one of the four archangels who look down from heaven at the bloodshed caused by the Watchers.", 
        role: "Messenger, interpreter of visions.", 
        hierarchy: "Stands in the presence of God.", 
        attributes: "Lily (purity), Trumpet (judgment), Scroll.", 
        biblicalReferences: "Daniel 8-9, Luke 1.", 
        extraBiblical: "1 Enoch 9:1 describes him looking down from heaven. 1 Enoch 10:9 commands him to destroy the children of the Watchers (Nephilim).", 
        sources: ["Daniel 8-9", "Luke 1", "1 Enoch 9-10"] 
    },
    { 
        name: "Raphael", 
        hebrew: "\u05E8\u05E4\u05D0\u05DC (Refa'el)", 
        type: "angel", 
        category: "archangel", 
        description: "God heals. Binder of Asmodeus, guide of travelers.", 
        fullDescription: "Raphael is the angel of healing and the binder of demons. In the Book of Tobit, he disguises himself to guide Tobias and binds the demon Asmodeus. In 1 Enoch, God commands him to bind Azazel hand and foot and cast him into the darkness.", 
        role: "Healer, binder of demons, guide.", 
        hierarchy: "One of the seven angels who stand before the Lord.", 
        attributes: "Staff, fish (from Tobit), medicine jar.", 
        biblicalReferences: "Book of Tobit.", 
        extraBiblical: "1 Enoch 10:4 - God commands Raphael to bind Azazel. 1 Enoch 20:3 - Set over the spirits of men.", 
        sources: ["Book of Tobit", "1 Enoch 10", "1 Enoch 20"] 
    },
    { 
        name: "Uriel", 
        hebrew: "\u05D0\u05D5\u05E8\u05D9\u05D0\u05DC (Uri'el)", 
        type: "angel", 
        category: "archangel", 
        description: "Fire of God. Regent of the sun, angel of wisdom and judgment.", 
        fullDescription: "Uriel is the angel of wisdom and light. He stands at the gate of Eden with a fiery sword and oversees the luminaries (stars/sun) and Tartarus (the underworld). He guides Enoch through the cosmos and shows him the prison of the fallen angels.", 
        role: "Guardian, illuminator, teacher of Enoch, overseer of Tartarus.", 
        hierarchy: "One of the four chief angels.", 
        attributes: "Flaming sword, scroll, sun disk.", 
        biblicalReferences: "Non-canonical in Protestant Bible.", 
        extraBiblical: "1 Enoch 19-21 - Uriel guides Enoch through heaven and hell. 4 Ezra - Interprets visions for Ezra.", 
        sources: ["1 Enoch", "4 Ezra", "Apocalypse of Peter"] 
    },
    { 
        name: "Sariel / Suriel", 
        hebrew: "\u05E9\u05E8\u05D9\u05D0\u05DC (Sari'el)", 
        type: "angel", 
        category: "archangel", 
        description: "Prince of God, angel of death and divine instruction.", 
        fullDescription: "Sariel serves as one of the seven archangels. In 1 Enoch, he is 'set over the spirits of those who sin in the spirit.' Some traditions identify him as the angel who taught Moses about the lunar calendar.", 
        role: "Judge of spiritual sins, guide of departed souls.", 
        hierarchy: "One of the seven holy archangels.", 
        attributes: "Associated with the moon and judgment.", 
        biblicalReferences: "None.", 
        extraBiblical: "1 Enoch 20:6.", 
        sources: ["1 Enoch 20:6", "Jewish Mystical Traditions"] 
    },
    { 
        name: "Raguel", 
        hebrew: "\u05E8\u05E2\u05D5\u05D0\u05DC (Re'u'el)", 
        type: "angel", 
        category: "archangel", 
        description: "Friend of God, angel of justice and harmony.", 
        fullDescription: "Raguel is the enforcer of divine order among the angels themselves. In 1 Enoch, he is 'set over the world of the luminaries' and takes vengeance on the world of lights (angels who fail their duties).", 
        role: "Overseer of angelic conduct, enforcer of justice.", 
        hierarchy: "One of the seven holy archangels.", 
        attributes: "Gavel of justice, inspector of angels.", 
        biblicalReferences: "None.", 
        extraBiblical: "1 Enoch 20:4.", 
        sources: ["1 Enoch 20:4"] 
    },
    { 
        name: "Remiel / Jeremiel", 
        hebrew: "\u05E8\u05DE\u05D9\u05D0\u05DC (Remi'el)", 
        type: "angel", 
        category: "archangel", 
        description: "Thunder of God, angel of resurrection and hope.", 
        fullDescription: "Remiel is set over 'those who rise' (the resurrection). In 2 Esdras (4 Ezra), he answers questions about the end times and the number of the righteous.", 
        role: "Angel of resurrection, guide of souls.", 
        hierarchy: "One of the seven archangels.", 
        attributes: "Trumpet of resurrection.", 
        biblicalReferences: "Possibly implied in 1 Thess 4:16.", 
        extraBiblical: "1 Enoch 20:8, 2 Esdras 4:36.", 
        sources: ["1 Enoch 20:8", "2 Esdras"] 
    },

    // --- PROMINENT ANGELS ---
    { 
        name: "Metatron", 
        hebrew: "\u05DE\u05D8\u05D8\u05E8\u05D5\u05DF (Metatron)", 
        type: "angel", 
        category: "angel", 
        description: "Highest of angels, celestial scribe, transformed Enoch.", 
        fullDescription: "Metatron stands as the greatest angel in Jewish mystical tradition, serving as God's scribe. Identified as the patriarch Enoch transformed into fire after walking with God.", 
        role: "Heavenly scribe, Prince of the Presence.", 
        hierarchy: "Prince of the Divine Presence.", 
        attributes: "36 pairs of wings, writes with fire.", 
        biblicalReferences: "Genesis 5:24 (Enoch's translation implied).", 
        extraBiblical: "3 Enoch (Sefer Hekhalot).", 
        sources: ["3 Enoch", "Talmud Hagigah 15a"] 
    },
    { 
        name: "Sandalphon", 
        hebrew: "\u05E1\u05E0\u05D3\u05DC\u05E4\u05D5\u05DF (Sandalfon)", 
        type: "angel", 
        category: "angel", 
        description: "Twin brother of Metatron, weaver of prayers.", 
        fullDescription: "Sandalphon gathers the prayers of humanity and weaves them into garlands for the divine throne. He is said to be taller than any other angel by a journey of 500 years.", 
        role: "Collector of prayers.", 
        hierarchy: "Twin of Metatron.", 
        attributes: "Immense height, floral garlands.", 
        biblicalReferences: "None.", 
        extraBiblical: "Talmud, Kabbalah.", 
        sources: ["Babylonian Talmud", "Kabbalah"] 
    },
    { 
        name: "Raziel", 
        hebrew: "\u05E8\u05D6\u05D9\u05D0\u05DC (Razi'el)", 
        type: "angel", 
        category: "angel", 
        description: "Secret of God, keeper of divine mysteries.", 
        fullDescription: "Raziel stands near God's throne recording all divine secrets. He gave Adam the Sefer Raziel containing all knowledge of the universe.", 
        role: "Revealer of secrets, guardian of wisdom.", 
        hierarchy: "Keeper of secrets.", 
        attributes: "Book of knowledge.", 
        biblicalReferences: "None.", 
        extraBiblical: "Sefer Raziel HaMalakh.", 
        sources: ["Sefer Raziel", "Zohar"] 
    },
    { 
        name: "Azrael", 
        hebrew: "\u05E2\u05D6\u05E8\u05D0\u05DC (Azar'el)", 
        type: "angel", 
        category: "angel", 
        description: "Whom God helps, the Angel of Death.", 
        fullDescription: "Azrael separates the soul from the body at death. Though fearsome, he serves with compassion and is the servant of God.", 
        role: "Psychopomp, separator of soul.", 
        hierarchy: "Angel of Third Heaven.", 
        attributes: "Book of names, covered in eyes.", 
        biblicalReferences: "None.", 
        extraBiblical: "Jewish Mysticism, Islamic tradition.", 
        sources: ["Zohar", "Folklore"] 
    },

    // --- WATCHERS & FALLEN ---
    { 
        name: "Semjaza", 
        hebrew: "\u05E9\u05DE\u05D7\u05D6\u05D0\u05D9 (Shemhazai)", 
        type: "demon", 
        category: "fallen", 
        description: "Leader of the Watchers who descended on Mount Hermon.", 
        fullDescription: "Semjaza led the 200 Watchers who swore an oath to take human wives. He taught root-cutting and sorcery. He is bound in the valleys of the earth.", 
        role: "Chief of the Fallen Watchers, Father of Giants.", 
        hierarchy: "Leader of the Rebellion.", 
        attributes: "Forbidden knowledge.", 
        biblicalReferences: "Genesis 6:1-4 (implied).", 
        extraBiblical: "1 Enoch 6-8, Book of Giants.", 
        sources: ["1 Enoch 6-8", "Book of Giants"] 
    },
    { 
        name: "Azazel", 
        hebrew: "\u05E2\u05D6\u05D0\u05D6\u05DC (Azazel)", 
        type: "demon", 
        category: "fallen", 
        description: "Scapegoat demon, teacher of warfare.", 
        fullDescription: "Azazel taught men to make swords and shields, and women to use cosmetics. He corrupted the earth. He is bound in the desert under jagged rocks.", 
        role: "Corrupter, Teacher of War.", 
        hierarchy: "Chief Watcher.", 
        attributes: "Desert, Scapegoat.", 
        biblicalReferences: "Leviticus 16.", 
        extraBiblical: "1 Enoch 8, Apocalypse of Abraham.", 
        sources: ["Leviticus 16", "1 Enoch 8"] 
    },
    { 
        name: "Gadreel", 
        hebrew: "\u05D2\u05D3\u05E8\u05D0\u05DC (Gadre'el)", 
        type: "demon", 
        category: "fallen", 
        description: "Wall of God, seduced Eve, taught weapons.", 
        fullDescription: "Gadreel is identified in 1 Enoch 69 as the angel who led Eve astray (instead of the serpent). He taught humans to make weapons of death.", 
        role: "Tempter, teacher of war.", 
        hierarchy: "Chief Watcher.", 
        attributes: "Serpent connection.", 
        biblicalReferences: "None.", 
        extraBiblical: "1 Enoch 69:6.", 
        sources: ["1 Enoch 69"] 
    },
    { 
        name: "Penemue", 
        hebrew: "\u05E4\u05E0\u05DE\u05D5\u05D0 (Penemu'a)", 
        type: "demon", 
        category: "fallen", 
        description: "Taught writing and bitter knowledge.", 
        fullDescription: "Penemue taught humanity the art of writing with ink and paper, which the text claims brought 'bitter knowledge' and sin.", 
        role: "Teacher of writing.", 
        hierarchy: "Watcher.", 
        attributes: "Ink and paper.", 
        biblicalReferences: "None.", 
        extraBiblical: "1 Enoch 69:8.", 
        sources: ["1 Enoch 69"] 
    },

    // --- DEMONS ---
    { 
        name: "Satan / Sammael", 
        hebrew: "\u05E9\u05D8\u05DF (Satan) / \u05E1\u05DE\u05D0\u05DC (Samael)", 
        type: "demon", 
        category: "demon", 
        description: "The Adversary, Prince of Demons, the Accuser.", 
        fullDescription: "Satan represents the supreme mystery of evil. Known as Sammael ('Venom of God') in Jewish mysticism. In the Dead Sea Scrolls, he is Belial. He opposes God's purposes and accuses humanity.", 
        role: "Chief adversary, ruler of this age.", 
        hierarchy: "Prince of Demons.", 
        attributes: "Serpent, Dragon, Lightning.", 
        biblicalReferences: "Job 1-2, Revelation 12, Isaiah 14.", 
        extraBiblical: "1 Enoch, Dead Sea Scrolls.", 
        sources: ["Job 1-2", "Revelation 12", "1 Enoch"] 
    },
    { 
        name: "Belial", 
        hebrew: "\u05D1\u05DC\u05D9\u05E2\u05DC (Beliya'al)", 
        type: "demon", 
        category: "demon", 
        description: "Worthlessness. Prince of Darkness in Dead Sea Scrolls.", 
        fullDescription: "Belial is the personification of wickedness. In the Qumran texts (War Scroll), he leads the 'Sons of Darkness' against Michael and the 'Sons of Light'.", 
        role: "Prince of Darkness.", 
        hierarchy: "Chief Demon.", 
        attributes: "Darkness, lawlessness.", 
        biblicalReferences: "2 Cor 6:15.", 
        extraBiblical: "War Scroll (1QM), Testament of Amram.", 
        sources: ["2 Cor 6:15", "Dead Sea Scrolls"] 
    },
    { 
        name: "Mastema", 
        hebrew: "\u05DE\u05E9\u05D8\u05DE\u05D4 (Mastema)", 
        type: "demon", 
        category: "demon", 
        description: "Animosity. Prince of Evil Spirits in Jubilees.", 
        fullDescription: "Mastema acts as the chief accuser and executioner of God's punishments. He asked God to let him keep one-tenth of the demons to test humanity after the Flood.", 
        role: "Tester of humanity, executor of wrath.", 
        hierarchy: "Prince of Evil Spirits.", 
        attributes: "Accusation.", 
        biblicalReferences: "None.", 
        extraBiblical: "Book of Jubilees.", 
        sources: ["Book of Jubilees"] 
    },
    { 
        name: "Asmodeus", 
        hebrew: "\u05D0\u05E9\u05DE\u05D3\u05D0\u05D9 (Ashmeday)", 
        type: "demon", 
        category: "demon", 
        description: "Demon of lust and rage, King of Demons.", 
        fullDescription: "The antagonist of the Book of Tobit who killed Sarah's seven husbands. Solomon bound him to help build the temple.", 
        role: "Destroyer of marriages.", 
        hierarchy: "King of Demons.", 
        attributes: "Lust, fire.", 
        biblicalReferences: "Tobit.", 
        extraBiblical: "Testament of Solomon, Talmud.", 
        sources: ["Tobit", "Testament of Solomon"] 
    },
    { 
        name: "Lilith", 
        hebrew: "\u05DC\u05D9\u05DC\u05D9\u05EA (Lilit)", 
        type: "demon", 
        category: "demon", 
        description: "Night demon, stealer of infants.", 
        fullDescription: "Originally a storm demon (Lilitu). In folklore, Adam's first wife who refused submission. Associated with the night wind and danger to children.", 
        role: "Mother of Demons.", 
        hierarchy: "Queen of Night.", 
        attributes: "Owl, night.", 
        biblicalReferences: "Isaiah 34:14.", 
        extraBiblical: "Alphabet of Ben Sira.", 
        sources: ["Isaiah 34", "Ben Sira"] 
    },
    { 
        name: "Beelzebub", 
        hebrew: "\u05D1\u05E2\u05DC \u05D6\u05D1\u05D5\u05D1 (Ba'al Zevuv)", 
        type: "demon", 
        category: "demon", 
        description: "Lord of the Flies, Prince of Demons.", 
        fullDescription: "Originally a Philistine god, he became associated with decay and demons. In the Gospels, Pharisees accuse Jesus of using his power.", 
        role: "Prince of Demons.", 
        hierarchy: "High Prince.", 
        attributes: "Flies, decay.", 
        biblicalReferences: "2 Kings 1, Matthew 12:24.", 
        extraBiblical: "Testament of Solomon.", 
        sources: ["2 Kings 1", "Matthew 12"] 
    },
    { 
        name: "Abaddon / Apollyon", 
        hebrew: "\u05D0\u05D1\u05D3\u05D5\u05DF (Avadon)", 
        type: "demon", 
        category: "demon", 
        description: "Destruction. Angel of the Abyss.", 
        fullDescription: "The King of the locusts in Revelation. Abaddon refers to the place of destruction (Sheol), personified as the angel of the pit.", 
        role: "Jailer of the Abyss.", 
        hierarchy: "King of Locusts.", 
        attributes: "Key to the Pit.", 
        biblicalReferences: "Revelation 9:11.", 
        extraBiblical: "Dead Sea Scrolls.", 
        sources: ["Revelation 9:11", "Job 26:6"] 
    },
    
    // --- OTHERS ---
    { 
        name: "The Destroying Angel", 
        hebrew: "\u05D4\u05DE\u05E9\u05D7\u05D9\u05EA (HaMashchit)", 
        type: "angel", 
        category: "angel", 
        description: "Executor of divine judgment (Passover).", 
        fullDescription: "The angel who struck the firstborn of Egypt. Often distinct from Satan, acting as God's direct agent of wrath.", 
        role: "Executioner.", 
        hierarchy: "Agent of Wrath.", 
        attributes: "Death.", 
        biblicalReferences: "Exodus 12:23.", 
        extraBiblical: "Jubilees 48.", 
        sources: ["Exodus 12"] 
    },
    { 
        name: "Prince of Persia", 
        hebrew: "\u05E9\u05E8 \u05E4\u05E8\u05E1 (Sar Paras)", 
        type: "demon", 
        category: "demon", 
        description: "Territorial spirit opposing Daniel.", 
        fullDescription: "A spiritual power ruling over the Persian empire who delayed the angel Gabriel for 21 days until Michael helped.", 
        role: "Territorial Ruler.", 
        hierarchy: "Prince.", 
        attributes: "National dominion.", 
        biblicalReferences: "Daniel 10.", 
        extraBiblical: "None.", 
        sources: ["Daniel 10"] 
    },
    { 
        name: "Ornias", 
        hebrew: "\u1F40\u03C1\u03BD\u03AF\u03B1\u03C2 (Ornias)", // Greek
        type: "demon", 
        category: "demon", 
        description: "Strangler demon bound by Solomon.", 
        fullDescription: "The first demon bound by Solomon using the ring. He strangled children and drained vitality.", 
        role: "Strangler.", 
        hierarchy: "Lesser demon.", 
        attributes: "Shapeshifter.", 
        biblicalReferences: "None.", 
        extraBiblical: "Testament of Solomon.", 
        sources: ["Testament of Solomon"] 
    }
];