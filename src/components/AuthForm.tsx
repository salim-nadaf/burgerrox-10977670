// Updated AuthForm.tsx

import React, { useState } from 'react';

const AuthForm = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        // API call to send reset password email
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Updated pattern attribute; regex validation in JS is relied upon instead
                // pattern="[^
\s@]+@[^
\s@]+\.[^
\s@]+"
                required
            />
            <button type="submit">Forgot Password</button>
        </form>
    );
};

export default AuthForm;