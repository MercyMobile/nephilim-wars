import React, { useState, useEffect } from 'react';
import { getPartyRoster, removeFromPartyRoster, getActiveParty, setActiveParty } from '../utils/storage';

const PartyManager = ({ onClose, onPartySelected }) => {
  const [roster, setRoster] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    // Load roster and active party
    setRoster(getPartyRoster());
    setSelectedIds(getActiveParty());
  }, []);

  const toggleCharacter = (charId) => {
    if (selectedIds.includes(charId)) {
      setSelectedIds(selectedIds.filter(id => id !== charId));
    } else {
      // Limit to 8 characters
      if (selectedIds.length < 8) {
        setSelectedIds([...selectedIds, charId]);
      }
    }
  };

  const handleDelete = (charId) => {
    if (confirm('Are you sure you want to delete this character?')) {
      removeFromPartyRoster(charId);
      setRoster(roster.filter(c => c.id !== charId));
      setSelectedIds(selectedIds.filter(id => id !== charId));
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) {
      alert('Please select at least one character for your party!');
      return;
    }

    setActiveParty(selectedIds);

    // Get the actual character objects for the selected IDs
    const party = roster.filter(c => selectedIds.includes(c.id));

    if (onPartySelected) {
      onPartySelected(party);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1c1917] border-2 border-[#78350f] w-full max-w-6xl rounded-lg shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#78350f] to-[#92400e] p-4 sm:p-6 text-center border-b border-[#78350f]">
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fcd34d]">PARTY ROSTER</h2>
          <p className="text-[#d6d3d1] text-sm mt-2">Select up to 8 characters for combat</p>
          <p className="text-[#a8a29e] text-xs mt-1">Selected: {selectedIds.length}/8</p>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {roster.length === 0 ? (
            <div className="text-center text-stone-500 py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-xl">No characters in your roster yet!</p>
              <p className="text-sm mt-2">Create characters in the Character Generator</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roster.map((char) => {
                const isSelected = selectedIds.includes(char.id);

                return (
                  <div
                    key={char.id}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                        : 'border-[#44403c] hover:border-[#78350f]'
                    }`}
                    onClick={() => toggleCharacter(char.id)}
                  >
                    {/* Portrait */}
                    {char.portrait && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={char.portrait}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            ✓
                          </div>
                        )}
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4 bg-[#0c0a09]">
                      <h3 className="text-lg font-cinzel font-bold text-amber-500 mb-1">{char.name}</h3>
                      <p className="text-sm text-stone-400 mb-2">
                        {char.lineage} • {char.class}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-2 mb-3 text-xs">
                        <div className="bg-red-900/30 px-2 py-1 rounded">HP: {char.maxHp}</div>
                        <div className="bg-blue-900/30 px-2 py-1 rounded">DEF: {char.defense}</div>
                        <div className="bg-amber-900/30 px-2 py-1 rounded">INIT: +{char.initiativeBonus}</div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(char.id);
                        }}
                        className="w-full py-2 bg-red-900/30 border border-red-800 text-red-400 text-xs font-bold rounded hover:bg-red-900/50 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-[#0c0a09] border-t border-[#44403c] flex gap-4 justify-center flex-wrap">
          <button
            onClick={onClose}
            className="px-6 sm:px-8 py-3 bg-[#44403c] border border-[#78716c] text-white font-bold rounded hover:bg-[#57534e] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className={`px-6 sm:px-8 py-3 font-bold rounded transition ${
              selectedIds.length === 0
                ? 'bg-gray-700 border border-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-900 border border-green-600 text-green-100 hover:bg-green-800 shadow-[0_0_20px_rgba(22,163,74,0.3)]'
            }`}
          >
            Enter Combat with Party →
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center z-10"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PartyManager;
