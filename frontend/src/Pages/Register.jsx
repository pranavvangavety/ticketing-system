import React, { useEffect, useState, useRef } from "react";
import { UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../lib/axios.js";

function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const firstInputRef = useRef(null);

    const [token, setToken] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });

    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        empid: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get("token");

        if (!tokenFromUrl) {
            setToast({ message: "Invalid or missing registration token.", type: "error" });
            return;
        }


        axios.get(`/auth/validate-token?token=${tokenFromUrl}`)
            .then(res => {
                setToken(tokenFromUrl);
                setForm(prev => ({ ...prev, email: res.data.email })); // Optional: autofill email
                firstInputRef.current?.focus();
            })
            .catch(err => {
                setToast({
                    message: err?.response?.data?.message || "Invalid or expired token.",
                    type: "error"
                });
            });
    }, [location.search]);


    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => setToast({ message: "", type: "" }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const errs = {};
        if (!form.username.trim()) errs.username = "Username is required.";

        if (form.password.length < 8 || !/[a-z]/.test(form.password) ||
            !/\d/.test(form.password) || !/[!@#$%^&*]/.test(form.password)) {
            errs.password = "Password must be 8+ chars with upper, lower, digit, special char.";
        }

        if (!form.name.trim()) errs.name = "Full name is required.";

        if (!/\S+@\S+\.\S+/.test(form.email)) {
            errs.email = "Enter a valid email address.";
        }

        if (!form.empid.trim()) errs.empid = "Employee ID is required.";

        return errs;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await axios.post(`/auth/register`, {
                ...form,
                token: token
            });

            setToast({ message: res.data || "Registered successfully!", type: "success" });

            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            const data = err?.response?.data;

            if (data?.errors) {
                setErrors(data.errors); // field-specific errors
            } else {
                setToast({ message: data?.message || "Registration failed.", type: "error" });
            }
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-100 p-6">
            {/* Toast */}
            {toast.message && (
                <div
                    className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white z-50 transition-opacity ${
                        toast.type === "error" ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Title */}
            <div className="mb-6 max-w-5xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-900">Ticketing System</h1>
            </div>

            {/* Form Card */}
            <div className="flex justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

                    {!token ? (
                        <p className="text-red-500 text-center font-medium">Invalid or missing token.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <InputField
                                label="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                error={errors.username}
                                ref={firstInputRef}
                            />
                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                error={errors.password}
                            />
                            <InputField
                                label="Full Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <InputField
                                label="Employee ID"
                                name="empid"
                                value={form.empid}
                                onChange={handleChange}
                                error={errors.empid}
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded flex justify-center items-center gap-2 font-medium"
                            >
                                <UserPlus size={18} />
                                Register
                            </button>
                            <div className="h-6" /> {/* Bottom spacing */}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ForwardRef to allow focusing first field
const InputField = React.forwardRef(
    ({ label, name, value, onChange, type = "text", error }, ref) => (
        <div>
            <label className="block font-medium mb-1 text-gray-700">{label}</label>
            <input
                ref={ref}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                    error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-400"
                }`}
                required
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
);

export default Register;
