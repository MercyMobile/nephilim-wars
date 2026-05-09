const ABILITY_BOOST_LEVELS = [1, 5, 10, 15, 20];
const ANCESTRY_FEAT_LEVELS = [1, 5, 9, 13, 17];
const SKILL_TRAINING_LEVELS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
const PROFICIENCY_INCREASE_LEVELS = [3, 7, 13, 19];
const CLASS_FEATURE_LEVELS = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

export const LEVEL_PROGRESSION = Array.from({ length: 20 }, (_, i) => {
  const level = i + 1;
  return {
    level,
    xpToReach: (level - 1) * 1000,
    abilityBoosts: ABILITY_BOOST_LEVELS.includes(level),
    ancestryFeat: ANCESTRY_FEAT_LEVELS.includes(level),
    skillTraining: SKILL_TRAINING_LEVELS.includes(level),
    proficiencyIncrease: PROFICIENCY_INCREASE_LEVELS.includes(level),
    classFeatureLevel: CLASS_FEATURE_LEVELS.includes(level)
  };
});

export const XP_TABLE = LEVEL_PROGRESSION.reduce((acc, entry) => {
  acc[entry.level] = entry.xpToReach;
  return acc;
}, {});

export function getProficiencyBonus(level, rank) {
  switch (rank) {
    case 'legendary': return level + 8;
    case 'master': return level + 6;
    case 'expert': return level + 4;
    case 'trained': return level + 2;
    case 'untrained': return 0;
    default: return 0;
  }
}