import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumBanner = ({ className = "" }) => {
    const { t } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className={`bg-amber-50 dark:bg-amber-900/30 border-2 border-dashed border-secondary/50 dark:border-secondary/50 p-6 rounded-xl text-center animate-fadeIn ${className}`}>
            <Star className="w-10 h-10 text-secondary mx-auto mb-2" />
            <h3 className="text-lg font-bold text-foreground dark:text-stone-100">{t('upgrade_to_premium')}</h3>
            <p className="text-muted-foreground dark:text-stone-400 text-sm my-2 max-w-lg mx-auto">{t('premium_desc')}</p>
            <button onClick={() => navigate('/profile')} className="mt-2 bg-secondary text-secondary-foreground font-bold py-2 px-6 rounded-full hover:bg-secondary-dark transition shadow-lg">
                {t('go_premium')}
            </button>
        </div>
    );
};

export default PremiumBanner;