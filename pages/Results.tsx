import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, ChefHat, Clock, Flame } from 'lucide-react';
import PremiumBanner from '../components/PremiumBanner';
import Ads from '../components/Ads';
import { Recipe } from '../types';

// FIX: Defined props type for RecipeCard for type safety and to resolve key prop error.
type RecipeCardProps = {
  recipe: Recipe;
  t: (key: string) => string;
};

// FIX: Changed to React.FC to correctly handle component props like 'key'.
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, t }) => (
  <Link to={`/details/${recipe.id}`} className="bg-white dark:bg-stone-900 rounded-2xl shadow-card overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 flex flex-col border border-border dark:border-stone-800">
    <div className="relative h-48">
      {recipe.image === 'error' ? (
           <div className="w-full h-full bg-muted dark:bg-stone-800 flex items-center justify-center text-muted-foreground dark:text-stone-400">{t('results_image_failed')}</div>
      ) : recipe.image ? (
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full bg-muted dark:bg-stone-800 animate-pulse"></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="font-bold font-display text-lg text-white text-shadow">{recipe.title}</h3>
      </div>
    </div>
    <div className="p-5 flex-grow flex flex-col">
      <p className="text-muted-foreground dark:text-stone-400 text-sm mb-4 flex-grow">{recipe.description.substring(0, 100)}...</p>
      <div className="flex justify-between items-center text-sm text-muted-foreground dark:text-stone-400 mt-auto pt-4 border-t border-border dark:border-stone-700">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4" />
          <span>{recipe.cookingTime} min</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <ChefHat className="w-4 h-4" />
          <span>{recipe.difficulty}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Flame className="w-4 h-4" />
          <span>{recipe.calories} kcal</span>
        </div>
      </div>
    </div>
  </Link>
);

const Results = () => {
  const { generatedRecipes, user, t } = useContext(AppContext);

  return (
    <div className="animate-fadeIn">
      <Link to="/" className="inline-flex items-center text-primary font-semibold mb-6 hover:text-primary-dark transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('results_back_to_search')}
      </Link>
      
      {user?.subscriptionStatus !== 'active' && <PremiumBanner className="mb-8" />}

      <h2 className="text-3xl font-bold font-display mb-6 text-foreground dark:text-stone-100">{t('results_generated_recipes')}</h2>
      {generatedRecipes.length > 0 ? (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {generatedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} t={t} />
            ))}
            </div>
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </>
      ) : (
        <div className="text-center py-16 px-6 bg-white dark:bg-stone-900 rounded-2xl border border-border dark:border-stone-800">
            <ChefHat className="w-12 h-12 mx-auto text-muted-foreground dark:text-stone-500 mb-4" />
            <h3 className="text-xl font-bold font-display text-foreground dark:text-stone-100">{t('results_not_found_title')}</h3>
            <p className="text-muted-foreground dark:text-stone-400 mt-2">{t('results_not_found_desc')}</p>
        </div>
      )}
    </div>
  );
};

export default Results;