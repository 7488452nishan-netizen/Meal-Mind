import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AppContextType, UserProfile, Language, Recipe, HistoryItem, ShoppingListItem, PantryItem, TimerState, PendingPayment } from '../types';
import { toast } from 'react-toastify';
import * as api from '../services/apiService';

export const AppContext = createContext<AppContextType | null>(null);

const translations = {
    en: {
        // Nav
        nav_home: 'Home',
        nav_meal_plan: 'Meal Plan',
        nav_meal_plan_mobile: 'Plan',
        nav_pantry: 'Smart Kitchen',
        nav_pantry_mobile: 'Pantry',
        nav_shopping_list: 'Shopping List',
        nav_shopping_list_mobile: 'List',
        nav_assistant: 'Assistant',
        nav_profile: 'Profile',
        
        // Home Page
        home_title: "What's in your Kitchen?",
        home_subtitle: "Enter ingredients you have, or search by name. Our AI will whip up delicious recipes for you!",
        by_ingredients_tab: "By Ingredients",
        by_name_tab: "By Recipe Name",
        placeholder_ingredients: "e.g., chicken breast, tomatoes, basil, pasta",
        placeholder_search: "e.g., 'Spaghetti Carbonara' or 'Vegan Tacos'",
        advanced_options: "Advanced Options",
        number_of_recipes: "Number of Recipes",
        recipes: 'Recipes',
        dietary_preferences: "Dietary Preferences",
        cooking_time: "Cooking Time",
        generate_recipes: "Generate Recipes",
        
        // Filters
        vegetarian: "Vegetarian",
        vegan: "Vegan",
        gluten_free: "Gluten-Free",
        keto: "Keto",
        high_protein: "High Protein",
        low_carb: "Low Carb",
        halal: "Halal",
        any_time: "Any",
        fast_time: "Fast (<30 min)",
        medium_time: "Medium (30-60 min)",
        long_time: "Long (>60 min)",
        
        // Login Page
        welcome_message: "Welcome to MealMind AI",
        create_account_prompt: "Create an account to get started.",
        signin_prompt: "Sign in to continue.",
        name_placeholder: "Your Name",
        email_placeholder: "Email Address",
        password_placeholder: "Password",
        signup_button: "Sign Up",
        signin_button: "Sign In",
        processing: "Processing...",
        already_have_account: "Already have an account?",
        dont_have_account: "Don't have an account?",

        // Admin
        admin_panel: 'Admin Panel',
        pending_requests: 'Pending Requests',
        user_management: 'User Management',
        approve: 'Approve',
        reject: 'Reject',
        no_pending_requests: 'No pending requests.',
        all_users: 'All Users',
        user: 'User',
        status: 'Status',
        actions: 'Actions',
        active: 'Active',
        pending: 'Pending',
        none: 'None',
        make_active: 'Make Active',
        make_pending: 'Make Pending',
        remove_premium: 'Remove Premium',
        admin_method: "Method",
        admin_txid: "TxID",
        admin_sender: "Sender",
        admin_na: "N/A",
        admin_requested: "Requested",
        admin_admin_tag: "(Admin)",
        
        // Profile & Premium
        subscription_status: 'Subscription Status',
        pending_approval: 'Pending Approval',
        premium_member: 'Premium Member',
        upgrade_to_premium: 'Upgrade to Premium',
        go_premium: 'Go Premium',
        get_premium: 'Get Premium',
        payment_method: 'Payment Method',
        transaction_id: 'Transaction ID',
        sender_number: 'Sender Number (Optional)',
        submit_payment: 'Submit for Review',
        premium_desc: "Unlock all features including unlimited recipes, meal planning, and studio-quality photos!",
        payment_instructions: "Please make the payment and submit the details below for verification.",
        subscription_management: "Subscription Management",
        plan: "Plan",
        member_since: 'Member Since',
        renews_on: 'Renews On',
        settings: "Settings",
        generation_history: "Generation History",
        sign_out: "Sign Out",
        payment_manual_review_note_part1: "NOTE: This is a manual review process. Your premium status will be activated within 6 hours (usually within 1 hour). If it takes too much time, please contact us here: ",
        payment_manual_review_note_contact: "Nishan Rahman",
        payment_manual_review_note_part2: ". Thank you for your patience.",
        premium_pending_desc: "Your request is under review. This usually takes a few hours.",
        profile_developed_by: "Developed by",
        payment_send_to: "Please send payment to one of the numbers below:",
        payment_bkash: "Bkash",
        payment_nagad: "Nagad",
        
        // Shopping Assistant
        find_stores: "Find Best Stores",
        getting_location: "Getting your location...",
        finding_stores: "Finding best stores for you...",
        ai_recommendations: "AI Recommendations",
        assistant_title: "Find the Best Local Stores",
        assistant_desc: "Let our AI analyze your shopping list and find the best-rated, most convenient grocery stores near you.",
        assistant_empty_list: "Your shopping list is empty. Add items to use the assistant.",
        assistant_searching: "Searching...",
        assistant_suggested_stores: "Suggested Stores:",

        // Ads
        ads_generating: "Generating your recipes...",
        ads_wait: "Please wait, great things are coming!",
        ads_advertisement: "Advertisement",

        // Planner Page
        planner_title: "Meal Planner",
        planner_preferences: "Set Your Preferences",
        planner_diet_pref: "Dietary Preference",
        planner_calories: "Daily Calories (approx.)",
        planner_generate: "Generate Plan",
        planner_loading: "Generating your personalized meal plan...",
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner",

        // Pantry Page
        pantry_title: "Smart Kitchen",
        pantry_sort: "Sort By",
        pantry_add: "Add Item",
        pantry_sort_expiry: "Expiry Date",
        pantry_sort_name_asc: "Name (A-Z)",
        pantry_sort_name_desc: "Name (Z-A)",
        pantry_expires: "Expires",
        pantry_empty_title: "Your Pantry is Empty",
        pantry_empty_desc: "Add items to your smart kitchen to keep track of your ingredients.",
        pantry_modal_title: "Add to Pantry",
        pantry_modal_name: "Item Name",
        pantry_modal_quantity: "Quantity",
        pantry_modal_expiry: "Expiry Date",
        pantry_modal_notes: "Notes (Optional)",
        pantry_modal_add_button: "Add Item",

        // Shopping List Page
        shopping_list_title: "Shopping List",
        shopping_list_placeholder_name: "What do you need?",
        shopping_list_placeholder_quantity: "Quantity",
        shopping_list_empty_title: "Your Shopping List is Empty",
        shopping_list_empty_desc: "Add items above to get started.",
        shopping_list_select_all: "Select All",
        shopping_list_uncategorized: "Uncategorized",
        shopping_list_groceries: "Groceries",

        // Details Page
        details_back: "Back to Results",
        details_generating_image: "Generating new image...",
        details_regen_image: "Regenerate Image",
        details_translate: "Translate",
        details_original: "Original",
        details_save: "Save",
        details_saved: "Saved",
        details_share: "Share",
        details_copy_link: "Copy Link",
        details_share_twitter: "Share on Twitter",
        details_link_copied: "Link copied to clipboard!",
        details_time: "Time",
        details_difficulty: "Difficulty",
        details_calories: "Calories",
        details_ingredients: "Ingredients",
        details_instructions: "Instructions",
        details_source: "Source",
        details_source_ai: "AI Generated",
        details_add_missing: "Add {count} Missing to List",
        details_timer_start: "Start {minutes} minute timer",
        details_regen_modal_title: "Regenerate Image",
        details_regen_modal_style: "Style",
        details_regen_modal_aspect: "Aspect Ratio",
        details_regen_modal_premium_note: "Upgrade to Premium to unlock different aspect ratios.",
        details_regen_modal_generate: "Generate",

        // Results Page
        results_back_to_search: "Back to Search",
        results_generated_recipes: "Generated Recipes",
        results_not_found_title: "No Recipes Found",
        results_not_found_desc: "No recipes were generated. Please go back and try a different search.",
        results_image_failed: "Image failed",

        // Cooking Mode
        cooking_step: "Step {current} of {total}",
        cooking_timer_title: "Timer",
        cooking_not_found: "Recipe not found.",
        cooking_go_home: "Go Home",

        // History Page
        history_back: "Back to Profile",
        history_title: "Generation History",
        history_empty_title: "No History Yet",
        history_empty_desc: "Your recipe generation history will appear here.",
    },
    bn: {
        // Nav
        nav_home: 'হোম',
        nav_meal_plan: 'খাবার পরিকল্পনা',
        nav_meal_plan_mobile: 'প্ল্যান',
        nav_pantry: 'স্মার্ট কিচেন',
        nav_pantry_mobile: 'প্যান্ট্রি',
        nav_shopping_list: 'কেনাকাটার তালিকা',
        nav_shopping_list_mobile: 'তালিকা',
        nav_assistant: 'সহকারী',
        nav_profile: 'প্রোফাইল',
        
        // Home Page
        home_title: "আপনার রান্নাঘরে কি আছে?",
        home_subtitle: "আপনার কাছে থাকা উপাদান লিখুন, অথবা নাম দিয়ে অনুসন্ধান করুন। আমাদের AI আপনার জন্য সুস্বাদু রেসিপি তৈরি করবে!",
        by_ingredients_tab: "উপাদান দ্বারা",
        by_name_tab: "রেসিপির নাম দ্বারা",
        placeholder_ingredients: "যেমন, মুরগির মাংস, টমেটো, তুলসী, পাস্তা",
        placeholder_search: "যেমন, 'স্প্যাগেটি কার্বোনারা' বা 'ভেগান টাকোস'",
        advanced_options: "উন্নত বিকল্প",
        number_of_recipes: "রেসিপির সংখ্যা",
        recipes: 'রেসিপি',
        dietary_preferences: "খাদ্য পছন্দ",
        cooking_time: "রান্নার সময়",
        generate_recipes: "রেসিপি তৈরি করুন",

        // Filters
        vegetarian: "নিরামিষ",
        vegan: "ভেগান",
        gluten_free: "গ্লুটেন-মুক্ত",
        keto: "কেটো",
        high_protein: "উচ্চ প্রোটিন",
        low_carb: "কম কার্ব",
        halal: "হালাল",
        any_time: "যেকোনো সময়",
        fast_time: "দ্রুত (<৩০ মিনিট)",
        medium_time: "মাঝারি (৩০-৬০ মিনিট)",
        long_time: "দীর্ঘ (>৬০ মিনিট)",

        // Login Page
        welcome_message: "মিলমাইন্ড এআই-তে স্বাগতম",
        create_account_prompt: "শুরু করতে একটি অ্যাকাউন্ট তৈরি করুন।",
        signin_prompt: "চালিয়ে যেতে সাইন ইন করুন।",
        name_placeholder: "আপনার নাম",
        email_placeholder: "ইমেল ঠিকানা",
        password_placeholder: "পাসওয়ার্ড",
        signup_button: "সাইন আপ",
        signin_button: "সাইন ইন",
        processing: "প্রসেস হচ্ছে...",
        already_have_account: " ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
        dont_have_account: "অ্যাকাউন্ট নেই?",

        // Admin
        admin_panel: 'অ্যাডমিন প্যানেল',
        pending_requests: 'মুলতুবি অনুরোধ',
        user_management: 'ব্যবহারকারী ব্যবস্থাপনা',
        approve: 'অনুমোদন',
        reject: 'প্রত্যাখ্যান',
        no_pending_requests: 'কোন মুলতুবি অনুরোধ নেই।',
        all_users: 'সকল ব্যবহারকারী',
        user: 'ব্যবহারকারী',
        status: 'অবস্থা',
        actions: 'ক্রিয়াকলাপ',
        active: 'সক্রিয়',
        pending: 'মুলতুবি',
        none: 'কোনটিই নয়',
        make_active: 'সক্রিয় করুন',
        make_pending: 'মুলতুবি করুন',
        remove_premium: 'প্রিমিয়াম সরান',
        admin_method: "পদ্ধতি",
        admin_txid: "লেনদেন আইডি",
        admin_sender: "প্রেরক",
        admin_na: "প্রযোজ্য নয়",
        admin_requested: "অনুরোধ করা হয়েছে",
        admin_admin_tag: "(অ্যাডমিন)",

        // Profile & Premium
        subscription_status: 'সাবস্ক্রিপশন অবস্থা',
        pending_approval: 'অনুমোদনের জন্য মুলতুবি',
        premium_member: 'প্রিমিয়াম সদস্য',
        upgrade_to_premium: 'প্রিমিয়ামে আপগ্রেড করুন',
        go_premium: 'প্রিমিয়াম নিন',
        get_premium: 'প্রিমিয়াম পান',
        payment_method: 'পেমেন্ট পদ্ধতি',
        transaction_id: 'লেনদেন আইডি',
        sender_number: 'প্রেরকের নম্বর (ঐচ্ছিক)',
        submit_payment: 'পর্যালোচনার জন্য জমা দিন',
        premium_desc: "আনলিমিটেড রেসিপি, খাবার পরিকল্পনা এবং স্টুডিও-মানের ফটো সহ সমস্ত বৈশিষ্ট্য আনলক করুন!",
        payment_instructions: "দয়া করে পেমেন্ট করুন এবং যাচাইয়ের জন্য নিচের বিবরণ জমা দিন।",
        subscription_management: "সাবস্ক্রিপশন ম্যানেজমেন্ট",
        plan: "প্ল্যান",
        member_since: "সদস্য হয়েছেন",
        renews_on: "নবায়ন হবে",
        settings: "সেটিংস",
        generation_history: "জেনারেসন ইতিহাস",
        sign_out: "সাইন আউট",
        payment_manual_review_note_part1: "দ্রষ্টব্য: এটি একটি ম্যানুয়াল পর্যালোচনা প্রক্রিয়া। আপনার প্রিমিয়াম স্ট্যাটাস ৬ ঘন্টার মধ্যে (সাধারণত ১ ঘন্টার মধ্যে) সক্রিয় করা হবে। যদি খুব বেশি সময় লাগে, অনুগ্রহ করে এখানে যোগাযোগ করুন: ",
        payment_manual_review_note_contact: "নিশান রহমান",
        payment_manual_review_note_part2: "। আপনার ধৈর্যের জন্য ধন্যবাদ।",
        premium_pending_desc: "আপনার অনুরোধ পর্যালোচনার অধীনে আছে। এতে সাধারণত কয়েক ঘন্টা সময় লাগে।",
        profile_developed_by: "ডেভেলপ করেছেন",
        payment_send_to: "অনুগ্রহ করে নিচের যেকোনো একটি নম্বরে পেমেন্ট পাঠান:",
        payment_bkash: "বিকাশ",
        payment_nagad: "নগদ",

        // Shopping Assistant
        find_stores: "সেরা দোকান খুঁজুন",
        getting_location: "আপনার অবস্থান জানা হচ্ছে...",
        finding_stores: "আপনার জন্য সেরা দোকান খোঁজা হচ্ছে...",
        ai_recommendations: "এআই সুপারিশ",
        assistant_title: "সেরা স্থানীয় দোকান খুঁজুন",
        assistant_desc: "আমাদের AI আপনার কেনাকাটার তালিকা বিশ্লেষণ করে আপনার কাছাকাছি সেরা রেটযুক্ত, সবচেয়ে সুবিধাজনক মুদি দোকান খুঁজে দেবে।",
        assistant_empty_list: "আপনার কেনাকাটার তালিকা খালি। সহকারী ব্যবহার করতে আইটেম যোগ করুন।",
        assistant_searching: "অনুসন্ধান করা হচ্ছে...",
        assistant_suggested_stores: "প্রস্তাবিত দোকান:",

        // Ads
        ads_generating: "আপনার রেসিপি তৈরি হচ্ছে...",
        ads_wait: "অনুগ্রহ করে অপেক্ষা করুন, চমৎকার জিনিস আসছে!",
        ads_advertisement: "বিজ্ঞাপন",

        // Planner Page
        planner_title: "খাবার পরিকল্পনা",
        planner_preferences: "আপনার পছন্দ সেট করুন",
        planner_diet_pref: "খাদ্য পছন্দ",
        planner_calories: "দৈনিক ক্যালোরি (আনুমানিক)",
        planner_generate: "প্ল্যান তৈরি করুন",
        planner_loading: "আপনার ব্যক্তিগতকৃত খাবার পরিকল্পনা তৈরি করা হচ্ছে...",
        breakfast: "সকালের নাস্তা",
        lunch: "দুপুরের খাবার",
        dinner: "রাতের খাবার",

        // Pantry Page
        pantry_title: "স্মার্ট কিচেন",
        pantry_sort: "সাজান",
        pantry_add: "আইটেম যোগ করুন",
        pantry_sort_expiry: "মেয়াদ শেষ হওয়ার তারিখ",
        pantry_sort_name_asc: "নাম (A-Z)",
        pantry_sort_name_desc: "নাম (Z-A)",
        pantry_expires: "মেয়াদ শেষ হবে",
        pantry_empty_title: "আপনার প্যান্ট্রি খালি",
        pantry_empty_desc: "আপনার উপাদান ট্র্যাক করতে আপনার স্মার্ট রান্নাঘরে আইটেম যোগ করুন।",
        pantry_modal_title: "প্যান্ট্রিতে যোগ করুন",
        pantry_modal_name: "আইটেমের নাম",
        pantry_modal_quantity: "পরিমাণ",
        pantry_modal_expiry: "মেয়াদ শেষ হওয়ার তারিখ",
        pantry_modal_notes: "নোট (ঐচ্ছিক)",
        pantry_modal_add_button: "আইটেম যোগ করুন",

        // Shopping List Page
        shopping_list_title: "কেনাকাটার তালিকা",
        shopping_list_placeholder_name: "আপনার কি প্রয়োজন?",
        shopping_list_placeholder_quantity: "পরিমাণ",
        shopping_list_empty_title: "আপনার কেনাকাটার তালিকা খালি",
        shopping_list_empty_desc: "শুরু করতে উপরে আইটেম যোগ করুন।",
        shopping_list_select_all: "সব নির্বাচন করুন",
        shopping_list_uncategorized: "শ্রেণীবিহীন",
        shopping_list_groceries: "মুদিখানা",

        // Details Page
        details_back: "ফলাফলে ফিরে যান",
        details_generating_image: "নতুন ছবি তৈরি করা হচ্ছে...",
        details_regen_image: "ছবি পুনরায় তৈরি করুন",
        details_translate: "অনুবাদ করুন",
        details_original: "মূল",
        details_save: "সংরক্ষণ",
        details_saved: "সংরক্ষিত",
        details_share: "শেয়ার করুন",
        details_copy_link: "লিঙ্ক কপি করুন",
        details_share_twitter: "টুইটারে শেয়ার করুন",
        details_link_copied: "লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!",
        details_time: "সময়",
        details_difficulty: "কঠিনতা",
        details_calories: "ক্যালোরি",
        details_ingredients: "উপাদান",
        details_instructions: "নির্দেশাবলী",
        details_source: "উৎস",
        details_source_ai: "এআই দ্বারা তৈরি",
        details_add_missing: "তালিকাভুক্ত নয় এমন {count}টি আইটেম যোগ করুন",
        details_timer_start: "{minutes} মিনিটের টাইমার শুরু করুন",
        details_regen_modal_title: "ছবি পুনরায় তৈরি করুন",
        details_regen_modal_style: "স্টাইল",
        details_regen_modal_aspect: "আনুমানিক অনুপাত",
        details_regen_modal_premium_note: "ভিন্ন আনুমানিক অনুপাত আনলক করতে প্রিমিয়ামে আপগ্রেড করুন।",
        details_regen_modal_generate: "তৈরি করুন",

        // Results Page
        results_back_to_search: "অনুসন্ধানে ফিরে যান",
        results_generated_recipes: "তৈরি করা রেসিপি",
        results_not_found_title: "কোন রেসিপি পাওয়া যায়নি",
        results_not_found_desc: "কোন রেসিপি তৈরি হয়নি। অনুগ্রহ করে ফিরে যান এবং অন্য কিছু দিয়ে অনুসন্ধান করুন।",
        results_image_failed: "ছবি লোড হয়নি",

        // Cooking Mode
        cooking_step: "ধাপ {current} / {total}",
        cooking_timer_title: "টাইমার",
        cooking_not_found: "রেসিপি পাওয়া যায়নি।",
        cooking_go_home: "হোমে যান",

        // History Page
        history_back: "প্রোফাইলে ফিরে যান",
        history_title: "জেনারেসন ইতিহাস",
        history_empty_title: "এখনও কোন ইতিহাস নেই",
        history_empty_desc: "আপনার রেসিপি তৈরির ইতিহাস এখানে দেখা যাবে।",
    },
    es: {
        nav_home: 'Inicio',
        nav_meal_plan: 'Plan de Comidas',
        nav_meal_plan_mobile: 'Plan',
        nav_pantry: 'Cocina Inteligente',
        nav_pantry_mobile: 'Despensa',
        nav_shopping_list: 'Lista de Compras',
        nav_shopping_list_mobile: 'Lista',
        nav_assistant: 'Asistente',
        nav_profile: 'Perfil',
        home_title: "¿Qué hay en tu Cocina?",
        home_subtitle: "Introduce los ingredientes que tienes o busca por nombre. ¡Nuestra IA preparará deliciosas recetas para ti!",
        by_ingredients_tab: "Por Ingredientes",
        by_name_tab: "Por Nombre de Receta",
        placeholder_ingredients: "ej., pechuga de pollo, tomates, albahaca, pasta",
        placeholder_search: "ej., 'Spaghetti Carbonara' o 'Tacos Veganos'",
        advanced_options: "Opciones Avanzadas",
        number_of_recipes: "Número de Recetas",
        recipes: 'Recetas',
        dietary_preferences: "Preferencias Dietéticas",
        cooking_time: "Tiempo de Cocción",
        generate_recipes: "Generar Recetas",
        vegetarian: "Vegetariano",
        vegan: "Vegano",
        gluten_free: "Sin Gluten",
        keto: "Keto",
        high_protein: "Alta en Proteínas",
        low_carb: "Baja en Carbohidratos",
        halal: "Halal",
        any_time: "Cualquiera",
        fast_time: "Rápido (<30 min)",
        medium_time: "Medio (30-60 min)",
        long_time: "Largo (>60 min)",
        welcome_message: "Bienvenido a MealMind AI",
        create_account_prompt: "Crea una cuenta para empezar.",
        signin_prompt: "Inicia sesión para continuar.",
        name_placeholder: "Tu Nombre",
        email_placeholder: "Dirección de Correo Electrónico",
        password_placeholder: "Contraseña",
        signup_button: "Registrarse",
        signin_button: "Iniciar Sesión",
        processing: "Procesando...",
        already_have_account: "¿Ya tienes una cuenta?",
        dont_have_account: "¿No tienes una cuenta?",
        admin_panel: 'Panel de Administrador',
        pending_requests: 'Solicitudes Pendientes',
        user_management: 'Gestión de Usuarios',
        approve: 'Aprobar',
        reject: 'Rechazar',
        no_pending_requests: 'No hay solicitudes pendientes.',
        all_users: 'Todos los Usuarios',
        user: 'Usuario',
        status: 'Estado',
        actions: 'Acciones',
        active: 'Activo',
        pending: 'Pendiente',
        none: 'Ninguno',
        make_active: 'Hacer Activo',
        make_pending: 'Hacer Pendiente',
        remove_premium: 'Quitar Premium',
        subscription_status: 'Estado de Suscripción',
        pending_approval: 'Pendiente de Aprobación',
        premium_member: 'Miembro Premium',
        upgrade_to_premium: 'Actualizar a Premium',
        go_premium: 'Hazte Premium',
        get_premium: 'Obtener Premium',
        payment_method: 'Método de Pago',
        transaction_id: 'ID de Transacción',
        sender_number: 'Número del Remitente (Opcional)',
        submit_payment: 'Enviar para Revisión',
        premium_desc: "¡Desbloquea todas las funciones, incluyendo recetas ilimitadas, planificación de comidas y fotos con calidad de estudio!",
        payment_instructions: "Por favor, realiza el pago y envía los detalles a continuación para su verificación.",
        subscription_management: "Gestión de Suscripción",
        plan: "Plan",
        member_since: "Miembro Desde",
        renews_on: "Se Renueva El",
        settings: "Configuración",
        generation_history: "Historial de Generación",
        sign_out: "Cerrar Sesión",
        payment_manual_review_note_part1: "NOTA: Este es un proceso de revisión manual. Su estado premium se activará en 6 horas (generalmente en 1 hora). Si tarda demasiado, contáctenos aquí: ",
        payment_manual_review_note_contact: "Nishan Rahman",
        payment_manual_review_note_part2: ". Gracias por su paciencia.",
        find_stores: "Encontrar las Mejores Tiendas",
        getting_location: "Obteniendo tu ubicación...",
        finding_stores: "Buscando las mejores tiendas para ti...",
        ai_recommendations: "Recomendaciones de IA",
        results_back_to_search: "Volver a la Búsqueda",
        results_generated_recipes: "Recetas Generadas",
        results_not_found_title: "No se Encontraron Recetas",
        results_not_found_desc: "No se generaron recetas. Por favor, vuelve e intenta una búsqueda diferente.",
        results_image_failed: "Error en la imagen",
        premium_pending_desc: "Tu solicitud está en revisión. Esto suele tardar unas horas.",
        profile_developed_by: "Desarrollado por",
        payment_send_to: "Por favor, envía el pago a uno de los siguientes números:",
        payment_bkash: "Bkash",
        payment_nagad: "Nagad",
        assistant_title: "Encuentra las Mejores Tiendas Locales",
        assistant_desc: "Deja que nuestra IA analice tu lista de compras y encuentre las tiendas de comestibles mejor valoradas y más convenientes cerca de ti.",
        assistant_empty_list: "Tu lista de compras está vacía. Añade artículos para usar el asistente.",
        assistant_searching: "Buscando...",
        assistant_suggested_stores: "Tiendas Sugeridas:",
        admin_method: "Método",
        admin_txid: "ID de Transacción",
        admin_sender: "Remitente",
        admin_na: "N/A",
        admin_requested: "Solicitado",
        admin_admin_tag: "(Admin)",
        shopping_list_uncategorized: "Sin Categoría",
        shopping_list_groceries: "Comestibles",
    },
    fr: {
        nav_home: 'Accueil',
        nav_meal_plan: 'Plan de Repas',
        nav_meal_plan_mobile: 'Plan',
        nav_pantry: 'Cuisine Intelligente',
        nav_pantry_mobile: 'Garde-manger',
        nav_shopping_list: 'Liste de Courses',
        nav_shopping_list_mobile: 'Liste',
        nav_assistant: 'Assistant',
        nav_profile: 'Profil',
        home_title: "Qu'y a-t-il dans votre Cuisine ?",
        home_subtitle: "Entrez les ingrédients que vous avez, ou recherchez par nom. Notre IA vous concoctera de délicieuses recettes !",
        by_ingredients_tab: "Par Ingrédients",
        by_name_tab: "Par Nom de Recette",
        placeholder_ingredients: "ex: poitrine de poulet, tomates, basilic, pâtes",
        placeholder_search: "ex: 'Spaghetti Carbonara' ou 'Tacos Végétaliens'",
        advanced_options: "Options Avancées",
        number_of_recipes: "Nombre de Recettes",
        recipes: 'Recettes',
        dietary_preferences: "Préférences Alimentaires",
        cooking_time: "Temps de Cuisson",
        generate_recipes: "Générer des Recettes",
        vegetarian: "Végétarien",
        vegan: "Végétalien",
        gluten_free: "Sans Gluten",
        keto: "Céto",
        high_protein: "Riche en Protéines",
        low_carb: "Faible en Glucides",
        halal: "Halal",
        any_time: "Tous",
        fast_time: "Rapide (<30 min)",
        medium_time: "Moyen (30-60 min)",
        long_time: "Long (>60 min)",
        welcome_message: "Bienvenue sur MealMind AI",
        create_account_prompt: "Créez un compte pour commencer.",
        signin_prompt: "Connectez-vous pour continuer.",
        name_placeholder: "Votre Nom",
        email_placeholder: "Adresse E-mail",
        password_placeholder: "Mot de passe",
        signup_button: "S'inscrire",
        signin_button: "Se Connecter",
        processing: "En cours...",
        already_have_account: "Vous avez déjà un compte ?",
        dont_have_account: "Vous n'avez pas de compte ?",
        admin_panel: 'Panneau d\'Administration',
        pending_requests: 'Demandes en Attente',
        user_management: 'Gestion des Utilisateurs',
        approve: 'Approuver',
        reject: 'Rejeter',
        no_pending_requests: 'Aucune demande en attente.',
        all_users: 'Tous les Utilisateurs',
        user: 'Utilisateur',
        status: 'Statut',
        actions: 'Actions',
        active: 'Actif',
        pending: 'En attente',
        none: 'Aucun',
        make_active: 'Rendre Actif',
        make_pending: 'Mettre en attente',
        remove_premium: 'Supprimer Premium',
        subscription_status: 'Statut de l\'Abonnement',
        pending_approval: 'En Attente d\'Approbation',
        premium_member: 'Membre Premium',
        upgrade_to_premium: 'Passer à Premium',
        go_premium: 'Devenir Premium',
        get_premium: 'Obtenir Premium',
        payment_method: 'Moyen de Paiement',
        transaction_id: 'ID de Transaction',
        sender_number: 'Numéro de l\'Expéditeur (Optionnel)',
        submit_payment: 'Soumettre pour Examen',
        premium_desc: "Débloquez toutes les fonctionnalités, y compris les recettes illimitées, la planification des repas et des photos de qualité studio !",
        payment_instructions: "Veuillez effectuer le paiement et soumettre les détails ci-dessous pour vérification.",
        subscription_management: "Gestion de l'Abonnement",
        plan: "Forfait",
        member_since: "Membre Depuis",
        renews_on: "Se Renouvelle Le",
        settings: "Paramètres",
        generation_history: "Historique de Génération",
        sign_out: "Se Déconnecter",
        payment_manual_review_note_part1: "NOTE : Il s'agit d'un processus d'examen manuel. Votre statut premium sera activé dans les 6 heures (généralement en 1 heure). Si cela prend trop de temps, veuillez nous contacter ici : ",
        payment_manual_review_note_contact: "Nishan Rahman",
        payment_manual_review_note_part2: ". Merci de votre patience.",
        find_stores: "Trouver les Meilleurs Magasins",
        getting_location: "Obtention de votre position...",
        finding_stores: "Recherche des meilleurs magasins pour vous...",
        ai_recommendations: "Recommandations de l'IA",
        results_back_to_search: "Retour à la recherche",
        results_generated_recipes: "Recettes générées",
        results_not_found_title: "Aucune recette trouvée",
        results_not_found_desc: "Aucune recette n'a été générée. Veuillez revenir en arrière et essayer une autre recherche.",
        results_image_failed: "Échec de l'image",
        premium_pending_desc: "Votre demande est en cours d'examen. Cela prend généralement quelques heures.",
        profile_developed_by: "Développé par",
        payment_send_to: "Veuillez envoyer le paiement à l'un des numéros ci-dessous :",
        payment_bkash: "Bkash",
        payment_nagad: "Nagad",
        assistant_title: "Trouver les meilleurs magasins locaux",
        assistant_desc: "Laissez notre IA analyser votre liste de courses et trouver les épiceries les mieux notées et les plus pratiques près de chez vous.",
        assistant_empty_list: "Votre liste de courses est vide. Ajoutez des articles pour utiliser l'assistant.",
        assistant_searching: "Recherche en cours...",
        assistant_suggested_stores: "Magasins suggérés :",
        admin_method: "Méthode",
        admin_txid: "ID de transaction",
        admin_sender: "Expéditeur",
        admin_na: "N/A",
        admin_requested: "Demandé",
        admin_admin_tag: "(Admin)",
        shopping_list_uncategorized: "Non classé",
        shopping_list_groceries: "Épicerie",
    },
    ja: {
        nav_home: 'ホーム',
        nav_meal_plan: '食事プラン',
        nav_meal_plan_mobile: 'プラン',
        nav_pantry: 'スマートキッチン',
        nav_pantry_mobile: 'パントリー',
        nav_shopping_list: '買い物リスト',
        nav_shopping_list_mobile: 'リスト',
        nav_assistant: 'アシスタント',
        nav_profile: 'プロフィール',
        home_title: "キッチンには何がありますか？",
        home_subtitle: "持っている食材を入力するか、名前で検索してください。AIが美味しいレシピを提案します！",
        by_ingredients_tab: "食材で検索",
        by_name_tab: "レシピ名で検索",
        placeholder_ingredients: "例：鶏胸肉、トマト、バジル、パスタ",
        placeholder_search: "例：「スパゲッティ・カルボナーラ」または「ビーガンタコス」",
        advanced_options: "詳細オプション",
        number_of_recipes: "レシピの数",
        recipes: 'レシピ',
        dietary_preferences: "食事の好み",
        cooking_time: "調理時間",
        generate_recipes: "レシピを生成",
        vegetarian: "ベジタリアン",
        vegan: "ビーガン",
        gluten_free: "グルテンフリー",
        keto: "ケト",
        high_protein: "高タンパク",
        low_carb: "低炭水化物",
        halal: "ハラル",
        any_time: "すべて",
        fast_time: "短い（<30分）",
        medium_time: "普通（30-60分）",
        long_time: "長い（>60分）",
        welcome_message: "MealMind AIへようこそ",
        create_account_prompt: "アカウントを作成して始めましょう。",
        signin_prompt: "続行するにはサインインしてください。",
        name_placeholder: "名前",
        email_placeholder: "メールアドレス",
        password_placeholder: "パスワード",
        signup_button: "新規登録",
        signin_button: "サインイン",
        processing: "処理中...",
        already_have_account: "すでにアカウントをお持ちですか？",
        dont_have_account: "アカウントをお持ちではありませんか？",
        admin_panel: '管理パネル',
        pending_requests: '保留中のリクエスト',
        user_management: 'ユーザー管理',
        approve: '承認',
        reject: '拒否',
        no_pending_requests: '保留中のリクエストはありません。',
        all_users: 'すべてのユーザー',
        user: 'ユーザー',
        status: 'ステータス',
        actions: 'アクション',
        active: 'アクティブ',
        pending: '保留中',
        none: 'なし',
        make_active: 'アクティブにする',
        make_pending: '保留中にする',
        remove_premium: 'プレミアムを削除',
        subscription_status: 'サブスクリプション状況',
        pending_approval: '承認待ち',
        premium_member: 'プレミアムメンバー',
        upgrade_to_premium: 'プレミアムにアップグレード',
        go_premium: 'プレミアムに登録',
        get_premium: 'プレミアムを取得',
        payment_method: '支払い方法',
        transaction_id: '取引ID',
        sender_number: '送信者番号（任意）',
        submit_payment: 'レビューのために送信',
        premium_desc: "無制限のレシピ、食事計画、スタジオ品質の写真など、すべての機能のロックを解除してください！",
        payment_instructions: "お支払いを完了し、確認のために以下の詳細を送信してください。",
        subscription_management: "サブスクリプション管理",
        plan: "プラン",
        member_since: "メンバーシップ開始日",
        renews_on: "更新日",
        settings: "設定",
        generation_history: "生成履歴",
        sign_out: "サインアウト",
        payment_manual_review_note_part1: "注：これは手動のレビュープロセスです。プレミアムステータスは6時間以内（通常1時間以内）に有効になります。時間がかかりすぎる場合は、こちらまでご連絡ください：",
        payment_manual_review_note_contact: "Nishan Rahman",
        payment_manual_review_note_part2: "。しばらくお待ちいただきありがとうございます。",
        find_stores: "最適なお店を探す",
        getting_location: "位置情報を取得中...",
        finding_stores: "あなたに最適なお店を探しています...",
        ai_recommendations: "AIのおすすめ",
        results_back_to_search: "検索に戻る",
        results_generated_recipes: "生成されたレシピ",
        results_not_found_title: "レシピが見つかりません",
        results_not_found_desc: "レシピは生成されませんでした。戻って別の検索をお試しください。",
        results_image_failed: "画像の読み込みに失敗しました",
        premium_pending_desc: "あなたのリクエストはレビュー中です。これには通常数時間かかります。",
        profile_developed_by: "開発者",
        payment_send_to: "以下のいずれかの番号にお支払いを送信してください：",
        payment_bkash: "Bkash",
        payment_nagad: "Nagad",
        assistant_title: "最高の地元のお店を見つける",
        assistant_desc: "AIに買い物リストを分析させ、お近くで最も評価が高く便利な食料品店を見つけさせましょう。",
        assistant_empty_list: "買い物リストは空です。アシスタントを使用するにはアイテムを追加してください。",
        assistant_searching: "検索中...",
        assistant_suggested_stores: "おすすめの店舗：",
        admin_method: "方法",
        admin_txid: "取引ID",
        admin_sender: "送信者",
        admin_na: "該当なし",
        admin_requested: "リクエスト日時",
        admin_admin_tag: "（管理者）",
        shopping_list_uncategorized: "未分類",
        shopping_list_groceries: "食料品",
    },
    de: {
        nav_home: "Startseite",
        nav_meal_plan: "Speiseplan",
        nav_meal_plan_mobile: "Plan",
        nav_pantry: "Smarte Küche",
        nav_pantry_mobile: "Vorratskammer",
        nav_shopping_list: "Einkaufsliste",
        nav_shopping_list_mobile: "Liste",
        nav_assistant: "Assistent",
        nav_profile: "Profil",
        home_title: "Was ist in Ihrer Küche?",
        home_subtitle: "Geben Sie Zutaten ein, die Sie haben, oder suchen Sie nach Namen. Unsere KI wird köstliche Rezepte für Sie zaubern!",
        generate_recipes: "Rezepte generieren",
        recipes: 'Rezepte',
    },
    it: {
        nav_home: "Home",
        nav_meal_plan: "Piano Pasti",
        nav_meal_plan_mobile: "Piano",
        nav_pantry: "Cucina Intelligente",
        nav_pantry_mobile: "Dispensa",
        nav_shopping_list: "Lista Spesa",
        nav_shopping_list_mobile: "Lista",
        nav_assistant: "Assistente",
        nav_profile: "Profilo",
        home_title: "Cosa c'è nella tua cucina?",
        home_subtitle: "Inserisci gli ingredienti che hai o cerca per nome. La nostra IA preparerà ricette deliziose per te!",
        generate_recipes: "Genera Ricette",
        recipes: 'Ricette',
    },
    pt: {
        nav_home: "Início",
        nav_meal_plan: "Plano de Refeições",
        nav_meal_plan_mobile: "Plano",
        nav_pantry: "Cozinha Inteligente",
        nav_pantry_mobile: "Despensa",
        nav_shopping_list: "Lista de Compras",
        nav_shopping_list_mobile: "Lista",
        nav_assistant: "Assistente",
        nav_profile: "Perfil",
        home_title: "O que há na sua cozinha?",
        home_subtitle: "Digite os ingredientes que você tem ou pesquise por nome. Nossa IA irá preparar receitas deliciosas para você!",
        generate_recipes: "Gerar Receitas",
        recipes: 'Receitas',
    },
    ko: {
        nav_home: "홈",
        nav_meal_plan: "식단 계획",
        nav_meal_plan_mobile: "계획",
        nav_pantry: "스마트 키친",
        nav_pantry_mobile: "식료품 저장실",
        nav_shopping_list: "쇼핑 목록",
        nav_shopping_list_mobile: "목록",
        nav_assistant: "어시스턴트",
        nav_profile: "프로필",
        home_title: "주방에 무엇이 있나요?",
        home_subtitle: "가지고 있는 재료를 입력하거나 이름으로 검색하세요. 저희 AI가 맛있는 레시피를 만들어 드립니다!",
        generate_recipes: "레시피 생성",
        recipes: '레시피',
    },
    zh: {
        nav_home: "首页",
        nav_meal_plan: "膳食计划",
        nav_meal_plan_mobile: "计划",
        nav_pantry: "智能厨房",
        nav_pantry_mobile: "食品柜",
        nav_shopping_list: "购物清单",
        nav_shopping_list_mobile: "清单",
        nav_assistant: "助手",
        nav_profile: "个人资料",
        home_title: "你的厨房里有什么？",
        home_subtitle: "输入您拥有的食材，或按名称搜索。我们的AI将为您制作美味的食谱！",
        generate_recipes: "生成食谱",
        recipes: '食谱',
    },
    hi: {
        nav_home: "होम",
        nav_meal_plan: "भोजन योजना",
        nav_meal_plan_mobile: "योजना",
        nav_pantry: "स्मार्ट किचन",
        nav_pantry_mobile: "पेंट्री",
        nav_shopping_list: "खरीदारी की सूची",
        nav_shopping_list_mobile: "सूची",
        nav_assistant: "सहायक",
        nav_profile: "प्रोफ़ाइल",
        home_title: "आपकी रसोई में क्या है?",
        home_subtitle: "आपके पास मौजूद सामग्री दर्ज करें, या नाम से खोजें। हमारा AI आपके लिए स्वादिष्ट व्यंजन तैयार करेगा!",
        generate_recipes: "व्यंजन बनाएं",
        recipes: 'व्यंजन',
    },
    ar: {
        nav_home: "الرئيسية",
        nav_meal_plan: "خطة الوجبات",
        nav_meal_plan_mobile: "خطة",
        nav_pantry: "مطبخ ذكي",
        nav_pantry_mobile: "خزانة",
        nav_shopping_list: "قائمة التسوق",
        nav_shopping_list_mobile: "قائمة",
        nav_assistant: "مساعد",
        nav_profile: "الملف الشخصي",
        home_title: "ماذا يوجد في مطبخك؟",
        home_subtitle: "أدخل المكونات التي لديك، أو ابحث بالاسم. سيقوم الذكاء الاصطناعي لدينا بإعداد وصفات لذيذة لك!",
        generate_recipes: "إنشاء وصفات",
        recipes: 'وصفات',
    }
};

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error)
        {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useLocalStorage<UserProfile | null>('currentUser', null);
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
    
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [pantry, setPantry] = useState<PantryItem[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    
    const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
    
    const [globalTimer, setGlobalTimer] = useState<TimerState>({ isActive: false, isPaused: false, remainingSeconds: 0, recipeId: null, recipeTitle: null });

    const user = useMemo(() => {
        if (!currentUser) return null;
        return allUsers.find(u => u.id === currentUser.id) || null;
    }, [currentUser, allUsers]);

    useEffect(() => {
        const bootstrapApp = async () => {
            setIsInitialLoading(true);
            
            const allUsersFromApi = await api.apiGetAllUsers();
            setAllUsers(allUsersFromApi);

            let sessionUser = null;
            try {
                const sessionItem = localStorage.getItem('currentUser');
                if (sessionItem) {
                    sessionUser = JSON.parse(sessionItem);
                }
            } catch (e) {
                console.error("Failed to parse session user", e);
                localStorage.removeItem('currentUser');
            }

            if (sessionUser && allUsersFromApi.some(u => u.id === sessionUser.id)) {
                setCurrentUser(sessionUser);
                
                const userData = await api.apiLoadUserData(sessionUser.id);
                setPantry(userData.pantry || []);
                setShoppingList(userData.shoppingList || []);
                setHistory(userData.history || []);
                setSavedRecipes(userData.savedRecipes || []);
                
                if (sessionUser.role === 'admin') {
                    const payments = await api.apiGetPendingPayments();
                    setPendingPayments(payments);
                }
            } else {
                setCurrentUser(null);
                setPantry([]);
                setShoppingList([]);
                setHistory([]);
                setSavedRecipes([]);
                setPendingPayments([]);
            }

            setIsInitialLoading(false);
        };

        bootstrapApp();
    }, []);

    const signInUser = async (email, password) => {
        const userFound = await api.apiSignInUser(email, password);
        if (userFound) {
            setCurrentUser(userFound);
            const users = await api.apiGetAllUsers();
            setAllUsers(users);
            const userData = await api.apiLoadUserData(userFound.id);
            setPantry(userData.pantry || []);
            setShoppingList(userData.shoppingList || []);
            setHistory(userData.history || []);
            setSavedRecipes(userData.savedRecipes || []);
            if (userFound.role === 'admin') {
                const payments = await api.apiGetPendingPayments();
                setPendingPayments(payments);
            }
            toast.success("Login successful!");
            return true;
        }
        toast.error("Invalid credentials.");
        return false;
    };

    const signUpUser = async (name, email, password) => {
        const result = await api.apiSignUpUser(name, email, password);
        if (result.success) {
            setAllUsers(prev => [...prev, result.user!]);
            setCurrentUser(result.user);
            setPantry([]);
            setShoppingList([]);
            setHistory([]);
            setSavedRecipes([]);
            toast.success("Account created successfully!");
            return true;
        }
        toast.error(result.message);
        return false;
    };

    const signOutUser = () => {
        setCurrentUser(null);
        setPantry([]);
        setShoppingList([]);
        setHistory([]);
        setSavedRecipes([]);
        setGeneratedRecipes([]);
        setPendingPayments([]);
    };

    const addToHistory = useCallback(async (query: string, recipeCount: number) => {
        if (!user) return;
        const newHistory = [{ id: crypto.randomUUID(), query, recipeCount, timestamp: new Date().toISOString() }, ...history].slice(0, 50);
        setHistory(newHistory);
        await api.apiUpdateUserData(user.id, 'history', newHistory);
    }, [history, user]);

    const addToShoppingList = useCallback(async (items: { name: string; quantity: string; category: string }[]) => {
        if (!user) return;
        const newItems = items.map(item => ({...item, id: crypto.randomUUID(), checked: false}));
        const newList = [...shoppingList, ...newItems];
        setShoppingList(newList);
        await api.apiUpdateUserData(user.id, 'shoppingList', newList);
    }, [shoppingList, user]);

    const updateShoppingListItem = useCallback(async (id: string, updates: Partial<ShoppingListItem>) => {
        if (!user) return;
        const newList = shoppingList.map(item => item.id === id ? {...item, ...updates} : item);
        setShoppingList(newList);
        await api.apiUpdateUserData(user.id, 'shoppingList', newList);
    }, [shoppingList, user]);
    
    const removeShoppingListItem = useCallback(async (id: string) => {
        if (!user) return;
        const newList = shoppingList.filter(item => item.id !== id);
        setShoppingList(newList);
        await api.apiUpdateUserData(user.id, 'shoppingList', newList);
    }, [shoppingList, user]);

    const toggleAllShoppingListItems = useCallback(async () => {
        if (!user) return;
        const allChecked = shoppingList.length > 0 && shoppingList.every(item => item.checked);
        const newList = shoppingList.map(item => ({ ...item, checked: !allChecked }));
        setShoppingList(newList);
        await api.apiUpdateUserData(user.id, 'shoppingList', newList);
    }, [shoppingList, user]);
    
    const addToPantry = useCallback(async (item: Omit<PantryItem, 'id'>) => {
        if (!user) return;
        const newPantry = [...pantry, {...item, id: crypto.randomUUID()}];
        setPantry(newPantry);
        await api.apiUpdateUserData(user.id, 'pantry', newPantry);
    }, [pantry, user]);
    
    const updatePantryItem = useCallback(async (id: string, updates: Partial<PantryItem>) => {
        if (!user) return;
        const newPantry = pantry.map(item => item.id === id ? {...item, ...updates} : item);
        setPantry(newPantry);
        await api.apiUpdateUserData(user.id, 'pantry', newPantry);
    }, [pantry, user]);
    
    const removePantryItem = useCallback(async (id: string) => {
        if (!user) return;
        const newPantry = pantry.filter(item => item.id !== id);
        setPantry(newPantry);
        await api.apiUpdateUserData(user.id, 'pantry', newPantry);
    }, [pantry, user]);
    
    const toggleSaveRecipe = useCallback(async (recipe: Recipe) => {
        if (!user) return;
        let newSavedRecipes;
        const isSaved = savedRecipes.some(r => r.id === recipe.id);
        if (isSaved) {
            newSavedRecipes = savedRecipes.filter(r => r.id !== recipe.id);
        } else {
            newSavedRecipes = [{...recipe, isSaved: true}, ...savedRecipes];
        }
        setSavedRecipes(newSavedRecipes);
        setGeneratedRecipes(prev => prev.map(r => r.id === recipe.id ? {...r, isSaved: !r.isSaved} : r));
        await api.apiUpdateUserData(user.id, 'savedRecipes', newSavedRecipes);
    }, [savedRecipes, user]);

    const submitForPremium = async (paymentDetails: Omit<PendingPayment, 'id' | 'userId' | 'userName' | 'userEmail' | 'timestamp'>) => {
        if (!user) return false;
        const newPaymentRequest = {
            ...paymentDetails,
            id: crypto.randomUUID(),
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            timestamp: new Date().toISOString()
        };
        const result = await api.apiSubmitForPremium(newPaymentRequest);
        if (result.success) {
            setPendingPayments(result.pendingPayments!);
            setAllUsers(result.users!);
            toast.success("Payment submitted for review.");
            return true;
        }
        return false;
    };
    
    const approvePayment = async (paymentId: string) => {
        const result = await api.apiApprovePayment(paymentId);
        if (result.success) {
            setPendingPayments(result.pendingPayments!);
            setAllUsers(result.users!);
            toast.success("Subscription approved!");
        }
    };
    
    const rejectPayment = async (paymentId: string) => {
        const result = await api.apiRejectPayment(paymentId);
        if (result.success) {
            setPendingPayments(result.pendingPayments!);
            setAllUsers(result.users!);
            toast.error("Subscription rejected.");
        }
    };
    
    const updateUserSubscriptionStatusByAdmin = async (userId: string, newStatus: UserProfile['subscriptionStatus']) => {
        const result = await api.apiUpdateUserSubscription(userId, newStatus);
        if (result.success) {
            setAllUsers(result.users!);
            toast.info("User subscription updated.");
        }
    };

    const t = useMemo(() => (key: string): string => {
        const langPart = translations[language] || translations.en;
        return langPart[key] || translations.en[key] || key;
    }, [language]);
    
    useEffect(() => {
        let interval: number;
        if (globalTimer.isActive && !globalTimer.isPaused && globalTimer.remainingSeconds > 0) {
            interval = window.setInterval(() => {
                setGlobalTimer(prev => ({ ...prev, remainingSeconds: prev.remainingSeconds - 1 }));
            }, 1000);
        } else if (globalTimer.remainingSeconds === 0 && globalTimer.isActive) {
            setGlobalTimer({ isActive: false, isPaused: false, remainingSeconds: 0, recipeId: null, recipeTitle: null });
            new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg').play();
            toast.info("Timer finished!");
        }
        return () => clearInterval(interval);
    }, [globalTimer]);

    const startGlobalTimer = (recipeId, recipeTitle, durationSeconds) => setGlobalTimer({ isActive: true, isPaused: false, remainingSeconds: durationSeconds, recipeId, recipeTitle });
    const togglePauseGlobalTimer = () => setGlobalTimer(prev => ({ ...prev, isPaused: !prev.isPaused }));
    const stopGlobalTimer = () => setGlobalTimer({ isActive: false, isPaused: false, remainingSeconds: 0, recipeId: null, recipeTitle: null });

    const value: AppContextType = useMemo(() => ({
        user, isInitialLoading, signInUser, signUpUser, signOutUser,
        language, setLanguage, t,
        generatedRecipes, setGeneratedRecipes,
        history, addToHistory,
        shoppingList, addToShoppingList, updateShoppingListItem, removeShoppingListItem, toggleAllShoppingListItems,
        pantry, addToPantry, updatePantryItem, removePantryItem,
        savedRecipes, toggleSaveRecipe,
        globalTimer, startGlobalTimer, togglePauseGlobalTimer, stopGlobalTimer,
        submitForPremium,
        pendingPayments,
        approvePayment,
        rejectPayment,
        allUsers,
        updateUserSubscriptionStatusByAdmin,
    }), [
        user, isInitialLoading, language, generatedRecipes, history, shoppingList, pantry, savedRecipes, globalTimer, pendingPayments, allUsers,
        addToHistory, addToShoppingList, updateShoppingListItem, removeShoppingListItem, toggleAllShoppingListItems,
        addToPantry, updatePantryItem, removePantryItem, toggleSaveRecipe, signInUser, signUpUser, signOutUser
    ]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};