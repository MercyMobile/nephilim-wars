import { useCallback } from 'react';
import { LEVEL_PROGRESSION } from '../data/levelProgression';
import { CLASSES } from '../data/classes';
import { ANCESTRIES } from '../data/ancestries';

function getConMod(attributes) {
  if (!attributes || !attributes.CON) return 0;
  return Math.floor((attributes.CON - 10) / 2);
}

function getClassData(className) {
  return CLASSES.find(c => c.value === className) || null;
}

export function useLevelUp(character, updateCharacter) {
  const canLevelUp = useCallback(() => {
    if (!character) return false;
    const nextLevel = character.level + 1;
    const nextProgression = LEVEL_PROGRESSION[nextLevel - 1];
    if (!nextProgression) return false;
    return (character.xp || 0) >= nextProgression.xpToReach;
  }, [character]);

  const applyLevelUp = useCallback((choices) => {
    if (!character) return null;
    const nextLevel = character.level + 1;
    const classData = getClassData(character.class);
    const hpGain = classData ? classData.hpPerLevel + getConMod(character.attributes) : 0;

    const updated = { ...character, level: nextLevel, maxHp: (character.maxHp || 0) + hpGain, hp: (character.hp || 0) + hpGain };

    if (choices.abilityBoosts) {
      const attrs = { ...updated.attributes };
      for (const [key, boost] of Object.entries(choices.abilityBoosts)) {
        if (attrs[key] !== undefined && boost) {
          attrs[key] = Math.min(attrs[key] + 2, 24);
        }
      }
      updated.attributes = attrs;
    }

    if (choices.ancestryFeat) {
      updated.ancestryFeats = [...(updated.ancestryFeats || []), choices.ancestryFeat];
    }

    if (choices.skillTraining) {
      updated.trainedSkills = [...(updated.trainedSkills || []), choices.skillTraining];
    }

    if (choices.classFeature) {
      updated.classFeatures = [...(updated.classFeatures || []), choices.classFeature];
    }

    updateCharacter(updated);
    return updated;
  }, [character, updateCharacter]);

  const getLevelUpOptions = useCallback((targetLevel) => {
    const progression = LEVEL_PROGRESSION[targetLevel - 1];
    if (!progression) return null;

    const options = {
      abilityBoosts: progression.abilityBoosts,
      ancestryFeat: progression.ancestryFeat,
      skillTraining: progression.skillTraining,
      classFeature: false,
    };

    if (character) {
      const classData = getClassData(character.class);
      if (classData && classData.features && classData.features[targetLevel]) {
        options.classFeature = true;
        options.classFeatureList = classData.features[targetLevel];
      }

      const ancestryData = ANCESTRIES[character.ancestry];
      if (ancestryData && ancestryData.feats && ancestryData.feats[targetLevel]) {
        options.ancestryFeatList = ancestryData.feats[targetLevel];
      }
    }

    return options;
  }, [character]);

  return { canLevelUp, applyLevelUp, getLevelUpOptions };
}