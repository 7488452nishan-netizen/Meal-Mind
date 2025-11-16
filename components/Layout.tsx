import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Home, Calendar, Sparkles, ShoppingBasket, ShoppingCart, User, Menu, X, Timer, Globe } from 'lucide-react';
// FIX: Import the 'Language' type to be used for type casting.
import type { Language } from '../types';

const Layout = ({ children }) => {
  const { globalTimer, language, setLanguage, t } = useContext(AppContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangSwitcherOpen, setIsLangSwitcherOpen] = useState(false);
  const langSwitcherRef = useRef(null);
  
  const navItems = [
    { path: '/', labelKey: 'nav_home', icon: Home },
    { path: '/planner', labelKey: 'nav_meal_plan', icon: Calendar },
    { path: '/pantry', labelKey: 'nav_pantry', icon: ShoppingBasket },
    { path: '/shopping-list', labelKey: 'nav_shopping_list', icon: ShoppingCart },
    { path: '/assistant', labelKey: 'nav_assistant', icon: Sparkles },
  ];

  const languages = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      ja: '日本語',
      ko: '한국어',
      zh: '中文',
      hi: 'हिन्दी',
      ar: 'العربية',
      bn: 'বাংলা',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (langSwitcherRef.current && !langSwitcherRef.current.contains(event.target)) {
            setIsLangSwitcherOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const LanguageSwitcher = () => (
    <div className="relative" ref={langSwitcherRef}>
        <button onClick={() => setIsLangSwitcherOpen(!isLangSwitcherOpen)} className="p-2.5 rounded-full transition-colors hover:bg-muted">
            <Globe className="w-5 h-5 text-muted-foreground"/>
        </button>
        {isLangSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg z-50 animate-scaleIn origin-top-right border border-border max-h-60 overflow-y-auto">
                <ul className="py-1">
                    {Object.entries(languages).map(([code, name]) => (
                         <li key={code}>
                            <button
                                onClick={() => {
                                    // FIX: Cast 'code' to 'Language' type to match the 'setLanguage' function signature.
                                    setLanguage(code as Language);
                                    setIsLangSwitcherOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center ${language === code ? 'font-semibold text-primary bg-primary/10' : 'text-foreground/80 hover:bg-muted'}`}
                            >
                              {name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-center relative sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-3 z-40">
        <Link to="/" className="absolute left-8 top-1/2 -translate-y-1/2">
            <h1 className="font-display font-bold text-2xl text-primary">MealMind</h1>
        </Link>
        <nav className="flex items-center space-x-2 bg-primary/10 p-1.5 rounded-full">
            {navItems.map((item) => (
                <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-semibold text-sm ${
                    isActive
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-primary/80 hover:text-primary'
                    }`
                }
                >
                <item.icon className="w-4 h-4" />
                <span>{t(item.labelKey)}</span>
                </NavLink>
            ))}
        </nav>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <LanguageSwitcher />
            <NavLink to="/profile" className={({isActive}) => `p-2.5 rounded-full transition-colors ${isActive ? 'bg-muted' : 'hover:bg-muted'}`}>
                {({isActive}) => <User className={`w-5 h-5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}/>}
            </NavLink>
        </div>
      </header>


      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-40">
        <h1 className="font-display font-bold text-xl text-primary">MealMind</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
         <div className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 h-full w-64 bg-background p-4 animate-slideInFromLeft flex flex-col" onClick={e => e.stopPropagation()}>
                <div>
                    <h1 className="font-display font-bold text-2xl text-primary mb-8 px-2">MealMind</h1>
                    <nav className="flex flex-col space-y-2">
                    {[...navItems, { path: '/profile', labelKey: 'nav_profile', icon: User }].map((item) => (
                        <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                            isActive
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`
                        }
                        >
                        <item.icon className="w-5 h-5" />
                        <span>{t(item.labelKey)}</span>
                        </NavLink>
                    ))}
                    </nav>
                </div>
                <div className="mt-auto">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Language</h3>
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                        {Object.entries(languages).map(([code, name]) => (
                            <button
                                key={code}
                                onClick={() => {
                                    // FIX: Cast 'code' to 'Language' type to match the 'setLanguage' function signature.
                                    setLanguage(code as Language);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center font-medium ${language === code ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>
      
       {/* Global Timer Indicator */}
      {globalTimer.isActive && (
        <Link to={`/cooking/${globalTimer.recipeId}`} className="fixed bottom-24 md:bottom-6 right-6 z-50 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-lg flex items-center space-x-3 animate-scaleIn">
          <Timer className="w-5 h-5 animate-pulse" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-medium -mb-0.5">{globalTimer.recipeTitle}</span>
            <span className="text-lg font-bold">{formatTime(globalTimer.remainingSeconds)}</span>
          </div>
        </Link>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-2 flex justify-around z-40">
        {[...navItems, { path: '/profile', labelKey: 'nav_profile', icon: User }].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 rounded-lg py-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[11px] font-semibold whitespace-nowrap">{t(`${item.labelKey}_mobile`) || t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;