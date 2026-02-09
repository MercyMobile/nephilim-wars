// CharacterGenerator_bu.jsx
import React, { useState, useEffect } from 'react';
import { validateCharacterName, validateAttribute, validateDescription } from '../utils/validation';
import { setCharacterData, addToPartyRoster } from '../utils/storage';

const CharacterGenerator = ({ onCharacterComplete }) => {
  /* === ANCESTRY DATA (PF2e-Compliant per Manual) === */
  const RACES = {
    Sethite: {
      name: 'Sethite (Righteous Line)',
      desc: 'Descendants of Seth. Keepers of the original faith and pre‑fall history.',
      abilityBoosts: ['Free', 'Free'], // Two free boosts
      abilityFlaw: 'Free', // One free flaw (optional)
      ancestryHP: 8,
      size: 'Medium',
      speed: 25,
      traits: ['Blessed Heritage (+1 Religion)', 'Divine Favor (Detect Evil 1/day)', 'Low‑Light Vision'],
      startingRP: 2,
      startingCP: 0,
      heightRange: { male: [65, 72], female: [60, 67] },
      accessory: 'prayer shawl, scroll case, or holy phylactery',
      visuals: 'simple robes of wool and linen, prayer shawl, holding scroll or staff',
    },
    Cainite: {
      name: 'Cainite (City Builder)',
      desc: 'Descendants of the first murderer. Masters of metallurgy, music, and urbanization.',
      abilityBoosts: ['Free', 'Free'], // Two free boosts
      abilityFlaw: 'Free', // One free flaw (optional)
      ancestryHP: 8,
      size: 'Medium',
      speed: 25,
      traits: ['City Born (+1 Urban Recall Knowledge)', 'Mark of Cain (Protection)', 'Builder\'s Heritage'],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [66, 73], female: [61, 68] },
      accessory: 'bronze jewelry, musical instrument (lyre/flute), or artisan\'s hammer',
      visuals: 'elaborate dyed fabrics, bronze ornaments, gold and brass jewelry, practical stylish clothing',
    },
    Wanderer: {
      name: 'Wanderer (Nomad)',
      desc: 'Those who rejected both the cities of Cain and the strictures of Seth.',
      abilityBoosts: ['Free', 'Free'],
      abilityFlaw: 'Free',
      ancestryHP: 8,
      size: 'Medium',
      speed: 25,
      traits: ['Nomadic (+1 Survival)', 'Wanderer’s Resilience', 'Rugged Endurance'],
      startingRP: 1,
      startingCP: 0,
      heightRange: { male: [64, 71], female: [59, 66] },
      accessory: 'leather satchel, dried herbs, or woven cloak',
      visuals: 'tattered tunic, rough leather boots, sun‑burnt skin',
    },
  };

  /* === IMAGE MODELS & EQUIPMENT === */
  const IMAGE_MODELS = {
    flux: 'flux-schnell',
    midjourney: 'midjourney',
    stableDiffusion: 'stable-diffusion',
  };

  const EQUIPMENT = {
    bronze_sword: 'bronze sword, leather sheath, quiver of arrows',
    bronze_axe: 'bronze axe, leather belt, shield',
    bronze_rapier: 'bronze rapier, leather gloves, cloak',
    bronze_spear: 'bronze spear, leather pack, hood',
  };

  /* === BUILD PROMPT LOGIC === */
  const buildImagePrompt = () => {
    const raceData = RACES[formData.lineage];
    const customDesc = formData.customVisuals.trim();

    /* --- Skin tone mapping (Middle‑Eastern) --- */
    const SKIN_MAP = {
      olive: 'olive skin, Middle‑Eastern features',
      bronze: 'bronze sun‑tanned skin, Middle‑Eastern features',
      copper: 'copper reddish‑brown skin, Middle‑Eastern features',
      tan: 'tan skin, Middle‑Eastern features',
      'light brown': 'light brown skin, Middle‑Eastern features',
      'dark brown': 'deep dark brown skin, Middle‑Eastern features',
      alabaster: 'pale alabaster skin, Middle‑Eastern features',
      obsidian: 'deep black skin, Middle‑Eastern features',
      'red clay': 'reddish clay skin, Middle‑Eastern features',
      'ashen grey': 'grey ashen skin, Middle‑Eastern features',
      'copper patina': 'greenish copper‑tinted skin, Middle‑Eastern features',
      marble: 'pale marble‑white skin, Middle‑Eastern features',
      'gold-dust': 'golden luminous skin, Middle‑Eastern features',
      pale: 'pale light skin, Middle‑Eastern features',
      'unnaturally pale': 'ghostly pale white skin, Middle‑Eastern features',
    };
    const cleanSkin = SKIN_MAP[formData.skinTone] || formData.skinTone;

    /* --- Hair texture & phenotype --- */
    const raceKey = formData.lineage.toLowerCase();
    const isFemale = formData.sex === 'Female';
    const basePhenotype = isFemale
      ? 'woman, Semitic Middle Eastern features, ancient biblical era'
      : 'man, Semitic Middle Eastern features, ancient biblical era';

    let hairTexture;
    switch (raceKey) {
      case 'sethite':
        hairTexture = 'thick wavy black';
        break;
      case 'cainite':
        hairTexture = 'curly dark brown';
        break;
      case 'wanderer':
        hairTexture = 'straight dark brown';
        break;
      default:
        hairTexture = 'thick wavy';
    }

    /* --- Core parts in UI order --- */
    const coreParts = [
      formData.name,
      raceData.name,
      formData.charClass,
      formData.level,
      formData.gameBackground,
      formData.sex,
      formData.height,
      cleanSkin,
      formData.eyeColor,
      `${hairTexture} ${formData.hairColor}`,
      formData.hairLength,
      formData.bodyBuild,
      formData.distinguishingFeature,
      formData.mount,
      formData.background,
      formData.vibe,
      customDesc,
    ];

    /* --- Negative prompt (unchanged) --- */
    const negativePrompt =
      'European features, Nordic features, Viking, pale blue eyes, blonde eyebrows, photograph, photo, photorealistic, extra limbs, extra arms, extra fingers, deformed hands, mutated, disfigured, blurry, bad anatomy, nudity, text, watermark, signature, cartoon, anime, 3d render';

    /* --- Trim to 1000 chars --- */
    const MAX_PROMPT_LENGTH = 1000;
    let prompt = coreParts.join(', ');
    prompt = prompt.replace(/[()"]/g, '').replace(/,\s*,/g, ',').trim();

    if (prompt.length > MAX_PROMPT_LENGTH) {
      const parts = [...coreParts];
      while (parts.length > 1) {
        parts.pop();
        prompt = parts.join(', ').replace(/[()"]/g, '').replace(/,\s*,/g, ',').trim();
        if (prompt.length <= MAX_PROMPT_LENGTH) break;
      }
      if (prompt.length > MAX_PROMPT_LENGTH) {
        prompt = prompt.slice(0, MAX_PROMPT_LENGTH);
      }
    }

    return { prompt, negativePrompt };
  };

  /* === GENERATE IMAGE === */
  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const { prompt: fullPrompt, negativePrompt } = buildImagePrompt();
      console.log('Generating image with prompt:', fullPrompt);
      console.log('Negative prompt:', negativePrompt);

      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          negative_prompt: negativePrompt,
          model: formData.imageModel,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);
      setPortrait(data.image_url);
    } catch (e) {
      console.error(e);
      setError('Failed to generate image.');
    } finally {
      setLoading(false);
    }
  };

  /* === STATE === */
  const [formData, setFormData] = useState({
    name: '',
    lineage: 'Sethite',
    charClass: 'Warrior',
    level: 1,
    gameBackground: 'watchers_apprentice',
    sex: 'Male',
    height: '',
    skinTone: 'olive',
    eyeColor: 'dark brown',
    hairColor: 'black',
    hairLength: 'shoulder length',
    bodyBuild: 'athletic',
    distinguishingFeature: 'none',
    mount: 'none',
    background: 'ancient stone city',
    vibe: 'biblical epic',
    customVisuals: '',
    imageModel: IMAGE_MODELS.flux,
    equipment: 'bronze_sword',
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    ancestryFreeBoosts: [],
    ancestryFlaw: '',
    bgFixedChoice: '',
    bgFreeBoost: '',
    classKeyChoice: '',
    freeBoosts: [],
  });

  const [loading, setLoading] = useState(false);
  const [portrait, setPortrait] = useState(null);
  const [error, setError] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [finalCharacter, setFinalCharacter] = useState(null);

  /* === RENDER === */
  return (
    <div className="character-generator">
      {/* UI for name */}
      <label>
        Name:
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </label>

      {/* UI for lineage */}
      <label>
        Lineage:
        <select
          value={formData.lineage}
          onChange={(e) => setFormData({ ...formData, lineage: e.target.value })}
        >
          {Object.keys(RACES).map((key) => (
            <option key={key} value={key}>{RACES[key].name}</option>
          ))}
        </select>
      </label>

      {/* UI for class */}
      <label>
        Class:
        <input
          type="text"
          value={formData.charClass}
          onChange={(e) => setFormData({ ...formData, charClass: e.target.value })}
        />
      </label>

      {/* UI for level */}
      <label>
        Level:
        <input
          type="number"
          min="1"
          max="20"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
        />
      </label>

      {/* UI for background */}
      <label>
        Game Background:
        <input
          type="text"
          value={formData.gameBackground}
          onChange={(e) => setFormData({ ...formData, gameBackground: e.target.value })}
        />
      </label>

      {/* UI for sex */}
      <label>
        Sex:
        <select
          value={formData.sex}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </label>

      {/* UI for height */}
      <label>
        Height:
        <input
          type="text"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
        />
      </label>

      {/* UI for skin tone */}
      <label>
        Skin Tone:
        <select
          value={formData.skinTone}
          onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })}
        >
          {Object.keys(SKIN_MAP).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </label>

      {/* UI for eye color */}
      <label>
        Eye Color:
        <input
          type="text"
          value={formData.eyeColor}
          onChange={(e) => setFormData({ ...formData, eyeColor: e.target.value })}
        />
      </label>

      {/* UI for hair color */}
      <label>
        Hair Color:
        <input
          type="text"
          value={formData.hairColor}
          onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}
        />
      </label>

      {/* UI for hair length */}
      <label>
        Hair Length:
        <input
          type="text"
          value={formData.hairLength}
          onChange={(e) => setFormData({ ...formData, hairLength: e.target.value })}
        />
      </label>

      {/* UI for body build */}
      <label>
        Body Build:
        <input
          type="text"
          value={formData.bodyBuild}
          onChange={(e) => setFormData({ ...formData, bodyBuild: e.target.value })}
        />
      </label>

      {/* UI for distinguishing feature */}
      <label>
        Distinguishing Feature:
        <input
          type="text"
          value={formData.distinguishingFeature}
          onChange={(e) => setFormData({ ...formData, distinguishingFeature: e.target.value })}
        />
      </label>

      {/* UI for mount */}
      <label>
        Mount:
        <input
          type="text"
          value={formData.mount}
          onChange={(e) => setFormData({ ...formData, mount: e.target.value })}
        />
      </label>

      {/* UI for background */}
      <label>
        Background:
        <input
          type="text"
          value={formData.background}
          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
        />
      </label>

      {/* UI for vibe */}
      <label>
        Vibe:
        <input
          type="text"
          value={formData.vibe}
          onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
        />
      </label>

      {/* UI for custom visuals */}
      <label>
        Custom Visuals:
        <textarea
          value={formData.customVisuals}
          onChange={(e) => setFormData({ ...formData, customVisuals: e.target.value })}
        />
      </label>

      {/* UI for image model */}
      <label>
        Image Model:
        <select
          value={formData.imageModel}
          onChange={(e) => setFormData({ ...formData, imageModel: e.target.value })}
        >
          {Object.entries(IMAGE_MODELS).map(([key, val]) => (
            <option key={key} value={val}>{key}</option>
          ))}
        </select>
      </label>

      {/* UI for equipment */}
      <label>
        Equipment:
        <select
          value={formData.equipment}
          onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
        >
          {Object.entries(EQUIPMENT).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>
      </label>

      {/* UI for attributes */}
      <fieldset>
        <legend>Attributes</legend>
        {Object.entries(formData.attributes).map(([attr, val]) => (
          <label key={attr}>
            {attr}:
            <input
              type="number"
              min="1"
              max="20"
              value={val}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, [attr]: parseInt(e.target.value) },
                })
              }
            />
          </label>
        ))}
      </fieldset>

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Portrait'}
      </button>

      {/* Error display */}
      {error && <div className="error">{error}</div>}

      {/* Portrait display */}
      {portrait && (
        <div className="portrait">
          <img src={portrait} alt="Generated portrait" />
        </div>
      )}

      {/* Sheet toggle */}
      <button onClick={() => setShowSheet(!showSheet)}>
        {showSheet ? 'Hide Sheet' : 'Show Sheet'}
      </button>

      {/* Character sheet */}
      {showSheet && finalCharacter && (
        <div className="character-sheet">
          <h2>{finalCharacter.name}</h2>
          <p>Lineage: {finalCharacter.lineage}</p>
          <p>Class: {finalCharacter.charClass}</p>
          <p>Level: {finalCharacter.level}</p>
          <p>Background: {finalCharacter.gameBackground}</p>
          <p>Sex: {finalCharacter.sex}</p>
          <p>Height: {finalCharacter.height}</p>
          <p>Skin Tone: {finalCharacter.skinTone}</p>
          <p>Eye Color: {finalCharacter.eyeColor}</p>
          <p>Hair Color: {finalCharacter.hairColor}</p>
          <p>Hair Length: {finalCharacter.hairLength}</p>
          <p>Body Build: {finalCharacter.bodyBuild}</p>
          <p>Distinguishing Feature: {finalCharacter.distinguishingFeature}</p>
          <p>Mount: {finalCharacter.mount}</p>
          <p>Background: {finalCharacter.background}</p>
          <p>Vibe: {finalCharacter.vibe}</p>
          <p>Custom Visuals: {finalCharacter.customVisuals}</p>
          <p>Image Model: {finalCharacter.imageModel}</p>
          <p>Equipment: {finalCharacter.equipment}</p>
          <p>Attributes: {JSON.stringify(finalCharacter.attributes)}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterGenerator;
