import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { History as HistoryIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Ads from '../components/Ads';

const History = () => {
    const { history, t, user } = useContext(AppContext);

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <Link to="/profile" className="inline-flex items-center text-primary font-semibold mb-6 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('history_back')}
            </Link>
            
            <div className="flex items-center space-x-3 mb-6">
                <HistoryIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('history_title')}</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
                {history.length > 0 ? (
                    <ul className="divide-y divide-border">
                        {history.map(item => (
                            <li key={item.id} className="p-5">
                                <p className="font-semibold text-foreground truncate">{item.query}</p>
                                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                                    <span>{item.recipeCount} {t('recipes')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 px-6">
                        <HistoryIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold font-display text-foreground">{t('history_empty_title')}</h3>
                        <p className="text-muted-foreground mt-2">{t('history_empty_desc')}</p>
                    </div>
                )}
            </div>
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

export default History;