import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight, Mic, Timer, Pause, Play, RotateCcw } from 'lucide-react';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { generatedRecipes, startGlobalTimer, togglePauseGlobalTimer, stopGlobalTimer, globalTimer, t } = useContext(AppContext);
    
    const recipe = generatedRecipes.find(r => r.id === id);
    
    const queryParams = new URLSearchParams(location.search);
    const initialStep = parseInt(queryParams.get('step') || '0', 10);
    const initialTimer = parseInt(queryParams.get('timer') || '0', 10);
    
    const [currentStep, setCurrentStep] = useState(initialStep);

    useEffect(() => {
        if (initialTimer > 0 && recipe) {
            startGlobalTimer(recipe.id, recipe.title, initialTimer);
        }
    }, [initialTimer, recipe]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, recipe.instructions.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    if (!recipe) {
        return (
            <div className="fixed inset-0 bg-dark text-white flex flex-col items-center justify-center p-4">
                <p className="text-lg">{t('cooking_not_found')}</p>
                <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">{t('cooking_go_home')}</button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-dark text-white flex flex-col items-center justify-between p-4 md:p-8 animate-fadeIn">
            <header className="w-full flex justify-between items-center">
                <div className="text-left">
                    <p className="font-semibold">{recipe.title}</p>
                    <p className="text-sm text-slate-400">{t('cooking_step').replace('{current}', (currentStep + 1).toString()).replace('{total}', recipe.instructions.length.toString())}</p>
                </div>
                <button onClick={() => navigate(`/details/${id}`)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                    <X className="w-6 h-6" />
                </button>
            </header>
            
            <div className="w-full max-w-4xl text-center my-8 flex-grow flex flex-col items-center justify-center">
                <p className="text-2xl md:text-4xl text-slate-100 p-6 bg-black/20 rounded-xl">
                    {recipe.instructions[currentStep]}
                </p>
                 {globalTimer.isActive && globalTimer.recipeId === recipe.id && (
                    <div className="mt-12 bg-white/10 p-6 rounded-2xl flex flex-col items-center shadow-lg">
                        <p className="text-sm text-slate-300 mb-2 uppercase tracking-wider">{t('cooking_timer_title')}</p>
                        <p className="text-6xl font-bold font-mono tracking-widest">{formatTime(globalTimer.remainingSeconds)}</p>
                        <div className="flex space-x-4 mt-4">
                            <button onClick={togglePauseGlobalTimer} className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                                {globalTimer.isPaused ? <Play className="w-7 h-7" /> : <Pause className="w-7 h-7" />}
                            </button>
                             <button onClick={stopGlobalTimer} className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                                <RotateCcw className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <footer className="w-full flex items-center justify-center space-x-8">
                <button onClick={prevStep} disabled={currentStep === 0} className="p-4 bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/30 transition">
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <div className="p-5 bg-primary rounded-full cursor-not-allowed opacity-50" title={t('cooking_voice_soon')}>
                    <Mic className="w-10 h-10" />
                </div>
                <button onClick={nextStep} disabled={currentStep === recipe.instructions.length - 1} className="p-4 bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/30 transition">
                    <ChevronRight className="w-8 h-8" />
                </button>
            </footer>
        </div>
    );
};

export default CookingMode;
