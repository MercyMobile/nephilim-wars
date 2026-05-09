import React, { useState } from 'react';
import { useLevelUp } from '../../hooks/useLevelUp';
import ProgressBar from './ProgressBar';
import { LEVEL_PROGRESSION } from '../../data/levelProgression';
import { CLASSES } from '../../data/classes';
import { ANCESTRIES } from '../../data/ancestries';
import LevelUpWizard from './LevelUpWizard';

function getClassFeaturesForLevel(classValue, level) {
  const className = typeof classValue === 'object' ? classValue?.value : classValue;
  const classData = CLASSES.find((c) => c.value === className);
  if (!classData || !classData.features[level]) return [];
  return classData.features[level];
}

function getAncestryFeatsForLevel(ancestry, level) {
  const ancestryKey = typeof ancestry === 'object' ? ancestry?.key : ancestry;
  const ancestryData = ANCESTRIES[ancestryKey];
  if (!ancestryData || !ancestryData.feats || !ancestryData.feats[level]) return [];
  return ancestryData.feats[level];
}

export default function LevelTab({ character, updateCharacter }) {
  const { canLevelUp } = useLevelUp(character, updateCharacter);
  const [showWizard, setShowWizard] = useState(false);
  const [expandedLevel, setExpandedLevel] = useState(null);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-full text-stone-600 font-cinzel">
        No character loaded
      </div>
    );
  }

  const currentLevel = character.level || 1;
  const currentXp = character.xp || 0;
  const nextLevelData = LEVEL_PROGRESSION[currentLevel];
  const nextXpThreshold = nextLevelData ? nextLevelData.xpToReach : (currentLevel - 1) * 1000;
  const canLevel = canLevelUp();

  function getNodeClasses(level) {
    if (level < currentLevel) return 'past';
    if (level === currentLevel) return 'current';
    return 'future';
  }

  function getCircleClasses(state) {
    switch (state) {
      case 'past':
        return 'w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-400 flex-shrink-0';
      case 'current':
        return 'w-10 h-10 rounded-full bg-amber-500 border-2 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] flex-shrink-0';
      default:
        return 'w-8 h-8 rounded-full bg-stone-700 border-2 border-stone-600 flex-shrink-0';
    }
  }

  function getLevelTextClasses(state) {
    switch (state) {
      case 'past':
        return 'text-amber-500';
      case 'current':
        return 'text-amber-400';
      default:
        return 'text-stone-600';
    }
  }

  function getFeatureNameClasses(state) {
    switch (state) {
      case 'past':
        return 'text-amber-400/80';
      case 'current':
        return 'text-amber-300';
      default:
        return 'text-stone-600';
    }
  }

  function getBadgeClasses(state) {
    if (state === 'current') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    if (state === 'past') return 'bg-amber-900/20 text-amber-500/70 border border-amber-800/30';
    return 'bg-stone-800/50 text-stone-600 border border-stone-700/50';
  }

  function renderLevelNode(levelData) {
    const level = levelData.level;
    const state = getNodeClasses(level);
    const features = getClassFeaturesForLevel(character.class, level);
    const ancestryFeats = getAncestryFeatsForLevel(character.ancestry, level);
    const isExpanded = expandedLevel === level && state === 'future';

    return (
      <div key={level} className="relative">
        <button
          className="flex items-start gap-3 w-full text-left py-2 group"
          onClick={() => {
            if (state === 'future') {
              setExpandedLevel(isExpanded ? null : level);
            }
          }}
        >
          <div className="flex flex-col items-center">
            <div className={getCircleClasses(state)}>
              <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-bold ${state === 'current' ? 'text-stone-950' : state === 'past' ? 'text-stone-950' : 'text-stone-400'}`}>
                {level}
              </div>
            </div>
            {level < 20 && (
              <div className={`w-px h-4 ${level < currentLevel ? 'bg-amber-500/50' : level === currentLevel ? 'bg-amber-500/30' : 'bg-stone-700'}`} />
            )}
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-sm font-cinzel font-bold ${getLevelTextClasses(state)}`}>
                Level {level}
              </span>
              <span className="text-stone-700 text-xs">
                {levelData.xpToReach} XP
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1">
              {features.map((f, i) => (
                <span key={i} className={`text-xs ${getFeatureNameClasses(state)}`}>
                  {f.name}
                </span>
              ))}
              {levelData.abilityBoosts && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeClasses(state)}`}>
                  Ability Boost
                </span>
              )}
              {levelData.ancestryFeat && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeClasses(state)}`}>
                  Ancestry Feat
                </span>
              )}
              {levelData.skillTraining && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeClasses(state)}`}>
                  Skill Training
                </span>
              )}
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="ml-12 mb-2 p-3 bg-stone-900/80 border border-amber-900/30 rounded-lg">
            <p className="text-amber-400/70 text-xs font-cinzel uppercase tracking-wider mb-1">
              What you gain at Level {level}:
            </p>
            <ul className="space-y-1 text-xs text-stone-400">
              {features.map((f, i) => (
                <li key={i} className="text-stone-300">
                  <span className="text-amber-400">{f.name}:</span> {f.description}
                </li>
              ))}
              {levelData.abilityBoosts && (
                <li className="text-stone-300">
                  <span className="text-amber-400">Ability Boost</span> — Increase 4 different ability scores by 2
                </li>
              )}
              {levelData.ancestryFeat && ancestryFeats.length > 0 && (
                <li>
                  <span className="text-amber-400">Ancestry Feat choices:</span>
                  <ul className="ml-3 mt-0.5">
                    {ancestryFeats.map((feat, i) => (
                      <li key={i} className="text-stone-400">{feat.name}</li>
                    ))}
                  </ul>
                </li>
              )}
              {levelData.skillTraining && (
                <li className="text-stone-300">
                  <span className="text-amber-400">Skill Training</span> — Choose a new trained skill
                </li>
              )}
              <li className="text-stone-500">
                <span className="text-stone-500">HP:</span> +{CLASSES.find((c) => c.value === (typeof character.class === 'object' ? character.class?.value : character.class))?.hpPerLevel || 0} + CON modifier
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {showWizard && (
        <LevelUpWizard
          character={character}
          updateCharacter={updateCharacter}
          onClose={() => setShowWizard(false)}
        />
      )}

      <div className="text-center">
        <div className="text-4xl font-cinzel text-amber-500 mb-1">
          Level {currentLevel}
        </div>
        <div className="text-stone-500 text-sm font-cinzel uppercase tracking-wider">
          {CLASSES.find((c) => c.value === (typeof character.class === 'object' ? character.class?.value : character.class))?.label || (typeof character.class === 'object' ? character.class?.label : character.class)}
        </div>
      </div>

      <ProgressBar
        value={currentXp}
        max={nextXpThreshold}
        color="amber-500"
        label="Experience"
        showValue={true}
        height="h-3"
      />

      {canLevel && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowWizard(true)}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 font-cinzel font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/50 transition-all animate-pulse"
          >
            Level Up!
          </button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-cinzel text-amber-400/70 uppercase tracking-wider mb-2 border-b border-amber-900/30 pb-1">
          Progression Tree
        </h3>
        <div className="space-y-0">
          {LEVEL_PROGRESSION.map((levelData) => renderLevelNode(levelData))}
        </div>
      </div>
    </div>
  );
}