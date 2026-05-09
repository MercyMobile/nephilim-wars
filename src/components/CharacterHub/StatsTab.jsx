import React from 'react';
import { computeAllStats, getAbilityModifier } from '../../utils/characterRules';
import { getNetRighteousness, getSoulTier } from '../../utils/soulEconomy';
import ProgressBar from './ProgressBar';

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const SAVES = [
  { key: 'fortitude', label: 'Fortitude', ability: 'CON' },
  { key: 'reflex', label: 'Reflex', ability: 'DEX' },
  { key: 'will', label: 'Will', ability: 'WIS' },
];

function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function StatsTab({ character }) {
  if (!character) {
    return (
      <div className="flex items-center justify-center h-full text-stone-600 italic font-cinzel">
        Select a character to view their stats.
      </div>
    );
  }

  const stats = computeAllStats(character);
  const attrs = character.attributes || { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
  const currentHP = character.hp ?? stats.maxHP;
  const netR = getNetRighteousness(character.soulEconomy?.rp, character.soulEconomy?.cp);
  const tier = getSoulTier(character.soulEconomy?.rp || 0, character.soulEconomy?.cp || 0);

  return (
    <div className="p-4 md:p-6 space-y-6 font-garamond text-stone-200">

      <section aria-labelledby="abilities-heading">
        <h2 id="abilities-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Ability Scores
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ABILITIES.map((ab) => {
            const score = attrs[ab] ?? 10;
            const mod = getAbilityModifier(score);
            return (
              <div key={ab} className="bg-white/5 border border-[#333] p-3 text-center relative rounded">
                <div className="text-2xl text-white font-bold">{score}</div>
                <div className="text-amber-700 uppercase tracking-widest text-xs mt-1">{ab}</div>
                <span className="absolute top-1.5 right-2 text-amber-200 text-xs font-bold bg-amber-900/30 px-1.5 py-0.5 rounded">
                  {formatModifier(mod)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="vitals-heading">
        <h2 id="vitals-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Vitals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-[#333] p-3 rounded">
            <ProgressBar
              value={currentHP}
              max={stats.maxHP}
              color="red-500"
              label="HP"
            />
          </div>
          <div className="bg-white/5 border border-[#333] p-3 rounded text-center">
            <div className="text-stone-500 text-xs uppercase tracking-widest">AC</div>
            <div className="text-2xl font-bold text-white">{stats.ac}</div>
          </div>
          <div className="bg-white/5 border border-[#333] p-3 rounded text-center">
            <div className="text-stone-500 text-xs uppercase tracking-widest">Initiative</div>
            <div className="text-2xl font-bold text-amber-400">{formatModifier(stats.initiative)}</div>
          </div>
          <div className="bg-white/5 border border-[#333] p-3 rounded text-center">
            <div className="text-stone-500 text-xs uppercase tracking-widest">Speed</div>
            <div className="text-2xl font-bold text-white">{stats.speed} <span className="text-xs text-stone-500">ft</span></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="saves-heading">
        <h2 id="saves-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Saving Throws
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {SAVES.map(({ key, label, ability }) => (
            <div key={key} className="bg-white/5 border border-[#333] p-3 rounded text-center">
              <div className="text-amber-500 text-xs uppercase tracking-widest">{label}</div>
              <div className="text-xl text-white font-bold">{formatModifier(stats[key])}</div>
              <div className="text-stone-600 text-[10px]">({ability})</div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="perception-heading">
        <h2 id="perception-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Perception
        </h2>
        <div className="bg-white/5 border border-[#333] p-3 rounded flex items-center justify-between">
          <span className="text-stone-500 text-xs uppercase tracking-widest">Perception</span>
          <span className="text-xl font-bold text-white">{formatModifier(stats.perception)}</span>
        </div>
      </section>

      <section aria-labelledby="proficiency-heading">
        <h2 id="proficiency-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Proficiency
        </h2>
        <div className="bg-white/5 border border-[#333] p-3 rounded flex items-center justify-between">
          <div>
            <span className="text-stone-500 text-xs uppercase tracking-widest">Level</span>
            <span className="text-xl font-bold text-white ml-3">{character.level || 1}</span>
          </div>
          <div>
            <span className="text-amber-500 text-xs uppercase tracking-widest">Proficiency</span>
            <span className="text-xl font-bold text-amber-400 ml-3">+{stats.proficiencyBonus}</span>
          </div>
        </div>
      </section>
    </div>
  );
}