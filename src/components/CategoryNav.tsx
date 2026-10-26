import React from 'react';
import { Category, CategoryId, MenuItem } from '../types';

interface CategoryNavProps {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategory: CategoryId | 'todos';
  onSelectCategory: (id: CategoryId | 'todos') => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  menuItems,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="sticky top-[61px] sm:top-[69px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onSelectCategory('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'todos'
                ? 'bg-amber-400 text-stone-950 font-black shadow-xs border border-amber-400'
                : 'bg-white text-stone-700 hover:bg-amber-50 hover:text-stone-950 border border-stone-200 hover:border-amber-300'
            }`}
          >
            <span>✨</span>
            <span>Todo el Menú</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === 'todos'
                  ? 'bg-amber-500/40 text-stone-950 font-black'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {menuItems.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = menuItems.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-black shadow-xs border border-amber-400'
                    : 'bg-white text-stone-700 hover:bg-amber-50 hover:text-stone-950 border border-stone-200 hover:border-amber-300'
                }`}
              >
                <span>{cat.icon || '🍽️'}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-amber-500/40 text-stone-950 font-black' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
