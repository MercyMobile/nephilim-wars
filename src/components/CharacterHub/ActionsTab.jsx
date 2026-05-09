import React, { useState } from 'react';
import { CLASSES } from '../../data/classes';

const TYPE_ICONS = {
  melee: '⚔️',
  ranged: '🏹',
  spell: '📖',
  miracle: '✨',
};

const ACTION_PIPS = {
  1: '▶',
  2: '▶▶',
  3: '▶▶▶',
  bonus: '◆',
  reaction: '⟳',
};

function getCharClass(character) {
  if (!character?.class) return null;
  return CLASSES.find((c) => c.value === character.class) || null;
}

function getFeaturesForLevel(classData, level) {
  if (!classData?.features) return [];
  const features = [];
  for (let lv = 1; lv <= level; lv++) {
    if (classData.features[lv]) {
      features.push(...classData.features[lv].map((f) => ({ ...f, level: lv })));
    }
  }
  return features;
}

function ActionCard({ action }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-[#1c1917] border border-stone-800 rounded-lg p-3 hover:border-amber-900 cursor-pointer transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{TYPE_ICONS[action.type] || TYPE_ICONS[action.actionType] || '⚔️'}</span>
          <span className="text-amber-400 font-bold">{action.name}</span>
          {action.actionCost && (
            <span className="text-stone-500 text-xs ml-1">
              {ACTION_PIPS[action.actionCost] || action.actionCost}
            </span>
          )}
        </div>
        {action.damageDice && (
          <span className="text-stone-300 text-sm">
            {action.damageDice} {action.damageType}
          </span>
        )}
      </div>
      {action.useStat && (
        <div className="text-stone-400 text-xs mt-0.5">
          {action.useStat}{action.toHit ? ` +${action.toHit}` : ''}
        </div>
      )}
      {expanded && action.desc && (
        <div className="text-stone-400 text-sm mt-2 pt-2 border-t border-stone-700">
          {action.desc}
        </div>
      )}
    </div>
  );
}

function FeatureCard({ feature }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-[#1c1917] border border-stone-800 rounded-lg p-3 hover:border-amber-900 cursor-pointer transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <span className="text-amber-400 font-bold text-sm">{feature.name}</span>
        <div className="flex items-center gap-2">
          {feature.actionCost && (
            <span className="text-stone-500 text-xs">
              {ACTION_PIPS[feature.actionCost] || feature.actionCost}
            </span>
          )}
          <span className="text-stone-600 text-xs">Lv {feature.level}</span>
        </div>
      </div>
      {expanded && (
        <div className="text-stone-400 text-sm mt-2 pt-2 border-t border-stone-700">
          {feature.description}
        </div>
      )}
    </div>
  );
}

export default function ActionsTab({ character }) {
  if (!character) {
    return (
      <div className="flex items-center justify-center h-full text-stone-600 italic font-cinzel">
        Select a character to view their actions.
      </div>
    );
  }

  const classData = getCharClass(character);
  const level = character.level || 1;

  const equippedWeapons = (character.equipment || []).filter(
    (e) => e.type === 'melee' || e.type === 'ranged'
  );

  const spells = (character.equipment || []).filter((e) => e.type === 'spell');

  const ancestryFeats = character.ancestryFeats || [];

  const isMagi = character.class === 'Magi';
  const isPriest = character.class === 'Priest';

  const classFeatures = classData ? getFeaturesForLevel(classData, level) : [];

  return (
    <div className="p-4 md:p-6 space-y-6 font-garamond text-stone-200">

      {equippedWeapons.length > 0 && (
        <section aria-labelledby="combat-actions-heading">
          <h2 id="combat-actions-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
            Combat Actions
          </h2>
          <div className="space-y-2">
            {equippedWeapons.map((weapon, i) => (
              <ActionCard key={weapon.id || i} action={weapon} />
            ))}
          </div>
        </section>
      )}

      {classFeatures.length > 0 && (
        <section aria-labelledby="class-features-heading">
          <h2 id="class-features-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
            Class Features
          </h2>
          <div className="space-y-2">
            {classFeatures.map((feature, i) => (
              <FeatureCard key={feature.name + '-' + i} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {ancestryFeats.length > 0 && (
        <section aria-labelledby="ancestry-feats-heading">
          <h2 id="ancestry-feats-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
            Ancestry Feats
          </h2>
          <div className="space-y-2">
            {ancestryFeats.map((feat, i) => (
              <div key={feat.name || i} className="bg-[#1c1917] border border-stone-800 rounded-lg p-3 hover:border-amber-900 transition-colors">
                <div className="text-amber-400 font-bold text-sm">{feat.name}</div>
                {feat.description && (
                  <div className="text-stone-400 text-sm mt-1">{feat.description}</div>
                )}
                {feat.effect && (
                  <div className="text-stone-500 text-xs mt-1">{feat.effect}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {isMagi && spells.length > 0 && (
        <section aria-labelledby="spells-heading">
          <h2 id="spells-heading" className="font-cinzel text-purple-500 text-sm uppercase tracking-widest border-b border-purple-900/40 pb-2 mb-3">
            Forbidden Sorcery
          </h2>
          <div className="space-y-2">
            {spells.map((spell, i) => {
              const cpRisk = spell.cpRisk || (spell.soulTag === 'CP_risk' ? 1 : null);
              return (
                <ActionCard
                  key={spell.id || i}
                  action={{
                    ...spell,
                    type: 'spell',
                  }}
                />
              );
            })}
            {spells.filter((s) => s.soulTag === 'CP_risk').length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {spells.filter((s) => s.soulTag === 'CP_risk').map((spell, i) => (
                  <span key={spell.id || i} className="bg-red-900/40 border border-red-700 text-red-300 text-xs px-2 py-0.5 rounded">
                    {spell.name}: CP Risk: {spell.cpRisk || 1}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {isPriest && spells.length > 0 && (
        <section aria-labelledby="miracles-heading">
          <h2 id="miracles-heading" className="font-cinzel text-blue-400 text-sm uppercase tracking-widest border-b border-blue-900/40 pb-2 mb-3">
            Divine Miracles
          </h2>
          <div className="space-y-2">
            {spells.map((spell, i) => {
              const rpCost = spell.rpCost || (spell.soulTag === 'RP_cost' ? 1 : null);
              return (
                <ActionCard
                  key={spell.id || i}
                  action={{
                    ...spell,
                    type: 'miracle',
                  }}
                />
              );
            })}
            {spells.filter((s) => s.soulTag === 'RP_cost').length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {spells.filter((s) => s.soulTag === 'RP_cost').map((spell, i) => (
                  <span key={spell.id || i} className="bg-blue-900/40 border border-blue-700 text-blue-300 text-xs px-2 py-0.5 rounded">
                    {spell.name}: RP Cost: {spell.rpCost || 1}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {!isMagi && !isPriest && spells.length > 0 && (
        <section aria-labelledby="spells-other-heading">
          <h2 id="spells-other-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
            Spells & Abilities
          </h2>
          <div className="space-y-2">
            {spells.map((spell, i) => (
              <ActionCard key={spell.id || i} action={spell} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}