import React, { useState, useEffect, useContext, useRef } from 'react';
import { ChefHat } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const AdUnit = ({ adKey, height, width }) => {
    const adHtml = `
        <html>
        <head>
            <style>body { margin: 0; display: flex; justify-content: center; align-items: center; }</style>
        </head>
        <body>
            <script type="text/javascript">
                atOptions = {
                    'key' : '${adKey}',
                    'format' : 'iframe',
                    'height' : ${height},
                    'width' : ${width},
                    'params' : {}
                };
            <\/script>
            <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"><\/script>
        </body>
        </html>
    `;

    return (
        <iframe
            srcDoc={adHtml}
            width={width}
            height={height}
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            title={`ad-${adKey}`}
        />
    );
};


const Ads = ({ type, onFinish = () => {} }) => {
    const { t } = useContext(AppContext);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (type === 'interstitial') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                onFinish();
            }
        }
    }, [countdown, type, onFinish]);

    if (type === 'interstitial') {
        return (
            <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fadeIn text-white p-4">
                <ChefHat className="w-16 h-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t('ads_generating')}</h2>
                <p className="text-lg mb-6">{t('ads_wait')}</p>
                <div className="w-20 h-20 border-4 border-primary rounded-full flex items-center justify-center text-3xl font-bold">
                    {countdown}
                </div>
                <p className="mt-6 text-sm text-gray-400">{t('ads_advertisement')}</p>
            </div>
        );
    }

    if (type === 'thumbnail') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
                <div className="bg-muted dark:bg-stone-800 rounded-lg flex justify-center items-center overflow-hidden w-[300px] h-[250px]">
                    <AdUnit adKey="22ed30d900f3568b69f221aad654f51c" height={250} width={300} />
                </div>
                <div className="bg-muted dark:bg-stone-800 rounded-lg flex justify-center items-center overflow-hidden w-[320px] h-[50px]">
                     <AdUnit adKey="12b5db87617ab6ae7381b7ea99e872e3" height={50} width={320} />
                </div>
            </div>
        );
    }

    return null;
};

export default Ads;