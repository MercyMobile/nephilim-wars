import React, { useState, useMemo } from 'react';
import { useLevelUp } from '../../hooks/useLevelUp';
import { ANCESTRIES } from '../../data/ancestries';
import { CLASSES } from '../../data/classes';
import { LEVEL_PROGRESSION } from '../../data/levelProgression';

const STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const SKILLS = [
  'Acrobatics', 'Arcana', 'Athletics', 'Crafting', 'Deception',
  'Diplomacy', 'Intimidation', 'Nature', 'Occultism', 'Performance',
  'Religion', 'Society', 'Stealth', 'Survival', 'Medicine',
];

function getStepList(options) {
  const steps = ['overview'];
  if (options.abilityBoosts) steps.push('abilityBoosts');
  if (options.ancestryFeat) steps.push('ancestryFeat');
  if (options.skillTraining) steps.push('skillTraining');
  steps.push('confirm');
  return steps;
}

function StepIndicator({ steps, current }) {
  return (
    <div className="flex justify-center gap-1.5 mb-6">
      {steps.map((step, i) => (
        <div
          key={step}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            steps.indexOf(current) === i
              ? 'bg-amber-500'
              : steps.indexOf(current) > i
                ? 'bg-amber-700'
                : 'bg-stone-700'
          }`}
        />
      ))}
    </div>
  );
}

function OverviewStep({ character, newLevel, options }) {
  const progression = LEVEL_PROGRESSION[newLevel - 1];
  const classData = CLASSES.find((c) => c.value === character.class);
  const classFeatures = classData?.features?.[newLevel] || [];
  const ancestryData = ANCESTRIES[character.ancestry];
  const ancestryFeats = ancestryData?.feats?.[newLevel] || [];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="text-3xl font-cinzel text-amber-500">
          {character.level} → {newLevel}
        </div>
        <div className="text-stone-500 text-sm mt-1">
          Requires {progression.xpToReach} XP
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-cinzel text-amber-400/70 uppercase tracking-wider">Gains</h4>

        {options.classFeature && classFeatures.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <span className="text-green-400">&#10003;</span>
            Class Feature{classFeatures.length > 1 ? 's' : ''}: {classFeatures.map((f) => f.name).join(', ')}
          </div>
        )}

        {options.abilityBoosts && (
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <span className="text-green-400">&#10003;</span>
            Ability Boosts — Increase 4 different stats by 2
          </div>
        )}

        {options.ancestryFeat && (
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <span className="text-green-400">&#10003;</span>
            Ancestry Feat — Choose from {ancestryFeats.length} available feat{ancestryFeats.length !== 1 ? 's' : ''}
          </div>
        )}

        {options.skillTraining && (
          <div className="flex items-center gap-2 text-sm text-stone-300">
            <span className="text-green-400">&#10003;</span>
            Skill Training — Choose a new trained skill
          </div>
        )}

        {!(options.abilityBoosts || options.ancestryFeat || options.skillTraining) && !options.classFeature && (
          <div className="text-stone-500 text-sm">No selectable gains at this level beyond HP.</div>
        )}

        <div className="text-stone-500 text-xs mt-2 pt-2 border-t border-stone-800">
          <span className="text-amber-400">HP:</span> +{classData?.hpPerLevel || 0} + CON modifier
        </div>
      </div>
    </div>
  );
}

function AbilityBoostsStep({ choices, setChoices }) {
  const _selectedStats = Object.values(choices.abilityBoosts || {}).filter(Boolean);

  function handleChange(slot, value) {
    setChoices((prev) => ({
      ...prev,
      abilityBoosts: { ...prev.abilityBoosts, [slot]: value || null },
    }));
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-cinzel text-amber-400/70 uppercase tracking-wider mb-3">
        Choose 4 Different Ability Scores to Boost (+2 each)
      </h4>
      {[0, 1, 2, 3].map((slot) => {
        const currentVal = choices.abilityBoosts?.[slot] || '';
        const otherSelected = Object.entries(choices.abilityBoosts || {})
          .filter(([k]) => k !== String(slot))
          .map(([, v]) => v)
          .filter(Boolean);

        return (
          <div key={slot} className="flex items-center gap-3">
            <label className="text-sm text-stone-400 w-24">
              Boost {slot + 1}
            </label>
            <select
              value={currentVal}
              onChange={(e) => handleChange(slot, e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-700 text-stone-200 rounded px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="">— Select —</option>
              {STATS.map((stat) => (
                <option
                  key={stat}
                  value={stat}
                  disabled={otherSelected.includes(stat)}
                >
                  {stat}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}

function AncestryFeatStep({ character, newLevel, choices, setChoices }) {
  const ancestryData = ANCESTRIES[character.ancestry];
  const feats = ancestryData?.feats?.[newLevel] || [];

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-cinzel text-amber-400/70 uppercase tracking-wider mb-3">
        Choose an Ancestry Feat
      </h4>
      {feats.length === 0 ? (
        <p className="text-stone-500 text-sm">No ancestry feats available at this level.</p>
      ) : (
        <div className="space-y-2">
          {feats.map((feat, i) => (
            <label
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                choices.ancestryFeat?.name === feat.name
                  ? 'bg-amber-900/20 border-amber-500/50'
                  : 'bg-stone-900/50 border-stone-700/50 hover:border-stone-600'
              }`}
            >
              <input
                type="radio"
                name="ancestryFeat"
                checked={choices.ancestryFeat?.name === feat.name}
                onChange={() => setChoices((prev) => ({ ...prev, ancestryFeat: feat }))}
                className="mt-1 accent-amber-500"
              />
              <div>
                <div className="text-sm font-bold text-amber-400">{feat.name}</div>
                <div className="text-xs text-stone-400 mt-1">{feat.description}</div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillTrainingStep({ character, choices, setChoices }) {
  const trainedSkills = character.trainedSkills || [];

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-cinzel text-amber-400/70 uppercase tracking-wider mb-3">
        Choose a Skill to Train
      </h4>
      <div className="space-y-1">
        {SKILLS.map((skill) => {
          const alreadyTrained = trainedSkills.includes(skill);
          return (
            <label
              key={skill}
              className={`flex items-center gap-3 p-2.5 rounded border cursor-pointer transition-colors ${
                choices.skillTraining === skill
                  ? 'bg-amber-900/20 border-amber-500/50'
                  : 'bg-stone-900/50 border-stone-700/50 hover:border-stone-600'
              } ${alreadyTrained ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <input
                type="radio"
                name="skillTraining"
                checked={choices.skillTraining === skill}
                onChange={() => setChoices((prev) => ({ ...prev, skillTraining: skill }))}
                disabled={alreadyTrained}
                className="accent-amber-500"
              />
              <span className="text-sm text-stone-200">{skill}</span>
              {alreadyTrained && <span className="text-xs text-stone-500 ml-auto">Already trained</span>}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmStep({ character, newLevel, choices, options }) {
  const classData = CLASSES.find((c) => c.value === character.class);
  const hpGain = classData ? classData.hpPerLevel + Math.floor(((character.attributes?.CON || 10) - 10) / 2) : 0;
  const classFeatures = classData?.features?.[newLevel] || [];

  const beforeAttrs = { ...character.attributes };
  const afterAttrs = { ...character.attributes };
  if (choices.abilityBoosts) {
    for (const [, stat] of Object.entries(choices.abilityBoosts)) {
      if (stat && afterAttrs[stat] !== undefined) {
        afterAttrs[stat] = Math.min(afterAttrs[stat] + 2, 24);
      }
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-cinzel text-amber-400/70 uppercase tracking-wider mb-3">
        Review Your Choices
      </h4>

      <div className="bg-stone-900/60 rounded-lg p-3 space-y-2">
        <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Level</div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-400">Before</span>
          <span className="text-amber-400">After</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-300">{character.level}</span>
          <span className="text-amber-400 font-bold">{newLevel}</span>
        </div>
      </div>

      {options.abilityBoosts && (
        <div className="bg-stone-900/60 rounded-lg p-3 space-y-2">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Ability Boosts</div>
          <div className="grid grid-cols-6 gap-1 text-center text-xs">
            {STATS.map((stat) => (
              <div key={stat}>
                <div className="text-stone-500">{stat}</div>
                <div className="text-stone-400">{beforeAttrs[stat] || 10}</div>
                {afterAttrs[stat] !== beforeAttrs[stat] && (
                  <div className="text-green-400 font-bold">→ {afterAttrs[stat]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {choices.ancestryFeat && (
        <div className="bg-stone-900/60 rounded-lg p-3 space-y-1">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Ancestry Feat</div>
          <div className="text-sm text-amber-400">{choices.ancestryFeat.name}</div>
          <div className="text-xs text-stone-400">{choices.ancestryFeat.description}</div>
        </div>
      )}

      {choices.skillTraining && (
        <div className="bg-stone-900/60 rounded-lg p-3 space-y-1">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Skill Training</div>
          <div className="text-sm text-amber-400">{choices.skillTraining}</div>
        </div>
      )}

      {classFeatures.length > 0 && (
        <div className="bg-stone-900/60 rounded-lg p-3 space-y-1">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Class Features</div>
          {classFeatures.map((f, i) => (
            <div key={i}>
              <span className="text-sm text-amber-400">{f.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-stone-900/60 rounded-lg p-3 space-y-1">
        <div className="text-xs text-stone-500 uppercase tracking-wider">Hit Points</div>
        <div className="text-sm text-stone-300">
          {character.maxHp || 0} → {(character.maxHp || 0) + hpGain} <span className="text-green-400">(+{hpGain})</span>
        </div>
      </div>
    </div>
  );
}

export default function LevelUpWizard({ character, updateCharacter, onClose }) {
  const { getLevelUpOptions, applyLevelUp } = useLevelUp(character, updateCharacter);
  const newLevel = (character.level || 1) + 1;
  const options = useMemo(() => getLevelUpOptions(newLevel), [getLevelUpOptions, newLevel]);
  const steps = useMemo(() => getStepList(options), [options]);
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [choices, setChoices] = useState({
    abilityBoosts: { 0: null, 1: null, 2: null, 3: null },
    ancestryFeat: null,
    skillTraining: null,
  });

  const stepIndex = steps.indexOf(currentStep);

  function canAdvance() {
    switch (currentStep) {
      case 'overview':
        return true;
      case 'abilityBoosts': {
        const vals = Object.values(choices.abilityBoosts);
        return vals.filter(Boolean).length >= 4 && new Set(vals.filter(Boolean)).size >= 4;
      }
      case 'ancestryFeat':
        return choices.ancestryFeat !== null;
      case 'skillTraining':
        return choices.skillTraining !== null;
      case 'confirm':
        return true;
      default:
        return false;
    }
  }

  function handleConfirm() {
    const applyChoices = {
      classFeature: options.classFeature || false,
    };
    if (options.abilityBoosts) {
      const boosts = {};
      for (const [, stat] of Object.entries(choices.abilityBoosts)) {
        if (stat) boosts[stat] = true;
      }
      applyChoices.abilityBoosts = boosts;
    }
    if (options.ancestryFeat) {
      applyChoices.ancestryFeat = choices.ancestryFeat;
    }
    if (options.skillTraining) {
      applyChoices.skillTraining = choices.skillTraining;
    }
    applyLevelUp(applyChoices);
    onClose();
  }

  function goNext() {
    if (!canAdvance()) return;
    const nextIdx = stepIndex + 1;
    if (nextIdx < steps.length) {
      setCurrentStep(steps[nextIdx]);
    }
  }

  function goPrev() {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) {
      setCurrentStep(steps[prevIdx]);
    }
  }

  function renderStep() {
    switch (currentStep) {
      case 'overview':
        return <OverviewStep character={character} newLevel={newLevel} options={options} />;
      case 'abilityBoosts':
        return <AbilityBoostsStep choices={choices} setChoices={setChoices} />;
      case 'ancestryFeat':
        return <AncestryFeatStep character={character} newLevel={newLevel} choices={choices} setChoices={setChoices} />;
      case 'skillTraining':
        return <SkillTrainingStep character={character} choices={choices} setChoices={setChoices} />;
      case 'confirm':
        return <ConfirmStep character={character} newLevel={newLevel} choices={choices} options={options} />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-stone-950 border border-amber-900/40 rounded-xl shadow-2xl shadow-amber-900/20 max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-lg font-cinzel text-amber-400 uppercase tracking-wider">
            Level Up
          </h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <StepIndicator steps={steps} current={currentStep} />

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-stone-800">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className={`px-4 py-2 rounded text-sm font-cinzel uppercase tracking-wider transition-colors ${
              stepIndex === 0
                ? 'text-stone-700 cursor-not-allowed'
                : 'text-stone-300 hover:text-amber-400 border border-stone-700 hover:border-amber-500/50'
            }`}
          >
            Previous
          </button>

          {currentStep === 'confirm' ? (
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 font-cinzel font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/50 transition-all"
            >
              Confirm Level Up
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canAdvance()}
              className={`px-4 py-2 rounded text-sm font-cinzel uppercase tracking-wider transition-colors ${
                canAdvance()
                  ? 'bg-amber-600 text-stone-950 hover:bg-amber-500'
                  : 'bg-stone-800 text-stone-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}