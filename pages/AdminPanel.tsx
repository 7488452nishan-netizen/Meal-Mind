import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Users, Bell, Check, X, User, CreditCard, Plus, Trash2 } from 'lucide-react';
import Ads from '../components/Ads';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const { t, user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('requests');

    return (
        <div className="max-w-7xl mx-auto animate-fadeIn">
            <div className="flex items-center space-x-3 mb-8">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('admin_panel')}</h1>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-card border border-border dark:border-stone-800 p-1">
                <div className="flex border-b border-border dark:border-stone-700">
                    <TabButton icon={Bell} label={t('pending_requests')} isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    <TabButton icon={Users} label={t('user_management')} isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <TabButton icon={CreditCard} label={t('admin_payment_methods')} isActive={activeTab === 'methods'} onClick={() => setActiveTab('methods')} />
                </div>

                <div className="mt-6 p-4">
                    {activeTab === 'requests' && <PendingRequests />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'methods' && <PaymentMethodManagement />}
                </div>
            </div>
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground dark:text-stone-400 hover:text-primary'}`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const PendingRequests = () => {
    const { pendingPayments, approvePayment, rejectPayment, t } = useContext(AppContext);

    if (pendingPayments.length === 0) {
        return <div className="text-center text-muted-foreground dark:text-stone-400 p-8 rounded-lg">{t('no_pending_requests')}</div>;
    }

    return (
        <div className="overflow-hidden">
            <ul className="divide-y divide-border dark:divide-stone-700">
                {pendingPayments.map(payment => (
                    <li key={payment.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <p className="font-bold">{payment.userName} <span className="text-sm font-normal text-muted-foreground dark:text-stone-400">({payment.userEmail})</span></p>
                            <p className="text-sm text-muted-foreground dark:text-stone-400 mt-1">
                                {t('admin_method')}: <span className="font-semibold text-foreground dark:text-stone-100">{payment.paymentMethod}</span> | 
                                {t('admin_txid')}: <span className="font-semibold text-foreground dark:text-stone-100">{payment.transactionId}</span> |
                                {t('admin_sender')}: <span className="font-semibold text-foreground dark:text-stone-100">{payment.senderNumber || t('admin_na')}</span>
                            </p>
                            <p className="text-xs text-muted-foreground/70 dark:text-stone-500 mt-1">{t('admin_requested')}: {new Date(payment.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2 shrink-0">
                            <button onClick={() => approvePayment(payment.id)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-1">
                                <Check className="w-4 h-4" /><span>{t('approve')}</span>
                            </button>
                            <button onClick={() => rejectPayment(payment.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center space-x-1">
                                <X className="w-4 h-4" /><span>{t('reject')}</span>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const UserManagement = () => {
    const { allUsers, t, updateUserSubscriptionStatusByAdmin, user: adminUser } = useContext(AppContext);

    const handleStatusChange = (userId, newStatus) => {
        updateUserSubscriptionStatusByAdmin(userId, newStatus);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-200 rounded-full">{t('active')}</span>;
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-200 rounded-full">{t('pending')}</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-stone-700 dark:text-stone-200 rounded-full">{t('none')}</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-stone-700">
                <thead className="bg-muted/50 dark:bg-stone-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-stone-400 uppercase tracking-wider">{t('user')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-stone-400 uppercase tracking-wider">{t('status')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-stone-400 uppercase tracking-wider">{t('admin_premium_since')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-stone-400 uppercase tracking-wider">{t('admin_premium_renews')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-stone-400 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-stone-900 divide-y divide-border dark:divide-stone-700">
                    {allUsers.map(user => (
                        <tr key={user.id} className={`${user.id === adminUser.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-muted dark:bg-stone-800 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-muted-foreground dark:text-stone-400" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground dark:text-stone-100">{user.name} {user.role === 'admin' && <span className="text-xs text-primary font-bold">{t('admin_admin_tag')}</span>}</div>
                                        <div className="text-sm text-muted-foreground dark:text-stone-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.subscriptionStatus)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-stone-300">{user.premiumSince ? new Date(user.premiumSince).toLocaleDateString() : t('admin_na')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground dark:text-stone-300">{user.premiumRenewalDate ? new Date(user.premiumRenewalDate).toLocaleDateString() : t('admin_na')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {user.role !== 'admin' ? (
                                    <select 
                                        value={user.subscriptionStatus} 
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        className="rounded-md border-border dark:border-stone-600 dark:bg-stone-800 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                    >
                                        <option value="active">{t('make_active')}</option>
                                        <option value="pending">{t('make_pending')}</option>
                                        <option value="none">{t('remove_premium')}</option>
                                    </select>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PaymentMethodManagement = () => {
    const { paymentMethods, addPaymentMethod, deletePaymentMethod, t } = useContext(AppContext);
    const [newMethodName, setNewMethodName] = useState('');
    const [newMethodDetails, setNewMethodDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddMethod = async (e) => {
        e.preventDefault();
        if (!newMethodName.trim() || !newMethodDetails.trim()) {
            toast.error(t("toast_admin_add_method_fail_fields_required"));
            return;
        }
        setIsLoading(true);
        await addPaymentMethod({ name: newMethodName, details: newMethodDetails });
        setNewMethodName('');
        setNewMethodDetails('');
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="p-6 bg-muted/50 dark:bg-stone-800/50 rounded-lg">
                <h3 className="text-lg font-bold mb-4">{t('admin_add_new_method')}</h3>
                <form onSubmit={handleAddMethod} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t('admin_method_name')}
                            value={newMethodName}
                            onChange={(e) => setNewMethodName(e.target.value)}
                            required
                            className="w-full p-3 border border-border dark:border-stone-700 rounded-lg bg-stone-100 dark:bg-stone-800"
                        />
                        <input
                            type="text"
                            placeholder={t('admin_method_details')}
                            value={newMethodDetails}
                            onChange={(e) => setNewMethodDetails(e.target.value)}
                            required
                            className="w-full p-3 border border-border dark:border-stone-700 rounded-lg bg-stone-100 dark:bg-stone-800"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition flex items-center space-x-1 disabled:bg-muted dark:disabled:bg-stone-700">
                        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />}
                        <span>{t('admin_add_method')}</span>
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">{t('admin_current_methods')}</h3>
                <ul className="divide-y divide-border dark:divide-stone-700">
                    {paymentMethods.map(method => (
                        <li key={method.id} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{method.name}</p>
                                <p className="text-sm text-muted-foreground dark:text-stone-400">{method.details}</p>
                            </div>
                            <button onClick={() => deletePaymentMethod(method.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center space-x-1">
                                <Trash2 className="w-4 h-4" />
                                <span>{t('admin_delete_method')}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;