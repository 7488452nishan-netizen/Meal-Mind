import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Trash2, X, ArrowDownUp, ShoppingBasket, Edit2, Check } from 'lucide-react';
import Ads from '../components/Ads';

const Pantry = () => {
    const { pantry, addToPantry, updatePantryItem, removePantryItem, t, user } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', expiryDate: '', notes: '' });
    
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingValue, setEditingValue] = useState('');

    const [sortOrder, setSortOrder] = useState('expiryDate');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (newItem.name && newItem.quantity && newItem.expiryDate) {
            await addToPantry(newItem);
            setNewItem({ name: '', quantity: '', expiryDate: '', notes: '' });
            setIsModalOpen(false);
        }
    };

    const handleQuantityUpdate = (id, newQuantity) => {
        if (newQuantity.trim() === '') return;
        updatePantryItem(id, { quantity: newQuantity });
        setEditingItemId(null);
    };

    const sortedPantry = useMemo(() => {
        const sorted = [...pantry];
        switch (sortOrder) {
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'expiryDate':
            default:
                sorted.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
                break;
        }
        return sorted;
    }, [pantry, sortOrder]);

    const getExpiryStatusColor = (dateString) => {
        const expiryDate = new Date(dateString);
        const today = new Date();
        expiryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'text-red-600 bg-red-100';
        if (diffDays <= 7) return 'text-amber-600 bg-amber-100';
        return 'text-green-600 bg-green-100';
    };
    
    return (
        <div className="animate-fadeIn max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <ShoppingBasket className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold font-display">{t('pantry_title')}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative" ref={sortRef}>
                        <button onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} className="flex items-center space-x-2 bg-white border border-border px-4 py-2.5 rounded-lg shadow-sm hover:bg-muted transition">
                            <ArrowDownUp className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{t('pantry_sort')}</span>
                        </button>
                        {isSortDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 animate-scaleIn origin-top-right border border-border">
                                <button onClick={() => { setSortOrder('expiryDate'); setIsSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 ${sortOrder === 'expiryDate' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>{t('pantry_sort_expiry')}</button>
                                <button onClick={() => { setSortOrder('name-asc'); setIsSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 ${sortOrder === 'name-asc' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>{t('pantry_sort_name_asc')}</button>
                                <button onClick={() => { setSortOrder('name-desc'); setIsSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 ${sortOrder === 'name-desc' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>{t('pantry_sort_name_desc')}</button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:bg-primary-dark transition transform hover:scale-105">
                        <Plus className="w-5 h-5" />
                        <span>{t('pantry_add')}</span>
                    </button>
                </div>
            </div>

            {sortedPantry.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedPantry.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-card border border-border p-5 flex flex-col space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold font-display text-lg text-foreground pr-2 flex-1">{item.name}</h3>
                                <button onClick={() => removePantryItem(item.id)} className="text-muted-foreground hover:text-red-500 transition shrink-0 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                {editingItemId === item.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onBlur={() => handleQuantityUpdate(item.id, editingValue)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleQuantityUpdate(item.id, editingValue)}
                                            className="w-24 p-1 border rounded"
                                            autoFocus
                                        />
                                        <button onClick={() => handleQuantityUpdate(item.id, editingValue)} className="p-1">
                                            <Check className="w-4 h-4 text-primary" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>{item.quantity}</span>
                                        <button onClick={() => { setEditingItemId(item.id); setEditingValue(item.quantity); }} className="p-1">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {item.notes && <p className="text-sm text-foreground/80 bg-muted p-2 rounded-md italic">"{item.notes}"</p>}
                             <div className={`text-sm font-semibold px-2 py-1 rounded-full self-start ${getExpiryStatusColor(item.expiryDate)}`}>
                                {t('pantry_expires')}: {new Date(item.expiryDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-2xl border border-border">
                    <ShoppingBasket className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold font-display text-foreground">{t('pantry_empty_title')}</h3>
                    <p className="text-muted-foreground mt-2">{t('pantry_empty_desc')}</p>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground">
                            <X />
                        </button>
                        <h2 className="text-2xl font-bold font-display text-center mb-6">{t('pantry_modal_title')}</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground">{t('pantry_modal_name')}</label>
                                <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} required className="mt-1 w-full p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input placeholder:text-primary/60 bg-stone-100" />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-foreground">{t('pantry_modal_quantity')}</label>
                                    <input type="text" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} required className="mt-1 w-full p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input placeholder:text-primary/60 bg-stone-100" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-foreground">{t('pantry_modal_expiry')}</label>
                                    <input type="date" value={newItem.expiryDate} onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })} required className="mt-1 w-full p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input bg-stone-100" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-foreground">{t('pantry_modal_notes')}</label>
                                <textarea value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} className="mt-1 w-full p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input placeholder:text-primary/60 bg-stone-100" rows={2}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-xl text-lg hover:bg-primary-dark transition shadow-lg">{t('pantry_modal_add_button')}</button>
                        </form>
                    </div>
                </div>
            )}
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

export default Pantry;