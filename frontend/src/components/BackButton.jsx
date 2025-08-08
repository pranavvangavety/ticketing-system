import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton() {
    const navigate = useNavigate();

    const handleBack = () => {
        const role = localStorage.getItem("role");
        // console.log("Back button role:", role);

        if (role === "ROLE_RESOLVER") {
            navigate("/resolver");
        } else if (role === "ROLE_ADMIN") {
            navigate("/admin");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition"
        >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Dashboard
        </button>
    );
}

export default BackButton;
