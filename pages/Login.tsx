import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ChefHat } from 'lucide-react';

const Login = () => {
  const { signInUser, signUpUser, t } = useContext(AppContext);
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = isSigningUp
      ? await signUpUser(name, email, password)
      : await signInUser(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background dark:bg-dark">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 backdrop-blur-md rounded-2xl shadow-card p-8 animate-scaleIn border border-border dark:border-stone-800">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-2">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground dark:text-stone-100">{t('welcome_message')}</h1>
          <p className="text-muted-foreground dark:text-stone-400 mt-2">{isSigningUp ? t('create_account_prompt') : t('signin_prompt')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSigningUp && (
            <input type="text" placeholder={t('name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border border-border dark:border-stone-700 rounded-lg focus:ring-primary focus:border-primary bg-stone-100 dark:bg-stone-800 placeholder:text-primary/60 dark:placeholder:text-primary-light/60 shadow-input" />
          )}
          <input type="email" placeholder={t('email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-border dark:border-stone-700 rounded-lg focus:ring-primary focus:border-primary bg-stone-100 dark:bg-stone-800 placeholder:text-primary/60 dark:placeholder:text-primary-light/60 shadow-input" />
          <input type="password" placeholder={t('password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-border dark:border-stone-700 rounded-lg focus:ring-primary focus:border-primary bg-stone-100 dark:bg-stone-800 placeholder:text-primary/60 dark:placeholder:text-primary-light/60 shadow-input" />
          <button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors shadow-lg disabled:bg-muted dark:disabled:bg-stone-700 disabled:text-muted-foreground dark:disabled:text-stone-500">
            {isLoading ? t('processing') : (isSigningUp ? t('signup_button') : t('signin_button'))}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground dark:text-stone-400 mt-6">
          {isSigningUp ? t('already_have_account') : t('dont_have_account')}
          <button onClick={() => setIsSigningUp(!isSigningUp)} className="font-semibold text-primary hover:underline ml-1">
            {isSigningUp ? t('signin_button') : t('signup_button')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;