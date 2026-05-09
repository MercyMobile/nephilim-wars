export const SOUL_TIERS = [
  {
    name: "Blessed",
    minScore: 10,
    maxScore: Infinity,
    effects: {
      description: "Favored by the Most High, your righteousness shines like a beacon in the darkness. Divine miracles are fully accessible, and you are protected by divine favor.",
      divineMiracles: "full access",
      watcherMagic: "blocked",
      initiativeModifier: 0,
      saveBonus: 1,
      rpCostMultiplier: 0.5
    }
  },
  {
    name: "Righteous",
    minScore: 3,
    maxScore: 9,
    effects: {
      description: "Aligned with divine will, you maintain a strong connection to righteousness. Divine miracles are accessible, and you can sense the presence of corruption.",
      divineMiracles: "standard access",
      watcherMagic: "restricted",
      initiativeModifier: 0,
      saveBonus: 0,
      rpCostMultiplier: 1
    }
  },
  {
    name: "Neutral",
    minScore: -2,
    maxScore: 2,
    effects: {
      description: "Spiritually neutral, neither particularly righteous nor corrupted. You stand on the edge, vulnerable to influences from both sides.",
      divineMiracles: "none",
      watcherMagic: "standard",
      initiativeModifier: 0,
      saveBonus: 0,
      rpCostMultiplier: 1
    }
  },
  {
    name: "Tainted",
    minScore: -9,
    maxScore: -3,
    effects: {
      description: "You have succumbed to corruption and are aligned with forbidden powers. Divine miracles are closed to you, and Watcher magic surges with dark power.",
      divineMiracles: "none",
      watcherMagic: "enhanced +1 DC",
      initiativeModifier: -1,
      saveBonus: 0,
      rpCostMultiplier: 1
    }
  },
  {
    name: "Corrupted",
    minScore: -19,
    maxScore: -10,
    effects: {
      description: "Deeply corrupted and marked for judgment. Watcher magic overwhelms your being, and divine forces recoil from your presence.",
      divineMiracles: "blocked",
      watcherMagic: "amplified +2 DC",
      initiativeModifier: -2,
      saveBonus: -1,
      rpCostMultiplier: 1
    }
  },
  {
    name: "Forsaken",
    minScore: -Infinity,
    maxScore: -20,
    effects: {
      description: "Beyond redemption, your soul is forfeit. You are a vessel for forbidden power, and divine judgment awaits you.",
      divineMiracles: "blocked",
      watcherMagic: "dangerous",
      initiativeModifier: -4,
      saveBonus: -2,
      rpCostMultiplier: 1
    }
  }
];

export function getSoulTier(rp, cp) {
  const netScore = rp - cp;
  for (const tier of SOUL_TIERS) {
    if (netScore >= tier.minScore && netScore <= tier.maxScore) {
      return tier;
    }
  }
  return SOUL_TIERS[2];
}