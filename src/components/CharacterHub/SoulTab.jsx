import React, { useState } from 'react';
import { getNetRighteousness, getSoulTier } from '../../utils/soulEconomy';

const TIER_STYLES = {
  Blessed: 'bg-gradient-to-r from-yellow-600 to-amber-400 text-black',
  Righteous: 'bg-blue-600 text-white',
  Neutral: 'bg-stone-700 text-stone-300',
  Tainted: 'bg-orange-700 text-white',
  Corrupted: 'bg-red-800 text-white',
  Forsaken: 'bg-red-950 text-red-400',
};

const TIER_NET_COLORS = {
  Blessed: 'text-amber-400',
  Righteous: 'text-blue-400',
  Neutral: 'text-stone-400',
  Tainted: 'text-orange-400',
  Corrupted: 'text-red-400',
  Forsaken: 'text-red-500',
};

function formatRelativeTime(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function SoulTab({ character, updateCharacter }) {
  const [customRpAmount, setCustomRpAmount] = useState('');
  const [customCpAmount, setCustomCpAmount] = useState('');
  const [rpReason, setRpReason] = useState('');
  const [cpReason, setCpReason] = useState('');
  const [tierExpanded, setTierExpanded] = useState(false);
  const [confirmAdjustment, setConfirmAdjustment] = useState(null);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-full text-stone-600 italic font-cinzel">
        Select a character to view their soul economy.
      </div>
    );
  }

  const se = character.soulEconomy || { rp: 0, cp: 0, spendingLog: [] };
  const rp = se.rp || 0;
  const cp = se.cp || 0;
  const net = getNetRighteousness(rp, cp);
  const tier = getSoulTier(rp, cp);
  const tierName = tier?.name || 'Neutral';
  const tierEffects = tier?.effects || {};
  const log = (se.spendingLog || []).slice(-10).reverse();

  function adjustRp(delta, reason) {
    const absDelta = Math.abs(delta);
    if (absDelta > 5 && !confirmAdjustment) {
      setConfirmAdjustment({ type: 'rp', delta, reason });
      return;
    }
    const newRp = Math.max(0, rp + delta);
    const newSe = {
      ...se,
      rp: newRp,
      spendingLog: [
        ...(se.spendingLog || []),
        { type: 'rp', amount: delta, reason: reason || (delta > 0 ? 'Manual gain' : 'Manual spend'), timestamp: new Date().toISOString() },
      ],
    };
    updateCharacter({ soulEconomy: newSe });
    setConfirmAdjustment(null);
    setCustomRpAmount('');
    setRpReason('');
  }

  function adjustCp(delta, reason) {
    const absDelta = Math.abs(delta);
    if (absDelta > 5 && !confirmAdjustment) {
      setConfirmAdjustment({ type: 'cp', delta, reason });
      return;
    }
    const newCp = Math.max(0, cp + delta);
    const newSe = {
      ...se,
      cp: newCp,
      spendingLog: [
        ...(se.spendingLog || []),
        { type: 'cp', amount: delta, reason: reason || (delta > 0 ? 'Manual gain' : 'Manual reduction'), timestamp: new Date().toISOString() },
      ],
    };
    updateCharacter({ soulEconomy: newSe });
    setConfirmAdjustment(null);
    setCustomCpAmount('');
    setCpReason('');
  }

  function handleCustomRp() {
    const amount = parseInt(customRpAmount, 10);
    if (isNaN(amount) || amount === 0) return;
    adjustRp(amount, rpReason || `Custom adjustment: ${amount > 0 ? '+' : ''}${amount} RP`);
  }

  function handleCustomCp() {
    const amount = parseInt(customCpAmount, 10);
    if (isNaN(amount) || amount === 0) return;
    adjustCp(amount, cpReason || `Custom adjustment: ${amount > 0 ? '+' : ''}${amount} CP`);
  }

  function handleConfirmAdjustment(confirm) {
    if (confirm.type === 'rp') {
      adjustRp(confirm.delta, confirm.reason);
    } else {
      adjustCp(confirm.delta, confirm.reason);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 font-garamond text-stone-200">

      {confirmAdjustment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="font-cinzel text-amber-400 text-lg mb-2">Confirm Adjustment</h3>
            <p className="text-stone-300 mb-4">
              {confirmAdjustment.type === 'rp' ? 'Righteousness' : 'Corruption'} Points will change by{' '}
              <span className={confirmAdjustment.type === 'rp' ? 'text-blue-400' : 'text-red-400'}>
                {confirmAdjustment.delta > 0 ? '+' : ''}{confirmAdjustment.delta}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmAdjustment(confirmAdjustment)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-cinzel text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmAdjustment(null)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded font-cinzel text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <div className="text-blue-400 font-bold text-sm uppercase tracking-wide">Righteousness Points</div>
          <div className="text-3xl text-blue-300 font-bold mt-1">{rp}</div>
          <div className="text-xs text-stone-500 mt-1">Spend to reroll, heal allies, resist corruption</div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => adjustRp(-1)}
              className="w-9 h-9 flex items-center justify-center bg-blue-950 hover:bg-blue-900 border border-blue-700 rounded text-blue-300 font-bold"
            >
              -1
            </button>
            <button
              onClick={() => adjustRp(1)}
              className="w-9 h-9 flex items-center justify-center bg-blue-950 hover:bg-blue-900 border border-blue-700 rounded text-blue-300 font-bold"
            >
              +1
            </button>
          </div>
        </div>

        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <div className="text-red-600 font-bold text-sm uppercase tracking-wide">Corruption Points</div>
          <div className="text-3xl text-red-300 font-bold mt-1">{cp}</div>
          <div className="text-xs text-stone-500 mt-1">High CP reduces Initiative, opens demonic influence</div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => adjustCp(-1)}
              className="w-9 h-9 flex items-center justify-center bg-red-950 hover:bg-red-900 border border-red-700 rounded text-red-300 font-bold"
            >
              -1
            </button>
            <button
              onClick={() => adjustCp(1)}
              className="w-9 h-9 flex items-center justify-center bg-red-950 hover:bg-red-900 border border-red-700 rounded text-red-300 font-bold"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className={`text-4xl font-cinzel ${TIER_NET_COLORS[tierName] || 'text-stone-400'}`}>
          {net >= 0 ? '+' : ''}{net}
        </div>
        <div className="text-stone-500 text-xs uppercase tracking-widest mt-1">Net Righteousness</div>
        <span className={`inline-block mt-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide ${TIER_STYLES[tierName] || TIER_STYLES.Neutral}`}>
          {tierName}
        </span>
      </div>

      <section aria-labelledby="tier-effects-heading">
        <button
          onClick={() => setTierExpanded(!tierExpanded)}
          className="w-full flex items-center justify-between font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2"
        >
          <span id="tier-effects-heading">Tier Effects</span>
          <span className="text-stone-500">{tierExpanded ? '▲' : '▼'}</span>
        </button>
        {tierExpanded && (
          <div className="mt-3 space-y-2 text-sm">
            {tierEffects.description && (
              <p className="text-stone-400 italic">{tierEffects.description}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white/5 border border-[#333] rounded p-2">
                <span className="text-blue-400 font-bold">Divine Miracles:</span>{' '}
                <span className="text-stone-300">{tierEffects.divineMiracles || 'none'}</span>
              </div>
              <div className="bg-white/5 border border-[#333] rounded p-2">
                <span className="text-purple-400 font-bold">Watcher Magic:</span>{' '}
                <span className="text-stone-300">{tierEffects.watcherMagic || 'none'}</span>
              </div>
              <div className="bg-white/5 border border-[#333] rounded p-2">
                <span className="text-amber-400 font-bold">Initiative Mod:</span>{' '}
                <span className="text-stone-300">{tierEffects.initiativeModifier >= 0 ? '+' : ''}{tierEffects.initiativeModifier ?? 0}</span>
              </div>
              <div className="bg-white/5 border border-[#333] rounded p-2">
                <span className="text-green-400 font-bold">Save Bonus:</span>{' '}
                <span className="text-stone-300">{tierEffects.saveBonus >= 0 ? '+' : ''}{tierEffects.saveBonus ?? 0}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="spending-log-heading">
        <h2 id="spending-log-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Spending Log
        </h2>
        {log.length === 0 ? (
          <p className="text-stone-600 italic text-sm">No transactions yet.</p>
        ) : (
          <div className="max-h-48 overflow-y-auto space-y-1">
            {log.map((entry, i) => (
              <div key={entry.timestamp + '-' + i} className="flex items-center gap-2 bg-white/5 border border-[#333] rounded p-2 text-sm">
                <span className="text-stone-600 text-xs w-16 shrink-0">
                  {formatRelativeTime(entry.timestamp)}
                </span>
                <span className="shrink-0">
                  {entry.type === 'rp' ? '🔵' : '🔴'}
                </span>
                <span className="text-stone-400 flex-1 truncate">
                  {entry.reason || (entry.type === 'rp' ? 'RP adjustment' : 'CP adjustment')}
                </span>
                <span className={`font-bold ${entry.type === 'rp' ? 'text-blue-400' : 'text-red-400'}`}>
                  {entry.amount > 0 ? '+' : ''}{entry.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="adjustment-heading">
        <h2 id="adjustment-heading" className="font-cinzel text-amber-500 text-sm uppercase tracking-widest border-b border-amber-900/40 pb-2 mb-3">
          Adjust Points
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/20 border border-blue-900/40 rounded-lg p-3">
            <div className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-2">RP Adjustment</div>
            <div className="flex gap-2 mb-2">
              {[-5, -1, 1, 5].map((amt) => (
                <button
                  key={amt}
                  onClick={() => adjustRp(amt)}
                  className={`px-3 py-1.5 rounded text-sm font-bold ${
                    amt > 0
                      ? 'bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-300'
                      : 'bg-blue-950/50 hover:bg-blue-950 border border-blue-800 text-blue-400'
                  }`}
                >
                  {amt > 0 ? '+' : ''}{amt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={customRpAmount}
                onChange={(e) => setCustomRpAmount(e.target.value)}
                placeholder="Amount"
                className="w-20 bg-stone-900 border border-blue-800 rounded px-2 py-1 text-sm text-blue-300 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={rpReason}
                onChange={(e) => setRpReason(e.target.value)}
                placeholder="Reason"
                className="flex-1 bg-stone-900 border border-blue-800 rounded px-2 py-1 text-sm text-stone-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleCustomRp}
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm text-white font-bold"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-900/40 rounded-lg p-3">
            <div className="text-red-500 text-xs uppercase tracking-widest font-bold mb-2">CP Adjustment</div>
            <div className="flex gap-2 mb-2">
              {[-5, -1, 1, 5].map((amt) => (
                <button
                  key={amt}
                  onClick={() => adjustCp(amt)}
                  className={`px-3 py-1.5 rounded text-sm font-bold ${
                    amt > 0
                      ? 'bg-red-950 hover:bg-red-900 border border-red-700 text-red-300'
                      : 'bg-red-950/50 hover:bg-red-950 border border-red-800 text-red-400'
                  }`}
                >
                  {amt > 0 ? '+' : ''}{amt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={customCpAmount}
                onChange={(e) => setCustomCpAmount(e.target.value)}
                placeholder="Amount"
                className="w-20 bg-stone-900 border border-red-800 rounded px-2 py-1 text-sm text-red-300 focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                value={cpReason}
                onChange={(e) => setCpReason(e.target.value)}
                placeholder="Reason"
                className="flex-1 bg-stone-900 border border-red-800 rounded px-2 py-1 text-sm text-stone-300 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={handleCustomCp}
                className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm text-white font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}