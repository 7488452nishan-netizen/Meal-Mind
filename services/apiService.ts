import { UserProfile, PantryItem, ShoppingListItem, HistoryItem, Recipe, PendingPayment, PaymentMethod } from '../types';

// Simulate network latency
const FAKE_DELAY = 150; 
const delay = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));

const getAppData = () => {
    try {
        const data = localStorage.getItem('mealMindAppData');
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Failed to parse app data from localStorage", e);
    }
    // Default structure if data is missing or corrupt
    return {
        users: [],
        pendingPayments: [],
        paymentMethods: [],
        userData: {}, // { [userId]: { pantry: [], shoppingList: [], history: [], savedRecipes: [] } }
    };
};

const setAppData = (data) => {
    localStorage.setItem('mealMindAppData', JSON.stringify(data));
};

const initializeAdmins = () => {
    const appData = getAppData();
    let madeChanges = false;
    
    const admin1 = { id: 'admin1', name: 'Admin Nishan 1', email: 'mdnishanrahman2002@gmail.com', password: '7488452nR', role: 'admin' as const, subscriptionStatus: 'active' as const };
    const admin2 = { id: 'admin2', name: 'Admin Nishan 2', email: 'mdnishanrahman0@gmail.com', password: '7488452nR', role: 'admin' as const, subscriptionStatus: 'active' as const };

    if (!appData.users.some(u => u.email === admin1.email)) {
        appData.users.push(admin1);
        madeChanges = true;
    }
    if (!appData.users.some(u => u.email === admin2.email)) {
        appData.users.push(admin2);
        madeChanges = true;
    }

    if (madeChanges) {
        setAppData(appData);
    }
};

const initializePaymentMethods = () => {
    const appData = getAppData();
    if (!appData.paymentMethods || appData.paymentMethods.length === 0) {
        appData.paymentMethods = [
            { id: 'bkash-default', name: 'Bkash', details: '01775944455' },
            { id: 'nagad-default', name: 'Nagad', details: '01601944455' },
        ];
        setAppData(appData);
    }
};

// Initialize admins on first load of the module
initializeAdmins();
initializePaymentMethods();

// --- Subscription Management ---

const checkAndApplyExpiredSubscriptions = (appData) => {
    let madeChanges = false;
    appData.users.forEach(user => {
        if (user.subscriptionStatus === 'active' && user.premiumRenewalDate) {
            if (new Date(user.premiumRenewalDate) < new Date()) {
                user.subscriptionStatus = 'none';
                user.premiumSince = null;
                user.premiumRenewalDate = null;
                madeChanges = true;
            }
        }
    });
    return madeChanges;
}

// --- Payment Methods Management ---
export const apiGetPaymentMethods = async (): Promise<PaymentMethod[]> => {
    await delay(FAKE_DELAY);
    return getAppData().paymentMethods;
};

export const apiAddPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod[]> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const newMethod: PaymentMethod = { ...method, id: crypto.randomUUID() };
    appData.paymentMethods.push(newMethod);
    setAppData(appData);
    return appData.paymentMethods;
};

export const apiDeletePaymentMethod = async (methodId: string): Promise<PaymentMethod[]> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    appData.paymentMethods = appData.paymentMethods.filter(m => m.id !== methodId);
    setAppData(appData);
    return appData.paymentMethods;
};


// --- User Management ---

export const apiSignInUser = async (email, password): Promise<UserProfile | null> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const userFound = appData.users.find(u => u.email === email && u.password === password);
    return userFound || null;
};

export const apiSignUpUser = async (name, email, password): Promise<{ success: boolean; user?: UserProfile; message?: string }> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    if (appData.users.some(u => u.email === email)) {
        return { success: false, message: "error_email_exists" };
    }
    const newUser: UserProfile = { id: crypto.randomUUID(), name, email, password, role: 'user', subscriptionStatus: 'none' };
    appData.users.push(newUser);
    appData.userData[newUser.id] = { pantry: [], shoppingList: [], history: [], savedRecipes: [] };
    setAppData(appData);
    return { success: true, user: newUser };
};

export const apiGetAllUsers = async (): Promise<UserProfile[]> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const wereChangesMade = checkAndApplyExpiredSubscriptions(appData);
    if (wereChangesMade) {
        setAppData(appData);
    }
    return appData.users;
}

export const apiUpdateUserSubscription = async (userId: string, newStatus: UserProfile['subscriptionStatus']): Promise<{ success: boolean; users?: UserProfile[] }> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const userIndex = appData.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const user = appData.users[userIndex];
        if (newStatus === 'active') {
            const today = new Date();
            const renewalDate = new Date();
            renewalDate.setDate(today.getDate() + 30); // Set premium for 30 days
            user.subscriptionStatus = 'active';
            user.premiumSince = user.premiumSince || today.toISOString();
            user.premiumRenewalDate = renewalDate.toISOString();
        } else {
            user.subscriptionStatus = newStatus;
            user.premiumSince = null;
            user.premiumRenewalDate = null;
        }
        setAppData(appData);
        return { success: true, users: appData.users };
    }
    return { success: false };
}

// --- User-Specific Data Management ---

export const apiLoadUserData = async (userId: string) => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const defaultData = { pantry: [], shoppingList: [], history: [], savedRecipes: [] };
    if (!appData.userData[userId]) {
        appData.userData[userId] = defaultData;
        setAppData(appData);
    }
    return appData.userData[userId];
};

const saveUserData = (userId: string, data) => {
    const appData = getAppData();
    appData.userData[userId] = data;
    setAppData(appData);
};

export const apiUpdateUserData = async (userId: string, dataKey: string, newData: any): Promise<boolean> => {
    await delay(FAKE_DELAY);
    const userData = await apiLoadUserData(userId);
    userData[dataKey] = newData;
    saveUserData(userId, userData);
    return true;
};

// --- Admin / Payments ---
export const apiGetPendingPayments = async (): Promise<PendingPayment[]> => {
    await delay(FAKE_DELAY);
    return getAppData().pendingPayments;
};

export const apiSubmitForPremium = async (paymentDetails: PendingPayment): Promise<{ success: boolean; users?: UserProfile[]; pendingPayments?: PendingPayment[] }> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    appData.pendingPayments.push(paymentDetails);
    
    const userIndex = appData.users.findIndex(u => u.id === paymentDetails.userId);
    if(userIndex > -1) {
        appData.users[userIndex].subscriptionStatus = 'pending';
    }
    
    setAppData(appData);
    return { success: true, users: appData.users, pendingPayments: appData.pendingPayments };
};

export const apiApprovePayment = async (paymentId: string): Promise<{ success: boolean; users?: UserProfile[]; pendingPayments?: PendingPayment[] }> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const payment = appData.pendingPayments.find(p => p.id === paymentId);
    if (payment) {
        appData.pendingPayments = appData.pendingPayments.filter(p => p.id !== paymentId);
        setAppData(appData); // persist payment list change first
        const updateResult = await apiUpdateUserSubscription(payment.userId, 'active');
        if(updateResult.success) {
            return { success: true, users: updateResult.users, pendingPayments: appData.pendingPayments };
        }
    }
    return { success: false };
};

export const apiRejectPayment = async (paymentId: string): Promise<{ success: boolean; users?: UserProfile[]; pendingPayments?: PendingPayment[] }> => {
    await delay(FAKE_DELAY);
    const appData = getAppData();
    const payment = appData.pendingPayments.find(p => p.id === paymentId);
    if (payment) {
        appData.pendingPayments = appData.pendingPayments.filter(p => p.id !== paymentId);
        setAppData(appData); // persist payment list change first
        const updateResult = await apiUpdateUserSubscription(payment.userId, 'none');
        if(updateResult.success) {
            return { success: true, users: updateResult.users, pendingPayments: appData.pendingPayments };
        }
    }
    return { success: false };
};