import React from 'react';

const InitiativeRibbon = ({ queue, combatants, activeId }) => {
  return (
    <div className="w-full h-24 bg-gray-900 border-b-4 border-amber-700 overflow-x-auto flex items-center px-4 gap-4 shadow-xl hide-scrollbar">
      {queue.map((id, index) => {
        const char = combatants.find(c => c.id === id);
        if (!char) return null;
        
        const isActive = id === activeId;
        
        return (
          <div key={`${id}-${index}`} className={`relative flex-shrink-0 transition-all duration-500 ${isActive ? 'scale-110 z-10' : 'opacity-60 scale-90'}`}>
            {/* Turn Order Badge */}
            <div className="absolute -top-2 -left-2 bg-black text-amber-500 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border border-amber-500 z-20">
              {index + 1}
            </div>
            
            {/* Portrait Frame */}
            <div className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${isActive ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'border-gray-600 grayscale'}`}>
              <img 
                src={char.portrait || "https://placehold.co/100x100"} 
                alt={char.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Name Tag */}
            {isActive && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-900/90 text-amber-100 text-[10px] px-2 py-0.5 rounded whitespace-nowrap uppercase tracking-widest font-bold border border-amber-700/50">
                {char.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InitiativeRibbon;