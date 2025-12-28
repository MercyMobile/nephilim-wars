import React from 'react';
// Make sure you ran: npm install lucide-react
import { Sword, Zap, Shield } from 'lucide-react'; 

const ActionDeck = ({ activeChar, onAction }) => {
  // 1. If it's the Enemy's turn, show a waiting message
  if (!activeChar?.isPlayer) {
    return (
      <div className="h-32 flex items-center justify-center border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <p className="text-gray-500 animate-pulse italic flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"/> 
          Enemy is thinking...
        </p>
      </div>
    );
  }

  // 2. If it's the Player's turn, show the cards
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center gap-6 items-end bg-gradient-to-t from-black via-gray-900/90 to-transparent pb-8">
      {activeChar.actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action)}
          className="group relative flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-4 hover:scale-105 outline-none focus:scale-105"
        >
          {/* The Card Body */}
          <div className="w-28 h-40 bg-stone-900 border-2 border-amber-800 rounded-xl shadow-2xl flex flex-col items-center p-3 group-hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all overflow-hidden relative">
            
            {/* Card Texture Overlay (Optional detail) */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            {/* Icon */}
            <div className="text-amber-500 mb-2 mt-2 transform group-hover:scale-110 transition-transform">
              {action.type === 'melee' ? <Sword size={32} /> : 
               action.type === 'ranged' ? <Zap size={32} /> : <Shield size={32} />}
            </div>
            
            {/* Name */}
            <span className="text-xs font-bold text-amber-100 text-center leading-tight mb-auto uppercase tracking-wide z-10">
              {action.name}
            </span>

            {/* Stats Box */}
            <div className="w-full bg-black/60 rounded px-1 py-2 text-center mt-1 border border-white/10 z-10">
              <div className="text-xl font-black text-white font-mono">{action.damageDice}</div>
              <div className="text-[8px] text-stone-400 uppercase tracking-wider">{action.damageType}</div>
            </div>
          </div>

          {/* Action Point Cost Badge */}
          <div className="absolute -top-3 -right-3 bg-blue-700 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400 group-hover:bg-blue-600 transition-colors z-20">
            {action.cost} AP
          </div>
        </button>
      ))}
    </div>
  );
};

export default ActionDeck;