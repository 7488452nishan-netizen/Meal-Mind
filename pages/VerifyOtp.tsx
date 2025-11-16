import React from 'react';
import { Mail } from 'lucide-react';

const VerifyOtp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 animate-scaleIn text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold font-display text-gray-800">Verify Your Account</h1>
                <p className="text-gray-500 mt-2">
                    An OTP would be sent to your email in a real application.
                </p>
                <div className="my-6">
                    <p className="text-gray-600">This feature is not currently active in the app's workflow.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
