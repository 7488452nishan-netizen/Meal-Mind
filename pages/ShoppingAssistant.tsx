
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { findNearbyStores } from '../services/geminiService';
import { MapPin, Loader2, ExternalLink, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import Ads from '../components/Ads';

const FormattedAiResponse = ({ text }) => {
    // A simple parser to handle markdown-like lists and bolding
    const formattedLines = text.split('\n').map((line, index) => {
        line = line.trim();
        // Handle bolding with **text**
        const processBold = (textLine) => {
            const parts = textLine.split('**');
            return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
        };

        if (line.startsWith('* ')) {
            // It's a list item
            line = line.substring(2);
            return (
                <li key={index} className="flex items-start">
                    <span className="mr-3 mt-1.5 text-primary">&#8226;</span>
                    <span>{processBold(line)}</span>
                </li>
            );
        }
        if (line.length > 0) {
            // It's a paragraph
            return <p key={index} className="mb-2">{processBold(line)}</p>;
        }
        return null;
    });

    // Group list items into <ul> tags
    const content = [];
    let currentList = [];
    formattedLines.forEach((line, index) => {
        if (line && line.type === 'li') {
            currentList.push(line);
        } else {
            if (currentList.length > 0) {
                content.push(<ul key={`ul-${index}`} className="list-none pl-0 space-y-2 mb-4">{currentList}</ul>);
                currentList = [];
            }
            if (line) {
                content.push(line);
            }
        }
    });
    if (currentList.length > 0) {
        content.push(<ul key="ul-last" className="list-none pl-0 space-y-2 mb-4">{currentList}</ul>);
    }
    
    return <div className="text-foreground/90 dark:text-stone-300 leading-relaxed">{content}</div>;
};


const ShoppingAssistant = () => {
    const { shoppingList, t, language, user } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');
    const [results, setResults] = useState(null);

    const handleFindStores = () => {
        setIsLoading(true);
        setLocationStatus(t('getting_location'));
        setResults(null);
        
        if (user?.subscriptionStatus !== 'active') {
            window.open('https://www.effectivegatecpm.com/hzw1vrc0b?key=9da518ea4a20115382089c5630b72478', '_blank');
        }

        if (!navigator.geolocation) {
            toast.error(t('error_geolocation_unsupported'));
            setIsLoading(false);
            setLocationStatus('');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    setLocationStatus(t('finding_stores'));
                    const { latitude, longitude } = position.coords;
                    const storeResults = await findNearbyStores(latitude, longitude, shoppingList, language);
                    setResults(storeResults);
                } catch (error) {
                    toast.error(t(error.message));
                } finally {
                    setIsLoading(false);
                    setLocationStatus('');
                }
            },
            () => {
                toast.error(t('error_geolocation_unavailable'));
                setIsLoading(false);
                setLocationStatus('');
            }
        );
    };

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('nav_assistant')}</h1>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800 text-center">
                <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display text-foreground dark:text-stone-100">{t('assistant_title')}</h2>
                <p className="text-muted-foreground dark:text-stone-400 mt-2 mb-6 max-w-2xl mx-auto">
                    {t('assistant_desc')}
                </p>
                <button
                    onClick={handleFindStores}
                    disabled={isLoading}
                    className="bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-full text-lg hover:bg-secondary-dark transition-all duration-300 shadow-lg disabled:bg-muted dark:disabled:bg-stone-700 disabled:text-muted-foreground dark:disabled:text-stone-500 flex items-center justify-center mx-auto"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            <span>{locationStatus || t('assistant_searching')}</span>
                        </>
                    ) : (
                        t('find_stores')
                    )}
                </button>
            </div>

            {results && (
                <div className="mt-8 animate-fadeIn">
                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800">
                        <h3 className="text-xl font-bold font-display mb-4">{t('ai_recommendations')}</h3>
                        <FormattedAiResponse text={results.summary} />
                        
                        {results.sources.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3 mt-6">{t('assistant_suggested_stores')}</h4>
                                <div className="space-y-3">
                                    {results.sources.map((source, index) => (
                                        <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center justify-between p-4 bg-muted dark:bg-stone-800/50 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors group">
                                            <div>
                                                <p className="font-semibold text-primary group-hover:underline">{source.title}</p>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-muted-foreground dark:text-stone-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

export default ShoppingAssistant;
