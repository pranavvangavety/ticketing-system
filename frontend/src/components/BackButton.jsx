import React from "react";
import {useNavigate} from "react-router-dom";

function BackButton({label = "Dashboard"}) {
    const navigate = useNavigate();

    return(
      <button onClick={() => navigate("/dashboard")} className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to {label}
      </button>
    );
}
export default BackButton;