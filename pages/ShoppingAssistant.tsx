import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { findNearbyStores } from '../services/geminiService';
import { MapPin, Loader2, ExternalLink, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import Ads from '../components/Ads';

const ShoppingAssistant = () => {
    const { shoppingList, t, language, user } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('');
    const [results, setResults] = useState(null);

    const handleFindStores = () => {
        setIsLoading(true);
        setLocationStatus(t('getting_location'));
        setResults(null);

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                setLocationStatus(t('finding_stores'));
                const { latitude, longitude } = position.coords;
                const storeResults = await findNearbyStores(latitude, longitude, shoppingList, language);
                setResults(storeResults);
                setIsLoading(false);
                setLocationStatus('');
            },
            () => {
                toast.error("Unable to retrieve your location. Please enable location services.");
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

            <div className="bg-white p-6 rounded-2xl shadow-card border border-border text-center">
                <MapPin className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-display text-foreground">{t('assistant_title')}</h2>
                <p className="text-muted-foreground mt-2 mb-6 max-w-2xl mx-auto">
                    {t('assistant_desc')}
                </p>
                <button
                    onClick={handleFindStores}
                    disabled={isLoading || shoppingList.length === 0}
                    className="bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-full text-lg hover:bg-secondary-dark transition-all duration-300 shadow-lg disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center mx-auto"
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
                 {shoppingList.length === 0 && <p className="text-sm text-red-500 mt-4">{t('assistant_empty_list')}</p>}
            </div>

            {results && (
                <div className="mt-8 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-border">
                        <h3 className="text-xl font-bold font-display mb-4">{t('ai_recommendations')}</h3>
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap mb-6">{results.summary}</p>
                        
                        {results.sources.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3">{t('assistant_suggested_stores')}</h4>
                                <div className="space-y-3">
                                    {results.sources.map((source, index) => (
                                        <a href={source.uri} key={index} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-primary/10 transition-colors group">
                                            <div>
                                                <p className="font-semibold text-primary group-hover:underline">{source.title}</p>
                                            </div>
                                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
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