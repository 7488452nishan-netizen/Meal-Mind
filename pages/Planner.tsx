
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import PremiumBanner from '../components/PremiumBanner';
import { generateMealPlan } from '../services/geminiService';
import { MealPlanDay } from '../types';
import { Calendar, Utensils, Zap, Loader2, Flame } from 'lucide-react';
import Ads from '../components/Ads';
import { toast } from 'react-toastify';

const Planner = () => {
    const { user, t, language } = useContext(AppContext);
    const [preferences, setPreferences] = useState({ diet: '', calories: '2000' });
    const [mealPlan, setMealPlan] = useState<MealPlanDay[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePlan = async () => {
        setIsLoading(true);
        setMealPlan([]);

        if (user?.subscriptionStatus !== 'active') {
            window.open('https://www.effectivegatecpm.com/hzw1vrc0b?key=9da518ea4a20115382089c5630b72478', '_blank');
        }

        try {
            const plan = await generateMealPlan(preferences, language);
            setMealPlan(plan);
        } catch (error) {
            toast.error(t(error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.subscriptionStatus !== 'active') {
        return <PremiumBanner />;
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('planner_title')}</h1>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800 mb-8">
                <h2 className="text-xl font-bold font-display mb-4">{t('planner_preferences')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground dark:text-stone-400 mb-1">{t('planner_diet_pref')}</label>
                        <select
                            value={preferences.diet}
                            onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
                            className="w-full p-3 border-2 border-border dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input bg-stone-100 dark:bg-stone-800"
                        >
                            <option value="">{t('none')}</option>
                            <option value="Vegetarian">{t('vegetarian')}</option>
                            <option value="Vegan">{t('vegan')}</option>
                            <option value="Gluten-Free">{t('gluten_free')}</option>
                            <option value="Keto">{t('keto')}</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground dark:text-stone-400 mb-1">{t('planner_calories')}</label>
                        <input
                            type="number"
                            step="100"
                            value={preferences.calories}
                            onChange={(e) => setPreferences({ ...preferences, calories: e.target.value })}
                            className="w-full p-3 border-2 border-border dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input bg-stone-100 dark:bg-stone-800"
                        />
                    </div>
                </div>
                <button
                    onClick={handleGeneratePlan}
                    disabled={isLoading}
                    className="w-full md:w-auto bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl text-lg hover:bg-primary-dark transition-all duration-300 shadow-lg disabled:bg-muted dark:disabled:bg-stone-700 disabled:text-muted-foreground dark:disabled:text-stone-500 flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-5 h-5 mr-2" /> {t('planner_generate')}</>}
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-16">
                    <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                    <p className="mt-4 text-muted-foreground dark:text-stone-400">{t('planner_loading')}</p>
                </div>
            )}

            {mealPlan.length > 0 && (
                <div className="space-y-8">
                    {mealPlan.map((day) => (
                        <div key={day.day} className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800 animate-slideUp">
                            <h3 className="text-2xl font-bold font-display text-primary mb-4">{day.day}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <MealCard meal={day.breakfast} type={t('breakfast')} />
                                <MealCard meal={day.lunch} type={t('lunch')} />
                                <MealCard meal={day.dinner} type={t('dinner')} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

const MealCard = ({ meal, type }) => (
    <div className="bg-muted dark:bg-stone-800/50 p-4 rounded-xl">
        <p className="font-bold text-muted-foreground dark:text-stone-400 text-sm mb-1">{type}</p>
        <h4 className="font-bold text-foreground dark:text-stone-100 mb-2">{meal.title}</h4>
        <p className="text-sm text-muted-foreground dark:text-stone-400 mb-3">{meal.description}</p>
        <div className="flex items-center space-x-1.5 text-sm text-primary font-semibold">
            <Flame className="w-4 h-4" />
            <span>{meal.calories} kcal</span>
        </div>
    </div>
);

export default Planner;
