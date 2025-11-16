import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Plus, ShoppingCart } from 'lucide-react';
import { ShoppingListItem } from '../types';
import Ads from '../components/Ads';

const ShoppingList = () => {
    const { shoppingList, addToShoppingList, updateShoppingListItem, removeShoppingListItem, toggleAllShoppingListItems, t, user } = useContext(AppContext);

    const groupedList = useMemo(() => {
        return shoppingList.reduce<Record<string, ShoppingListItem[]>>((acc, item) => {
            const category = item.category || t('shopping_list_uncategorized');
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});
    }, [shoppingList, t]);
    
    const allChecked = shoppingList.length > 0 && shoppingList.every(item => item.checked);

    const handleAddItem = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name');
        const quantity = formData.get('quantity');
        if (name && quantity) {
            await addToShoppingList([{ name: name.toString(), quantity: quantity.toString(), category: t('shopping_list_groceries') }]);
            (e.target as HTMLFormElement).reset();
        }
    };
    
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
             <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-display">{t('shopping_list_title')}</h1>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-card border border-border mb-8">
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-4">
                    <input type="text" name="name" placeholder={t('shopping_list_placeholder_name')} className="w-full sm:flex-grow p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input placeholder:text-primary/60 bg-stone-100" required />
                    <input type="text" name="quantity" placeholder={t('shopping_list_placeholder_quantity')} className="w-full sm:w-40 p-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition shadow-input placeholder:text-primary/60 bg-stone-100" required />
                    <button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary-dark transition shadow-lg">
                        <Plus className="w-6 h-6" />
                    </button>
                </form>
            </div>

            {Object.keys(groupedList).length > 0 ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-end px-2">
                         <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" checked={allChecked} onChange={toggleAllShoppingListItems} className="h-5 w-5 rounded border-border text-primary focus:ring-primary"/>
                            <span className="font-semibold text-muted-foreground">{t('shopping_list_select_all')}</span>
                        </label>
                    </div>

                    {Object.entries(groupedList).map(([category, items]) => (
                        <div key={category} className="bg-white p-6 rounded-2xl shadow-card border border-border">
                            <h2 className="text-xl font-bold mb-4 font-display text-foreground">{category}</h2>
                            <ul className="divide-y divide-border">
                                {items.map(item => (
                                    <li key={item.id} className={`py-4 flex items-center justify-between transition-opacity ${item.checked ? 'opacity-50' : ''}`}>
                                        <div className="flex items-center">
                                            <input type="checkbox" checked={item.checked} onChange={() => updateShoppingListItem(item.id, { checked: !item.checked })} className="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
                                            <div className="ml-4">
                                                <p className={`font-semibold text-foreground ${item.checked ? 'line-through' : ''}`}>{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.quantity}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeShoppingListItem(item.id)} className="text-muted-foreground hover:text-red-500 p-2 rounded-full transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 px-6 bg-white rounded-2xl border border-border">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold font-display text-foreground">{t('shopping_list_empty_title')}</h3>
                    <p className="text-muted-foreground mt-2">{t('shopping_list_empty_desc')}</p>
                </div>
            )}
            <div className="mt-6">
                {user?.subscriptionStatus !== 'active' && <Ads type="thumbnail" />}
            </div>
        </div>
    );
};

export default ShoppingList;