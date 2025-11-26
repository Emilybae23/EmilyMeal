import React, { useState, useEffect, useCallback } from 'react';
import { Search, Moon, Sun, UtensilsCrossed, ChefHat, Filter } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { searchMealsByName, filterMealsByIngredient, getMealById } from './services/mealService';
import { Meal, MealLight, SearchMode } from './types';
import { RecipeCard } from './components/RecipeCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { RecipeModal } from './components/RecipeModal';

const App: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [meals, setMeals] = useState<(Meal | MealLight)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Initial load - show some random or popular items? 
  // For now, let's keep it clean with an empty state asking to search.

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setMeals([]);

    try {
      if (searchMode === 'name') {
        const data = await searchMealsByName(searchQuery);
        setMeals(data.meals || []);
      } else {
        const data = await filterMealsByIngredient(searchQuery);
        setMeals(data.meals || []);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (id: string) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setSelectedMeal(null);

    try {
      // Always fetch fresh details to ensure we have ingredients/instructions
      // even if we already had the full object from a name search (good for consistency)
      const data = await getMealById(id);
      if (data.meals && data.meals.length > 0) {
        setSelectedMeal(data.meals[0]);
      }
    } catch (err) {
      console.error("Failed to load details");
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: clear selected meal after animation to prevent content jump
    setTimeout(() => setSelectedMeal(null), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                setMeals([]);
                setHasSearched(false);
                setSearchQuery('');
              }}
            >
              <div className="bg-gradient-to-tr from-primary-500 to-orange-400 p-2 rounded-xl shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 hidden sm:block">
                EmilyMeal
              </span>
            </div>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className="flex shadow-sm rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all duration-300">
                  
                  {/* Mode Dropdown (Visual Only, minimal) */}
                  <div className="relative border-r border-gray-200 dark:border-slate-700">
                     <select 
                       value={searchMode}
                       onChange={(e) => setSearchMode(e.target.value as SearchMode)}
                       className="h-full pl-4 pr-8 py-2 bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 outline-none appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                     >
                       <option value="name">Name</option>
                       <option value="ingredient">Ingredient</option>
                     </select>
                     <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchMode === 'name' ? "Search for 'Pasta', 'Cake'..." : "Search for 'Chicken', 'Cheese'..."}
                    className="flex-1 px-4 py-2.5 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none w-full min-w-0"
                  />
                  
                  <button 
                    type="button" 
                    onClick={() => handleSearch()}
                    className="px-6 bg-primary-500 hover:bg-primary-600 text-white transition-colors flex items-center justify-center"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        
        {/* Empty State */}
        {!hasSearched && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="p-6 bg-orange-50 dark:bg-slate-800 rounded-full mb-4">
              <UtensilsCrossed className="w-16 h-16 text-primary-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              What are we cooking <span className="text-primary-500">today?</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg">
              Discover thousands of recipes from around the world. Search by meal name or see what you can make with the ingredients you have.
            </p>
            
            {/* Quick Suggestions Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {['Chicken', 'Pasta', 'Salad', 'Beef', 'Dessert', 'Vegan'].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchMode('name');
                    setSearchQuery(tag);
                    // We need to trigger the search in an effect or handle manually
                    // To keep it simple, we just set state here, user clicks search. 
                    // Or we could trigger it:
                    // But setState is async. Let's just fill the bar for UX.
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 text-sm hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm hover:shadow-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {meals.length > 0 ? `Found ${meals.length} recipes` : 'No recipes found'}
              </h2>
            </div>
            
            {meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {meals.map((meal) => (
                  <RecipeCard key={meal.idMeal} meal={meal} onClick={handleCardClick} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No results found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                  We couldn't find any recipes matching "{searchQuery}". Try a different keyword or ingredient.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} EmilyMeal. Powered by TheMealDB.</p>
        </div>
      </footer>

      {/* Modal */}
      <RecipeModal 
        meal={selectedMeal} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        isLoading={isModalLoading}
      />

    </div>
  );
};

export default App;