import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { generateAiImage, translateRecipe } from '../services/geminiService';
import { ArrowLeft, Clock, ChefHat, Star, Bookmark, Share2, Globe, Flame, Plus, Check, Timer, Sparkles, X, Loader2, Twitter, Link2, Bot } from 'lucide-react';
import { toast } from 'react-toastify';
import Ads from '../components/Ads';

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { generatedRecipes, setGeneratedRecipes, toggleSaveRecipe, user, language, t, addToShoppingList, pantry } = useContext(AppContext);
    
    const [recipe, setRecipe] = useState(null);
    const [originalRecipe, setOriginalRecipe] = useState(null);
    const [isTranslated, setIsTranslated] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareRef = useRef(null);
    
    useEffect(() => {
        const foundRecipe = generatedRecipes.find(r => r.id === id);
        if (foundRecipe) {
            setRecipe(foundRecipe);
            setOriginalRecipe(foundRecipe);
        } else {
            // If not in generated, maybe it's a saved recipe being accessed directly
            // This logic can be expanded if direct linking to saved recipes is needed
            // For now, redirecting is safer.
            navigate('/');
        }
    }, [id, generatedRecipes, navigate]);

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareRef.current && !shareRef.current.contains(event.target)) {
                setIsShareOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGenerateImage = async (style, aspectRatio) => {
        if (!recipe) return;
        setIsGeneratingImage(true);
        setIsImageModalOpen(false);
        try {
            const newImage = await generateAiImage(recipe.englishTitle, user?.subscriptionStatus === 'active', style, aspectRatio);
            if (newImage) {
                const updatedRecipe = { ...recipe, image: newImage };
                setRecipe(updatedRecipe);
                setGeneratedRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r));
            }
        } catch (error) {
            toast.error(t(error.message));
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleTranslate = async () => {
        if (!recipe) return;
        try {
            if (isTranslated) {
                setRecipe(originalRecipe);
                setIsTranslated(false);
            } else {
                const translated = await translateRecipe(originalRecipe, language);
                setRecipe(translated);
                setIsTranslated(true);
            }
        } catch (error) {
            toast.error(t(error.message));
        }
    };
    
    const missingIngredients = recipe ? recipe.ingredients.filter(ing => 
        !pantry.some(pantryItem => {
            const pantryItemName = pantryItem.name.toLowerCase();
            const ingredientName = ing.toLowerCase();
            return ingredientName.includes(pantryItemName);
        })
    ) : [];
    
    const handleAddMissingToShoppingList = async () => {
        const itemsToAdd = missingIngredients.map(ing => ({ name: ing, quantity: '1', category: t('shopping_list_groceries') }));
        await addToShoppingList(itemsToAdd);
        toast.success(t('details_add_missing').replace('{count}', itemsToAdd.length.toString()));
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(t('details_link_copied'));
        setIsShareOpen(false);
    };

    const handleShareTwitter = () => {
        const text = encodeURIComponent(`Check out this delicious recipe: ${recipe.title}! #MealMindAI`);
        const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
        setIsShareOpen(false);
    };

    const parseTimeFromInstruction = (instruction) => {
        const timeRegex = /(\d+)\s*(minutes|minute|min|hours|hour|hr)/i;
        const match = instruction.match(timeRegex);
        if (match) {
            const value = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();
            if (unit.startsWith('hour') || unit.startsWith('hr')) {
                return value * 60 * 60;
            }
            return value * 60;
        }
        return null;
    };

    if (!recipe) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="max-w-5xl mx-auto animate-fadeIn">
             {isImageModalOpen && <ImageRegenModal onClose={() => setIsImageModalOpen(false)} onGenerate={handleGenerateImage} isPremium={user?.subscriptionStatus === 'active'} />}
            <button onClick={() => navigate(-1)} className="inline-flex items-center text-primary font-semibold mb-6 hover:text-primary-dark transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('details_back')}
            </button>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-card overflow-hidden border border-border dark:border-stone-800">
                <div className="relative">
                    {isGeneratingImage ? (
                        <div className="w-full h-64 md:h-96 bg-muted dark:bg-stone-800 flex flex-col items-center justify-center text-muted-foreground dark:text-stone-400">
                            <Loader2 className="w-10 h-10 animate-spin mb-4" />
                            <span>{t('details_generating_image')}</span>
                        </div>
                    ) : (
                        <img src={recipe.image} alt={recipe.title} className="w-full h-64 md:h-96 object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                         <button onClick={() => setIsImageModalOpen(true)} className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-black/50 transition"><Sparkles className="w-4 h-4" /><span>{t('details_regen_image')}</span></button>
                        {language !== 'en' && <button onClick={handleTranslate} className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-black/50 transition"><Globe className="w-4 h-4" /><span>{isTranslated ? t('details_original') : t('details_translate')}</span></button>}
                        <button onClick={() => toggleSaveRecipe(recipe)} className={`bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-black/50 transition ${recipe.isSaved ? 'text-secondary' : ''}`}><Bookmark className="w-4 h-4" /><span>{recipe.isSaved ? t('details_saved') : t('details_save')}</span></button>
                        <div className="relative" ref={shareRef}>
                            <button onClick={() => setIsShareOpen(!isShareOpen)} className="bg-black/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-black/50 transition"><Share2 className="w-4 h-4" /><span>{t('details_share')}</span></button>
                            {isShareOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-lg z-10 animate-scaleIn origin-top-right border border-border dark:border-stone-700">
                                    <button onClick={handleCopyLink} className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-muted dark:hover:bg-stone-800"><Link2 className="w-4 h-4 text-muted-foreground dark:text-stone-400"/><span>{t('details_copy_link')}</span></button>
                                    <button onClick={handleShareTwitter} className="w-full text-left flex items-center space-x-2 px-4 py-2 hover:bg-muted dark:hover:bg-stone-800"><Twitter className="w-4 h-4 text-muted-foreground dark:text-stone-400"/><span>{t('details_share_twitter')}</span></button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-shadow">{recipe.title}</h1>
                        <p className="mt-2 max-w-3xl text-shadow">{recipe.description}</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center text-center mb-8 pb-6 border-b border-border dark:border-stone-700">
                        <InfoItem icon={Clock} value={`${recipe.cookingTime} min`} label={t('details_time')} />
                        <InfoItem icon={ChefHat} value={recipe.difficulty} label={t('details_difficulty')} />
                        <InfoItem icon={Flame} value={`${recipe.calories} kcal`} label={t('details_calories')} />
                        <InfoItem icon={Bot} value={t('details_source_ai')} label={t('details_source')} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                             <h2 className="text-xl font-bold font-display mb-4 text-foreground dark:text-stone-100">{t('details_ingredients')}</h2>
                             <div className="bg-muted dark:bg-stone-800/50 p-4 rounded-xl">
                                {missingIngredients.length > 0 && (
                                    <button onClick={handleAddMissingToShoppingList} className="w-full mb-4 flex items-center justify-center space-x-2 bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition">
                                        <Plus className="w-4 h-4"/>
                                        <span>{t('details_add_missing').replace('{count}', missingIngredients.length.toString())}</span>
                                    </button>
                                )}
                                <ul className="space-y-3 text-foreground/90 dark:text-stone-300">
                                    {recipe.ingredients.map((ing, i) => {
                                      const hasIngredient = !missingIngredients.includes(ing);
                                      return (
                                        <li key={i} className={`flex items-start ${hasIngredient ? '' : 'opacity-70'}`}>
                                            {hasIngredient ? 
                                                <Check className="w-4 h-4 text-primary mr-2.5 mt-1 shrink-0" /> : 
                                                <div className="w-4 h-4 border-2 border-muted-foreground/50 dark:border-stone-500 rounded-full mr-2.5 mt-1 shrink-0"></div>
                                            }
                                            <span>{ing}</span>
                                        </li>
                                      )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                             <h2 className="text-xl font-bold font-display mb-4 text-foreground dark:text-stone-100">{t('details_instructions')}</h2>
                             <ol className="space-y-6 text-foreground/90 dark:text-stone-300 leading-relaxed">
                                {recipe.instructions.map((step, i) => {
                                    const timeInSeconds = parseTimeFromInstruction(step);
                                    return (
                                        <li key={i} className="flex items-start">
                                            <span className="bg-primary text-primary-foreground rounded-full w-7 h-7 text-sm font-bold flex items-center justify-center mr-4 shrink-0 mt-0.5">{i + 1}</span>
                                            <div>
                                                <p>{step}</p>
                                                {timeInSeconds && (
                                                    <Link to={`/cooking/${recipe.id}?step=${i}&timer=${timeInSeconds}`} className="mt-2 inline-flex items-center space-x-2 text-sm text-secondary font-semibold hover:text-secondary-dark transition-colors">
                                                        <Timer className="w-4 h-4" />
                                                        <span>{t('details_timer_start').replace('{minutes}', Math.floor(timeInSeconds/60).toString())}</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, value, label }) => (
    <div className="flex-1 min-w-[100px] flex flex-col items-center">
        <Icon className="w-7 h-7 text-primary mb-2" />
        <p className="font-bold text-lg text-foreground dark:text-stone-100">{value}</p>
        <p className="text-sm text-muted-foreground dark:text-stone-400">{label}</p>
    </div>
);

const ImageRegenModal = ({ onClose, onGenerate, isPremium }) => {
    const { t } = useContext(AppContext);
    const [style, setStyle] = useState('default');
    const [aspectRatio, setAspectRatio] = useState('1:1');

    const styles = [
        { id: 'default', tKey: 'style_default' },
        { id: 'studio', tKey: 'style_studio' },
        { id: 'rustic', tKey: 'style_rustic' },
        { id: 'minimalist', tKey: 'style_minimalist' },
        { id: 'top-down', tKey: 'style_top_down' },
    ];
    const aspectRatios = ['1:1', '16:9', '4:3'];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-scaleIn relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted-foreground dark:text-stone-400 hover:text-foreground dark:hover:text-stone-100"><X /></button>
                <h2 className="text-2xl font-bold text-center font-display mb-6">{t('details_regen_modal_title')}</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-foreground dark:text-stone-200 mb-3">{t('details_regen_modal_style')}</h3>
                        <div className="flex flex-wrap gap-3">
                            {styles.map(s => (
                                <button key={s.id} onClick={() => setStyle(s.id)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200 ${style === s.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-white dark:bg-stone-800 text-muted-foreground dark:text-stone-300 border-border dark:border-stone-700 hover:border-primary/50 dark:hover:border-primary/50 hover:text-foreground dark:hover:text-white'}`}>
                                    {t(s.tKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                    {isPremium && (
                        <div>
                            <h3 className="font-semibold text-foreground dark:text-stone-200 mb-3">{t('details_regen_modal_aspect')}</h3>
                            <div className="flex flex-wrap gap-3">
                                {aspectRatios.map(ar => (
                                    <button key={ar} onClick={() => setAspectRatio(ar)}
                                        className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors duration-200 ${aspectRatio === ar ? 'bg-primary border-primary text-primary-foreground' : 'bg-white dark:bg-stone-800 text-muted-foreground dark:text-stone-300 border-border dark:border-stone-700 hover:border-primary/50 dark:hover:border-primary/50 hover:text-foreground dark:hover:text-white'}`}>
                                        {ar}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isPremium && <p className="text-sm text-muted-foreground dark:text-stone-400 text-center bg-muted dark:bg-stone-800 p-3 rounded-lg">{t('details_regen_modal_premium_note')}</p>}
                </div>
                
                <button onClick={() => onGenerate(style, aspectRatio)}
                    className="w-full mt-8 bg-secondary text-secondary-foreground font-bold py-3 px-4 rounded-xl text-lg hover:bg-secondary-dark transition shadow-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('details_regen_modal_generate')}
                </button>
            </div>
        </div>
    );
};


export default Details;