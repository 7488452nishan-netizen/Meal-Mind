import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { User, LogOut, CheckCircle2, AlertCircle, Shield, History, Star, ChevronRight, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Ads from '../components/Ads';

const Profile = () => {
  const { user, signOutUser, t, submitForPremium } = useContext(AppContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = () => {
    signOutUser();
    navigate('/login');
  };

  const SubscriptionStatus = () => {
    if (!user) return null;
    switch (user.subscriptionStatus) {
      case 'active':
        return (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-5 rounded-xl flex items-start animate-fadeIn border border-green-200 dark:border-green-500/30">
            <CheckCircle2 className="w-7 h-7 mr-4 text-green-500 shrink-0" />
            <div>
              <p className="font-bold text-green-900 dark:text-green-100">{t('premium_member')}</p>
              {user.premiumSince && <p className="text-sm">{t('member_since')}: {new Date(user.premiumSince).toLocaleDateString()}</p>}
              {user.premiumRenewalDate && <p className="text-sm">{t('renews_on')}: {new Date(user.premiumRenewalDate).toLocaleDateString()}</p>}
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-5 rounded-xl flex items-start animate-fadeIn border border-yellow-200 dark:border-yellow-500/30">
            <AlertCircle className="w-7 h-7 mr-4 text-yellow-500 shrink-0" />
            <div>
              <p className="font-bold text-yellow-900 dark:text-yellow-100">{t('pending_approval')}</p>
              <p className="text-sm">{t('premium_pending_desc')}</p>
            </div>
          </div>
        );
      case 'none':
      default:
        return (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-500/30 p-6 rounded-xl text-center animate-fadeIn">
            <Star className="w-10 h-10 text-secondary mx-auto mb-2" />
            <h3 className="text-lg font-bold text-foreground dark:text-stone-100">{t('upgrade_to_premium')}</h3>
            <p className="text-muted-foreground dark:text-stone-400 text-sm my-2">{t('premium_desc')}</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-2 bg-secondary text-secondary-foreground font-bold py-2 px-6 rounded-full hover:bg-secondary-dark transition shadow-lg">
              {t('get_premium')}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white dark:border-dark shadow-sm">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-display">{user?.name}</h2>
          <p className="text-muted-foreground dark:text-stone-400">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800">
          <h3 className="text-xl font-bold mb-4 font-display">{t('subscription_management')}</h3>
          <SubscriptionStatus />
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-card border border-border dark:border-stone-800">
          <h3 className="text-xl font-bold mb-4 font-display">{t('settings')}</h3>
          <div className="space-y-2">
              {user?.role === 'admin' && (
                 <Link to="/admin" className="flex items-center justify-between p-4 rounded-xl hover:bg-muted dark:hover:bg-stone-800 transition cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="font-semibold">{t('admin_panel')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              )}
              <Link to="/history" className="flex items-center justify-between p-4 rounded-xl hover:bg-muted dark:hover:bg-stone-800 transition cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <History className="w-6 h-6 text-primary" />
                    <span className="font-semibold">{t('generation_history')}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer text-red-600 dark:text-red-400">
                <div className="flex items-center space-x-4">
                  <LogOut className="w-6 h-6" />
                  <span className="font-semibold">{t('sign_out')}</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
      </div>

      <p className="text-center text-sm text-muted-foreground dark:text-stone-500 mt-10">
          {t('profile_developed_by')} <a href="https://portfolionishan.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Nishan Rahman</a>.
      </p>
      
      {isModalOpen && <PaymentModal onClose={() => setIsModalOpen(false)} onSubmit={submitForPremium} />}
    </div>
  );
};

const PaymentModal = ({ onClose, onSubmit }) => {
    const { t, paymentMethods } = useContext(AppContext);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods.length > 0 ? paymentMethods[0].name : '');
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!transactionId) {
            toast.error(t("error_txid_required"));
            return;
        }
        setIsLoading(true);
        const success = await onSubmit({ paymentMethod, transactionId, senderNumber });
        setIsLoading(false);
        if (success) {
            onClose();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn relative flex flex-col max-h-[90vh]">
                <div className="p-8 pb-4">
                     <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground dark:text-stone-400 hover:text-foreground dark:hover:text-stone-100 p-2"><X /></button>
                     <h2 className="text-2xl font-bold text-center font-display">{t('get_premium')}</h2>
                </div>
                <div className="p-8 pt-0 overflow-y-auto">
                    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4 rounded-lg text-center mb-4">
                        <p className="font-bold text-xl text-primary">{t('premium_plan_price')}</p>
                        <p className="font-semibold text-foreground dark:text-stone-100 mt-2">{t('payment_send_to')}</p>
                        {paymentMethods.map(method => (
                           <p key={method.id} className="text-lg font-bold text-primary">{method.name}: {method.details}</p>
                        ))}
                        <p className="text-sm font-semibold text-foreground dark:text-stone-100 mt-2">{t('payment_instruction_send_money')}</p>
                    </div>
                    
                    <p className="text-center text-muted-foreground dark:text-stone-400 mb-6">{t('payment_instructions')}</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground dark:text-stone-200 mb-2">{t('payment_method')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                {paymentMethods.map(method => (
                                    <button key={method.id} type="button" onClick={() => setPaymentMethod(method.name)}
                                        className={`py-3 px-4 rounded-lg border-2 transition text-center font-semibold ${paymentMethod === method.name ? 'border-primary ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10' : 'border-border dark:border-stone-700 hover:border-slate-300 dark:hover:border-stone-500'}`}>
                                        {method.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="transactionId" className="block text-sm font-medium text-foreground dark:text-stone-200">{t('transaction_id')}</label>
                            <input type="text" id="transactionId" value={transactionId} onChange={e => setTransactionId(e.target.value)} required
                                className="mt-1 block w-full px-3 py-2 border border-border dark:border-stone-700 rounded-lg shadow-input focus:outline-none focus:ring-primary focus:border-primary sm:text-sm placeholder:text-primary/60 dark:placeholder:text-primary-light/60 bg-stone-100 dark:bg-stone-800" placeholder={t('transaction_id')} />
                        </div>
                        <div>
                            <label htmlFor="senderNumber" className="block text-sm font-medium text-foreground dark:text-stone-200">{t('sender_number')}</label>
                            <input type="text" id="senderNumber" value={senderNumber} onChange={e => setSenderNumber(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-border dark:border-stone-700 rounded-lg shadow-input focus:outline-none focus:ring-primary focus:border-primary sm:text-sm placeholder:text-primary/60 dark:placeholder:text-primary-light/60 bg-stone-100 dark:bg-stone-800" placeholder={t('sender_number')} />
                        </div>
                        <div className="!mt-6 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-secondary dark:border-secondary/50 text-secondary-dark dark:text-amber-200 p-4 rounded-r-lg">
                            <p className="text-sm font-semibold">
                                {t('payment_manual_review_note_part1')}
                                <a href="https://portfolionishan.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                                    {t('payment_manual_review_note_contact')}
                                </a>
                                {t('payment_manual_review_note_part2')}
                            </p>
                        </div>
                        <button type="submit" disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition shadow-lg disabled:bg-muted dark:disabled:bg-stone-700 disabled:text-muted-foreground dark:disabled:text-stone-500 flex items-center justify-center">
                            {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {t('submit_payment')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;