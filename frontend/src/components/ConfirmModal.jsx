import React from "react";

function ConfirmModal({ visible, title = "Are you sure?", message, onConfirm, onCancel }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
