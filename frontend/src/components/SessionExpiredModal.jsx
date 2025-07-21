import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

function SessionExpiredModal({ onComplete }) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    onComplete();
                }
                return prev - 1;
            });
        }, 1000);

        const handleKeyDown = (e) => {
            if (e.key === "Escape") e.preventDefault();
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            clearInterval(interval);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-white/20 to-blue-200/10 backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-8 max-w-sm w-full mx-4 text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-12 h-12 text-yellow-300 drop-shadow-glow" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2 tracking-wide">Session Expired</h2>
                <p className="text-white/80 mb-4">
                    You’ve been logged out. Redirecting in <span className="font-bold">{countdown}</span>...
                </p>
            </div>
        </div>
    );
}

export default SessionExpiredModal;
