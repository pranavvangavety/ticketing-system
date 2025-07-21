import React, { createContext, useState, useContext, useEffect } from "react";
import SessionExpiredModal from "../components/SessionExpiredModal";

const SessionModalContext = createContext();

export function useSessionModal() {
    return useContext(SessionModalContext);
}

export function SessionModalProvider({ children }) {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => {
            setShowModal(true);
        };

        window.addEventListener("sessionExpired", handleSessionExpired);

        return () => {
            window.removeEventListener("sessionExpired", handleSessionExpired);
        };
    }, []);

    const handleRedirect = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <SessionModalContext.Provider value={{}}>
            {children}
            {showModal && <SessionExpiredModal onComplete={handleRedirect} />}
        </SessionModalContext.Provider>
    );
}
