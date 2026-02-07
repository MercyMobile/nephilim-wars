import React, { useState, useEffect, useCallback } from 'react';

const DiceRollerModal = ({ isOpen, onClose, diceType = 'd20', onResult }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [animValue, setAnimValue] = useState(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setRolling(false);
      setAnimValue(null);
    }
  }, [isOpen]);

  // Animate random numbers while rolling
  useEffect(() => {
    if (!rolling) return;
    const sides = parseInt(diceType.replace('d', ''));
    const interval = setInterval(() => {
      setAnimValue(Math.floor(Math.random() * sides) + 1);
    }, 80);
    return () => clearInterval(interval);
  }, [rolling, diceType]);

  const handleRoll = useCallback(() => {
    if (rolling || result) return;
    setRolling(true);
    setResult(null);

    // Roll after animation
    setTimeout(() => {
      const sides = parseInt(diceType.replace('d', ''));
      const rollResult = Math.floor(Math.random() * sides) + 1;
      setResult(rollResult);
      setRolling(false);
      setAnimValue(null);

      if (onResult) {
        onResult(rollResult);
      }
    }, 1200);
  }, [rolling, result, diceType, onResult]);

  if (!isOpen) return null;

  const isCrit = result === 20;
  const isFumble = result === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-50 bg-stone-900 text-amber-500 border-2 border-amber-900 w-10 h-10 rounded-full hover:bg-black transition font-bold text-lg"
        >
          X
        </button>

        {/* Main Card */}
        <div className="bg-[#0c0a09] border-4 border-amber-900 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.2)]">

          {/* Header */}
          <div className="bg-amber-900/30 border-b border-amber-900 px-6 py-4 text-center">
            <div className="text-amber-500 font-cinzel font-bold text-xl tracking-wider">
              COMBAT ROLL
            </div>
            <div className="text-stone-400 text-sm mt-1">
              {diceType.toUpperCase()}
            </div>
          </div>

          {/* Dice Display Area */}
          <div className="px-6 py-10 flex flex-col items-center justify-center min-h-[280px]">

            {/* Before rolling - show clickable die */}
            {!rolling && !result && (
              <button
                onClick={handleRoll}
                className="group flex flex-col items-center gap-4 cursor-pointer transition-all hover:scale-105"
              >
                <div className="w-36 h-36 bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-all rotate-12 group-hover:rotate-0">
                  <span className="text-amber-400 font-cinzel font-bold text-5xl">
                    {diceType.toUpperCase().replace('D', 'd')}
                  </span>
                </div>
                <div className="text-amber-500 font-cinzel font-bold text-xl animate-pulse">
                  TAP TO ROLL
                </div>
              </button>
            )}

            {/* While rolling - animated numbers */}
            {rolling && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-36 h-36 bg-gradient-to-br from-amber-900 to-amber-950 border-4 border-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-spin-slow">
                  <span className="text-amber-300 font-cinzel font-bold text-6xl">
                    {animValue || '?'}
                  </span>
                </div>
                <div className="text-amber-400 font-cinzel font-bold text-lg">
                  Rolling...
                </div>
              </div>
            )}

            {/* Result */}
            {result && !rolling && (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className={`w-40 h-40 rounded-2xl flex items-center justify-center border-4 shadow-lg transition-all ${
                  isCrit ? 'bg-gradient-to-br from-yellow-700 to-amber-900 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.6)]' :
                  isFumble ? 'bg-gradient-to-br from-red-900 to-red-950 border-red-500 shadow-[0_0_60px_rgba(220,38,38,0.6)]' :
                  'bg-gradient-to-br from-amber-900 to-amber-950 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]'
                }`}>
                  <span className={`font-cinzel font-bold text-7xl ${
                    isCrit ? 'text-yellow-300' :
                    isFumble ? 'text-red-400' :
                    'text-amber-300'
                  }`}>
                    {result}
                  </span>
                </div>

                {/* Crit / Fumble label */}
                {isCrit && (
                  <div className="text-yellow-400 font-cinzel font-bold text-2xl animate-pulse">
                    NATURAL 20 - CRITICAL!
                  </div>
                )}
                {isFumble && (
                  <div className="text-red-500 font-cinzel font-bold text-2xl animate-pulse">
                    NATURAL 1 - FUMBLE!
                  </div>
                )}
                {!isCrit && !isFumble && (
                  <div className="text-amber-400 font-cinzel font-bold text-xl">
                    ROLLED: {result}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer - Close after result */}
          {result && (
            <div className="border-t border-amber-900/50 px-6 py-4 text-center">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-amber-900 border border-amber-600 text-amber-100 font-cinzel font-bold rounded hover:bg-amber-800 transition"
              >
                CONTINUE
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 0.6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default DiceRollerModal;
