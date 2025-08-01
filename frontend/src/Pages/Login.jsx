import React, { useEffect, useState } from 'react';
import axios, { resetSessionAlertFlag } from "../lib/axios.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from 'react-google-recaptcha';
import { Loader2 } from "lucide-react";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    const handleCaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    function handleSubmit(e) {
        e.preventDefault();

        if (!recaptchaToken) {
            setErrorMessage("Please complete the CAPTCHA.");
            return;
        }

        setLoading(true);

        axios.post('http://localhost:8080/auth/login', {
            username,
            password,
            recaptchaToken
        })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('lastLogin', response.data.lastLogin);
                const decoded = jwtDecode(response.data.token);
                const role = decoded.authorities?.[0];
                localStorage.setItem("role", role);
                localStorage.setItem('username', username);
                setTimeout(() => {
                    navigate(role === "ROLE_ADMIN" ? "/admin" : "/dashboard");
                }, 500);
            })
            .catch(error => {
                setErrorMessage(error.response?.data?.message || 'Login Failed');
            })
            .finally(() => {
                setLoading(false);
            });

        resetSessionAlertFlag();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md transition-all">

                <h1 className="text-3xl font-bold text-center text-blue-600 mb-2 uppercase tracking-wide">
                    Ticketing System
                </h1>

                <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <p className="text-red-600 text-sm text-center">{errorMessage}</p>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-center pt-2">
                        <ReCAPTCHA
                            sitekey="6LcKF30rAAAAADLPuZOzauGCipNJQr4___zPf-8w"
                            onChange={handleCaptchaChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <div className="text-center mt-3">
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
