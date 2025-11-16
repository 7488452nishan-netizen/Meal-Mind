import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Users, Bell, Check, X, User } from 'lucide-react';
import Ads from '../components/Ads';

const AdminPanel = () => {
    const { t, user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('requests');

    return (
        <div className="max-w-7xl mx-auto animate-fadeIn">
            <div className="flex items-center space-x-3 mb-8">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('admin_panel')}</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-border p-1">
                <div className="flex border-b border-border">
                    <TabButton icon={Bell} label={t('pending_requests')} isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                    <TabButton icon={Users} label={t('user_management')} isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                </div>

                <div className="mt-6 p-4">
                    {activeTab === 'requests' && <PendingRequests />}
                    {activeTab === 'users' && <UserManagement />}
                </div>
            </div>
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-3 font-semibold border-b-2 transition ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const PendingRequests = () => {
    const { pendingPayments, approvePayment, rejectPayment, t } = useContext(AppContext);

    if (pendingPayments.length === 0) {
        return <div className="text-center text-muted-foreground p-8 rounded-lg">{t('no_pending_requests')}</div>;
    }

    return (
        <div className="overflow-hidden">
            <ul className="divide-y divide-border">
                {pendingPayments.map(payment => (
                    <li key={payment.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <p className="font-bold">{payment.userName} <span className="text-sm font-normal text-muted-foreground">({payment.userEmail})</span></p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t('admin_method')}: <span className="font-semibold text-foreground">{payment.paymentMethod}</span> | 
                                {t('admin_txid')}: <span className="font-semibold text-foreground">{payment.transactionId}</span> |
                                {t('admin_sender')}: <span className="font-semibold text-foreground">{payment.senderNumber || t('admin_na')}</span>
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">{t('admin_requested')}: {new Date(payment.timestamp).toLocaleString()}</p>
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
            case 'active': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{t('active')}</span>;
            case 'pending': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">{t('pending')}</span>;
            default: return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">{t('none')}</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('user')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('status')}</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                    {allUsers.map(user => (
                        <tr key={user.id} className={`${user.id === adminUser.id ? 'bg-primary/5' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-foreground">{user.name} {user.role === 'admin' && <span className="text-xs text-primary font-bold">{t('admin_admin_tag')}</span>}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.subscriptionStatus)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {user.role !== 'admin' ? (
                                    <select 
                                        value={user.subscriptionStatus} 
                                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                        className="rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
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

export default AdminPanel;