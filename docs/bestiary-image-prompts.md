
# Nephilim Wars — Production Bestiary Prompts

---

## GENERATION PROGRESS (2025-02-28)

**Started:** Session with Z-Image Turbo on Radeon VII 16GB  
**Progress:** **38/38 images complete (100%)** ✅

### Completed:
- ✅ **Archangels (7/7):** Michael, Gabriel, Raphael, Uriel, Sariel, Raguel, Remiel
- ✅ **High Angels (2/2):** Metatron, Raziel  
- ✅ **Angel of Death (1/1):** Azrael
- ✅ **Fallen (10/10):** Sammael, Semyaza, Azazel, Lilith, Asmodeus, Belial, Mastema, Abaddon, Gadreel, Prince of Persia
- ✅ **Combat (8/8):** Nephilim Warrior, Rephaim Champion, Anakim Berserker, Cainite Assassin, Sorcerer-Priest, Horim Tunneler, Gibborim Elite, Gammadim Tunneler
- ✅ **Legendary (4/4):** Ohya, Hahya, Mahway, Gilgamesh
- ✅ **Corrupted (2/2):** Baal-Priest, Lamech

### Optimal Z-Image Turbo Settings:
```bash
GGML_VK_VISIBLE_DEVICES=1 sd-cli.exe \
  --diffusion-model z-image-turbo-Q4_K_M.gguf \
  --vae ae.safetensors \
  --llm Qwen3-4b-Z-Engineer-V2-Q4_K_M.gguf \
  --cfg-scale 1.0 --steps 8 --scheduler smoothstep \
  --width 1024 --height 640 \
  --diffusion-fa --vae-tiling
```
**Time:** ~200s/image | **Location:** `public/images/bestiary/{category}/`

### Key Prompt Format (Z-Image Turbo):
```
[Shot & subject] + [Appearance] + [Clothing] + [Environment] + 
[Lighting] + [Mood] + [Style] + [Quality constraints]

IMPORTANT: Z-Image Turbo ignores negative prompts! 
All constraints must go in positive prompt using "no X" format:
- For angels: "no horns, no demonic features, angelic not demonic"
- For male characters: "no feminine features, no makeup, masculine male only"
- For all: "no blur, no grain, no watermark, no text, no logos"
```

### Scripts:
- `scripts/generate_bestiary_images.py` - Python bulk generator
- `scripts/generate_bestiary.bat` - Interactive batch menu

---

## Production Prompt Set (No Oil Paint Style)
Unified Gritty Biblical Realism

---

## MASTER STYLE (Applied to Every Prompt)

dark biblical epic fantasy realism, gritty cinematic realism,
battle-worn materials, weathered armor and cloth,
realistic metals and leather,
dramatic cinematic lighting,
strong contrast,
volumetric dust and smoke,
ash and debris in the air,
epic apocalyptic atmosphere,
ultra detailed textures,
low heroic camera angle,
realistic anatomy and proportions,
sharp focus,
epic fantasy card art

Aspect Ratio: 3:4

---

# ARCHANGELS

## Michael — Archangel Warrior

Fantasy card art, Archangel Michael standing victorious on a celestial battlefield, battle-worn silver armor scratched and scarred from combat, massive lightning-wreathed sword raised, large white wings spread wide, stern warrior expression, defeated dragon beneath his foot, broken weapons and fallen enemies around him, divine light breaking through storm clouds,

[MASTER STYLE]

--ar 3:4

---

## Gabriel — Divine Herald

Fantasy card art, Archangel Gabriel standing before celestial gates at dawn, divine herald angel wearing golden armor beneath flowing robes, large white wings spread behind him, holding ornate silver trumpet raised in proclamation, lily held in other hand, serene authoritative expression, radiant dawn light illuminating celestial architecture and clouds,

[MASTER STYLE]

--ar 3:4

---

## Raphael — Celestial Healer

Fantasy card art, Archangel Raphael standing beside healing waters, traveler robes of green and white over light armor, holding staff with coiled serpent symbol, one hand extended in blessing, calm compassionate expression, fish at feet near water edge, warm healing light,

[MASTER STYLE]

--ar 3:4

---

## Uriel — Angel of Light

Fantasy card art, Archangel Uriel standing before the gates of Eden, radiant figure surrounded by subtle firelight aura, holding flaming sword and scroll of wisdom, intense knowing expression, celestial light illuminating ancient garden gates,

[MASTER STYLE]

--ar 3:4

---

## Sariel — Angel of Judgment

Fantasy card art, Archangel Sariel standing under a moonlit sky, silver robes and wings illuminated by cold starlight, holding scales of judgment, solemn expression, lunar symbols surrounding figure,

[MASTER STYLE]

--ar 3:4

---

## Raguel — Angel of Justice

Fantasy card art, Archangel Raguel standing in celestial court, holding scales and measuring rod, authoritative figure in blue and gold robes over armor, throne of judgment behind,

[MASTER STYLE]

--ar 3:4

---

## Remiel — Angel of Resurrection

Fantasy card art, Archangel Remiel watching rising souls at dawn, gentle expression, trumpet at side, open tomb emitting light, hopeful rising atmosphere,

[MASTER STYLE]

--ar 3:4

---

# HIGH ANGELS

## Metatron — Celestial Scribe

Fantasy card art, Metatron seated beside heavenly throne writing in massive celestial book with golden quill, multiple wings spread behind, crown of light above head, transcendent wisdom presence,

[MASTER STYLE]

--ar 3:4

---

## Raziel — Keeper of Mysteries

Fantasy card art, Raziel holding sealed tome of divine secrets, mysterious veiled angel figure, cryptic celestial writing floating in air, deep purple robes,

[MASTER STYLE]

--ar 3:4

---

# ANGEL OF DEATH

## Azrael — Soul Separator

Fantasy card art, Azrael standing between worlds, massive wings stretched wide, holding scroll of names, solemn presence guiding departing soul toward light,

[MASTER STYLE]

--ar 3:4

---

# FALLEN WATCHERS

## Satan — The Adversary

Fantasy card art, fallen archangel standing in dark heavenly court, corrupted wings and proud defiant expression, traces of former glory in tarnished gold armor,

[MASTER STYLE]

--ar 3:4

---

## Semyaza — Fallen Watcher Leader

Fantasy card art portrait of Semyaza the fallen Watcher leader standing in chains on Mount Hermon at twilight, masculine fallen angelic figure with bound hands, torn and tarnished wings folded behind, once-beautiful robes darkened, face marked by pride and fear, leader who feared the sin but led 200 angels into rebellion, storm clouds gathering behind him, adult male angel not female,

[MASTER STYLE]

--ar 3:4

---

## Azazel — Bound Fallen Angel

Fantasy card art, Azazel chained in desert canyon, goat-like features emerging, weapons scattered at feet, oppressive darkness,

[MASTER STYLE]

--ar 3:4

---

## Lilith — Night Demon Queen

Fantasy card art, Lilith standing in desert night with owl wings spread wide, predatory expression, moonlight illuminating form,

[MASTER STYLE]

--ar 3:4

---

## Asmodeus — Demon of Lust

Fantasy card art, Asmodeus with three heads seated in dark court, seductive destructive presence, regal demonic authority,

[MASTER STYLE]

--ar 3:4

---

## Belial — Spirit of Lawlessness

Fantasy card art, Belial seated on corrupt throne, elegant fallen angel appearance, deceptive beauty concealing corruption,

[MASTER STYLE]

--ar 3:4

---

## Mastema — Accuser of Spirits

Fantasy card art, Mastema pointing accusing finger holding ledger of sins, commanding spirits behind him,

[MASTER STYLE]

--ar 3:4

---

## Abaddon — Angel of the Abyss

Fantasy card art, Abaddon emerging from abyss smoke holding key to bottomless pit, locust creatures gathering,

[MASTER STYLE]

--ar 3:4

---

## Gadreel — Serpent Tempter

Fantasy card art, Gadreel offering forbidden fruit in Eden garden, serpent imagery woven through armor,

[MASTER STYLE]

--ar 3:4

---

## Prince of Persia — Territorial Spirit

Fantasy card art, territorial spirit in Persian royal armor resisting heavenly messenger in spiritual battle,

[MASTER STYLE]

--ar 3:4

---

