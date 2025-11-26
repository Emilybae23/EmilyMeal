import React from 'react';
import { Meal, MealLight } from '../types';
import { Clock, Tag, Utensils } from 'lucide-react';

interface RecipeCardProps {
  meal: Meal | MealLight;
  onClick: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ meal, onClick }) => {
  // Type guard to check if we have full meal details (for category/area)
  const isFullMeal = (m: Meal | MealLight): m is Meal => {
    return (m as Meal).strCategory !== undefined;
  };

  return (
    <div 
      onClick={() => onClick(meal.idMeal)}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={meal.strMealThumb} 
          alt={meal.strMeal} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium">View Recipe</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {meal.strMeal}
        </h3>
        
        {isFullMeal(meal) ? (
          <div className="flex flex-wrap gap-2 mt-auto">
            {meal.strCategory && (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                <Utensils className="w-3 h-3 mr-1" />
                {meal.strCategory}
              </span>
            )}
            {meal.strArea && (
              <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                <Tag className="w-3 h-3 mr-1" />
                {meal.strArea}
              </span>
            )}
          </div>
        ) : (
           <div className="mt-auto pt-2">
             <span className="text-sm text-slate-500 dark:text-slate-400 italic">
               Click to see details
             </span>
           </div>
        )}
      </div>
    </div>
  );
};
