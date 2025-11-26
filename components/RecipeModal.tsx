import React, { useEffect } from 'react';
import { Meal } from '../types';
import { X, Youtube, MapPin, ChefHat, ExternalLink } from 'lucide-react';

interface RecipeModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ meal, isOpen, onClose, isLoading }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Function to extract ingredients and measurements
  const getIngredients = (meal: Meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = (meal as any)[`strIngredient${i}`];
      const measure = (meal as any)[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient,
          measure: measure || ''
        });
      }
    }
    return ingredients;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-[fadeIn_0.3s_ease-out]">
        
        {/* Modal Header (Fixed) */}
        <div className="relative flex-shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            {isLoading ? (
               <div className="h-64 bg-slate-200 dark:bg-slate-800 animate-pulse w-full"></div>
            ) : meal ? (
              <div className="relative h-48 sm:h-64 md:h-72 w-full">
                <img 
                  src={meal.strMealThumb} 
                  alt={meal.strMeal} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
                   <div className="p-6 w-full">
                      <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 shadow-sm">{meal.strMeal}</h2>
                      <div className="flex flex-wrap gap-3">
                         {meal.strCategory && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm">
                              <ChefHat className="w-4 h-4 mr-1.5" />
                              {meal.strCategory}
                            </span>
                         )}
                         {meal.strArea && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-sm">
                              <MapPin className="w-4 h-4 mr-1.5" />
                              {meal.strArea}
                            </span>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            ) : null}
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          {isLoading ? (
             <div className="space-y-4">
               <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
               <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full animate-pulse"></div>
               <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
             </div>
          ) : meal ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Ingredients */}
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    Ingredients
                  </h3>
                  <div className="bg-orange-50 dark:bg-slate-800/50 rounded-xl p-5 border border-orange-100 dark:border-slate-700">
                    <ul className="space-y-3">
                      {getIngredients(meal).map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm md:text-base text-slate-700 dark:text-slate-300">
                          <span className="w-2 h-2 mt-2 mr-3 bg-orange-400 rounded-full flex-shrink-0"></span>
                          <span>
                            <span className="font-semibold">{item.measure}</span> {item.ingredient}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-col gap-3">
                   {meal.strYoutube && (
                     <a 
                       href={meal.strYoutube} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                     >
                       <Youtube className="w-5 h-5" />
                       Watch Video
                     </a>
                   )}
                   {meal.strSource && (
                     <a 
                       href={meal.strSource} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium"
                     >
                       <ExternalLink className="w-4 h-4" />
                       Source
                     </a>
                   )}
                </div>
              </div>

              {/* Right Column: Instructions */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Instructions</h3>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {meal.strInstructions}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              Recipe details not found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
