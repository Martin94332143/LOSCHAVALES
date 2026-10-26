import React from 'react';

export const PromoHero: React.FC = () => {
  return (
    <div className="bg-white border-b border-stone-200/80 py-3.5 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Highlight Banner matching image: Todas con papas fritas 100% caseras */}
        <div className="bg-amber-50/70 text-stone-900 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-xs border-2 border-amber-300">
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center text-2xl shrink-0 shadow-xs">
            🍟
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-950 tracking-tight flex items-center gap-1.5 font-display">
              ¡Todas con Papas Fritas!
            </h3>
            <p className="text-xs text-stone-600">
              Vienen incluidas en cada hamburguesa y sándwich de mechada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
