import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { generateRecipes, generateImagesForRecipes } from '../services/geminiService';
import { ChefHat, Search, SlidersHorizontal, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import Ads from '../components/Ads';

// FIX: Moved component outside of Home to prevent re-creation on render and fix type errors.
const FilterButton = ({ value, state, setState, children }) => (
    <button
        type="button"
        onClick={() => setState(state === value ? '' : value)}
        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200 ${state === value ? 'bg-primary border-primary text-primary-foreground' : 'bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'}`}
    >
        {children}
    </button>
);

// FIX: Moved component outside of Home to prevent re-creation on render and fix type errors.
const RadioButton = ({ value, name, state, setState, children }) => (
  <label className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200 cursor-pointer ${state == value ? 'bg-primary border-primary text-primary-foreground' : 'bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'}`}>
      <input
          type="radio"
          name={name}
          value={value}
          checked={state == value}
          onChange={(e) => setState(Number(e.target.value))}
          className="sr-only"
      />
      {children}
  </label>
);

const Home = () => {
    const { setGeneratedRecipes, addToHistory, user, t, language } = useContext(AppContext);
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('ingredients');
    
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [numberOfRecipes, setNumberOfRecipes] = useState(3);
    const [diet, setDiet] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [showAd, setShowAd] = useState(false);

    const handleGenerateClick = (e) => {
        e.preventDefault();
        if (user?.subscriptionStatus === 'active') {
            handleAdFinish();
        } else {
            window.open('https://www.effectivegatecpm.com/hzw1vrc0b?key=9da518ea4a20115382089c5630b72478', '_blank');
            setShowAd(true);
        }
    };

    const handleAdFinish = async () => {
        setShowAd(false);
        const query = activeTab === 'ingredients' ? ingredients : searchQuery;
        if (!query.trim()) return;

        setIsLoading(true);
        const recipes = await generateRecipes(
            activeTab === 'ingredients' ? ingredients : '',
            language,
            { numberOfRecipes, diet, cookingTime },
            activeTab === 'search' ? searchQuery : '',
            {}
        );
        
        if (recipes && recipes.length > 0) {
            setGeneratedRecipes(recipes);
            await addToHistory(query, recipes.length);
            navigate('/results');
            
            generateImagesForRecipes(recipes, user?.subscriptionStatus === 'active', (recipeId, imageUrl) => {
                 setGeneratedRecipes(prevRecipes =>
                    prevRecipes.map(r => r.id === recipeId ? { ...r, image: imageUrl } : r)
                );
            });
        }
        setIsLoading(false);
    };
    

    if (showAd) {
        return <Ads type="interstitial" onFinish={handleAdFinish} />;
    }

    return (
        <div className="flex flex-col items-center justify-center text-center animate-fadeIn p-4">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <ChefHat className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-foreground">
                {t('home_title')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                {t('home_subtitle')}
            </p>

            <div className="w-full max-w-3xl mt-10 bg-white p-6 rounded-2xl shadow-card border border-border">
                <div className="flex border-b border-border mb-6">
                    <button onClick={() => setActiveTab('ingredients')} className={`flex-1 pb-3 font-semibold transition-colors duration-200 ${activeTab === 'ingredients' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {t('by_ingredients_tab')}
                    </button>
                    <button onClick={() => setActiveTab('search')} className={`flex-1 pb-3 font-semibold transition-colors duration-200 ${activeTab === 'search' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {t('by_name_tab')}
                    </button>
                </div>

                <form>
                    {activeTab === 'ingredients' ? (
                        <textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder={t('placeholder_ingredients')}
                            className="w-full h-28 p-4 text-base border-2 bg-stone-100 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder:text-primary/60 shadow-input"
                        />
                    ) : (
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('placeholder_search')}
                            className="w-full p-4 text-base border-2 bg-stone-100 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder:text-primary/60 shadow-input"
                        />
                    )}

                    <div className="mt-6">
                        <button type="button" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-muted">
                            <span className="font-semibold text-foreground">{t('advanced_options')}</span>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isAdvancedOpen && (
                            <div className="mt-4 space-y-6 animate-fadeIn">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3 text-left">{t('number_of_recipes')}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <RadioButton key={num} value={num} name="numberOfRecipes" state={numberOfRecipes} setState={setNumberOfRecipes}>{num} {t('recipes')}</RadioButton>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3 text-left">{t('dietary_preferences')}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <FilterButton value="Vegetarian" state={diet} setState={setDiet}>{t('vegetarian')}</FilterButton>
                                        <FilterButton value="Vegan" state={diet} setState={setDiet}>{t('vegan')}</FilterButton>
                                        <FilterButton value="Gluten-Free" state={diet} setState={setDiet}>{t('gluten_free')}</FilterButton>
                                        <FilterButton value="Keto" state={diet} setState={setDiet}>{t('keto')}</FilterButton>
                                        <FilterButton value="High Protein" state={diet} setState={setDiet}>{t('high_protein')}</FilterButton>
                                        <FilterButton value="Low Carb" state={diet} setState={setDiet}>{t('low_carb')}</FilterButton>
                                        <FilterButton value="Halal" state={diet} setState={setDiet}>{t('halal')}</FilterButton>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3 text-left">{t('cooking_time')}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <FilterButton value="" state={cookingTime} setState={setCookingTime}>{t('any_time')}</FilterButton>
                                        <FilterButton value="fast" state={cookingTime} setState={setCookingTime}>{t('fast_time')}</FilterButton>
                                        <FilterButton value="medium" state={cookingTime} setState={setCookingTime}>{t('medium_time')}</FilterButton>
                                        <FilterButton value="long" state={cookingTime} setState={setCookingTime}>{t('long_time')}</FilterButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleGenerateClick}
                        disabled={isLoading}
                        className="w-full bg-secondary text-secondary-foreground font-bold py-4 px-6 rounded-xl text-lg hover:bg-secondary-dark transition-all duration-300 shadow-lg disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center transform hover:scale-105 mt-6"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6 mr-2" />
                                {t('generate_recipes')}
                            </>
                        )}
                    </button>
                </form>
                <div className="mt-6">
                    {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
                </div>
            </div>
        </div>
    );
};

export default Home;