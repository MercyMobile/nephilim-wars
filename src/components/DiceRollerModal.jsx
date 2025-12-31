import React, { useState, useRef, useEffect } from 'react';

const DiceRollerModal = ({ isOpen, onClose, diceType = 'd20', onResult }) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setRolling(false);
    } else {
      // Force iframe to reload with new cache-busting key when modal opens
      setIframeKey(Date.now());
    }
  }, [isOpen]);

  const handleRoll = () => {
    setRolling(true);
    setResult(null);

    // Send message to iframe to roll dice
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        action: 'roll',
        diceType: diceType
      }, '*');
    }

    // Simulate roll result (in a real implementation, the iframe would send back the result)
    setTimeout(() => {
      const sides = parseInt(diceType.replace('d', ''));
      const rollResult = Math.floor(Math.random() * sides) + 1;
      setResult(rollResult);
      setRolling(false);

      // Call the callback with the result immediately
      // Don't auto-close - let user close manually
      if (onResult) {
        onResult(rollResult);
      }
    }, 2000); // Dice rolling animation time
  };

  // Auto-roll when modal opens
  useEffect(() => {
    if (isOpen && !rolling && !result) {
      handleRoll();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-[#0c0a09] border-4 border-amber-900 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-stone-900/80 text-amber-500 border border-amber-900 px-4 py-2 rounded hover:bg-black transition font-cinzel font-bold"
        >
          ✕ Close
        </button>

        {/* Dice Title */}
        <div className="absolute top-4 left-4 z-50 bg-stone-900/80 border border-amber-900 px-6 py-3 rounded">
          <div className="text-amber-500 font-cinzel font-bold text-2xl">
            {rolling ? 'Rolling...' : result ? `Result: ${result}` : `Roll ${diceType.toUpperCase()}`}
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <div className="bg-black/80 border-4 border-amber-500 rounded-lg p-8 shadow-[0_0_50px_rgba(245,158,11,0.8)]">
              <div className="text-center">
                <div className="text-amber-500 font-cinzel font-bold text-xl mb-2">ROLLED</div>
                <div className="text-amber-400 font-cinzel font-bold text-8xl animate-bounce">
                  {result}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Dice Roller Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={`/dice.html?v=${iframeKey}`}
          title="3D Dice Roller"
          className="w-full h-full border-none"
          allow="scripts"
        />
      </div>
    </div>
  );
};

export default DiceRollerModal;
