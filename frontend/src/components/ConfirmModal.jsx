import React from "react";
import { X } from "lucide-react";

function ConfirmModal({ visible, title = "Are you sure?", message, onConfirm, onCancel }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border border-gray-200 animate-scale-in">


                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-5 h-5" />
                </button>


                <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
                    {title}
                </h2>

                <p className="text-sm text-gray-600 mb-6 text-center">
                    {message}
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition font-medium shadow-sm"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-300 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
