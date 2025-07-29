import React from "react";
import {getPasswordStrength, isValidPassword} from "../lib/utils.jsx";

function PasswordFields({
                            oldPassword,
                            newPassword,
                            confirmPassword,
                            setOldPassword,
                            setNewPassword,
                            setConfirmPassword,
                            showOld = true
                        }) {
    const strength = getPasswordStrength(newPassword);

    return (
        <div className="space-y-4">
            {showOld && (
                <div>
                    <label className="block text-sm font-medium mb-1">Old Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {newPassword && (
                    <>
                        <div className="flex items-center justify-between mt-2 mb-1">
                            <span className="text-sm text-gray-500">Password Strength</span>
                            <span className={`text-sm font-medium ${
                                strength.label === "Weak" ? "text-red-500" :
                                    strength.label === "Medium" ? "text-yellow-500" : "text-green-600"
                            }`}>
                                {strength.label}
                            </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className={`h-full ${strength.color} transition-all duration-300`}
                                style={{
                                    width:
                                        strength.label === "Weak" ? "33%" :
                                            strength.label === "Medium" ? "66%" : "100%"
                                }}
                            />
                        </div>

                        <p className={`text-xs mt-2 ${
                            isValidPassword(newPassword) ? "text-green-600" : "text-red-600"
                        }`}>
                            Use at least 8 characters, including a letter, number, and special character.
                        </p>
                    </>
                )}

            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
        </div>
    );
}

export default PasswordFields;
