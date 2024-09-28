import React from 'react';
import ApproveLogo from './ApproveLogo';

export default function RegisterLoginSuccess() {
    return (
        <div className="flex flex-col justify-center items-center h-screen ">
            <button className="w-36 mb-12 relative right-11">
                <ApproveLogo />
            </button>
            <div className="text-center">
                <h1 className="font-semibold text-6xl text-green-600 mb-2 ">Registered Successfully!</h1>
                <p className="mt-3 text-xl text-gray-700">A greetings email has been sent to your email, please check it out!</p>
            </div>
        </div>
    );
}
