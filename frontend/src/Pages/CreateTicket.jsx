import React, {useEffect, useState} from "react";
import axios from "../lib/axios.js";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import { FilePlus2, Loader2 } from "lucide-react";

function CreateTicket() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
    const [file, setFile] = useState(null);

    const MAX_FILE_SIZE_MB = 2;
    const ALLOWED_TYPES = ["application/pdf", "image/jpeg"];
    const FILENAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

    const isFileValid = !errors.file && (file || file === null);



    useEffect(() => {
        console.log("Loading CreateTicket, trying to load draft...");
        const savedDraft = localStorage.getItem("ticketDraft");
        if (savedDraft) {
            const { title, description, type } = JSON.parse(savedDraft);
            console.log("Draft found:", { title, description, type });
            setTitle(title || '');
            setDescription(description || '');
            setType(type || '');
        }

        setHasLoadedDraft(true);

        document.body.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);


    useEffect(() => {
        if (!hasLoadedDraft) return;
        const draft = { title, description, type };
        console.log("Saving draft:", draft);
        localStorage.setItem("ticketDraft", JSON.stringify(draft));
    }, [title, description, type, hasLoadedDraft]);




    const validate = () => {
        const newErrors = {};

        if (!title.trim()) newErrors.title = "Title is required.";

        if (!description.trim()) {
            newErrors.description = "Description is required.";
        } else if (description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
        }

        if (!type.trim()) newErrors.type = "Please select a category.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const token = localStorage.getItem('token');
        const role = localStorage.getItem("role");
        const isAdmin = role === "ROLE_ADMIN";

        try {
            const formData = new FormData();
            const ticketBlob = new Blob(
                [JSON.stringify({ title, description, type })],
                { type: "application/json" }
            );
            formData.append("ticket", ticketBlob);

            if (file) {
                formData.append("attachment", file);
            }

            const response = await axios.post('http://localhost:8080/tickets', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setTimeout(() => {
                navigate("/ticket-confirmation", {
                    state: {
                        ticketId: response.data.id,
                        title: response.data.title,
                        type: response.data.type,
                        createdDateTime: response.data.createdAt,
                        isAdmin
                    }
                });
                setLoading(false);
            }, 800);


            localStorage.removeItem("ticketDraft");

        } catch (error) {
            console.error("Ticket Creation failed:", error);
            alert(error.response?.data?.message || "Failed to create ticket.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setFile(null);
            setErrors((prev) => ({ ...prev, file: null }));
            return;
        }

        const isValidType = ALLOWED_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        const isValidName = FILENAME_REGEX.test(file.name);

        if (!isValidType || !isValidSize || !isValidName) {
            let errorMsg = "";
            if (!isValidType) errorMsg = "Only PDF or JPG files are allowed.";
            else if (!isValidSize) errorMsg = "File size must be under 2MB.";
            else errorMsg = "Invalid file name. Use only A-Z, a-z, 0-9, -, _, .";

            setErrors((prev) => ({ ...prev, file: errorMsg }));
            setFile(null);
            e.target.value = "";
            return;
        }

        setFile(file);
        setErrors((prev) => ({ ...prev, file: null }));
    };


    return (
        <div className="flex items-center justify-center px-4">

            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scroll-container">

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-10 space-y-8 animate-pop-in"
                >
                    <BackButton />

                    <div className="flex items-center gap-3 text-blue-700">
                        <FilePlus2 className="w-6 h-6" />
                        <h2 className="text-2xl font-bold tracking-tight">Create New Ticket</h2>
                    </div>

                    <div className="relative">

                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 100) {
                                    setTitle(val);
                                }
                            }}
                            className={`peer w-full px-4 pt-7 pb-2 border rounded-xl focus:outline-none focus:ring-2 ${
                                errors.title ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder=" "
                        />


                        <label
                            htmlFor="title"
                            className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                        >
                            Ticket Title
                        </label>
                        <div className="text-right text-sm text-gray-400 mt-1">{title.length} / 100</div>

                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="relative">
                        <textarea
                            id="description"
                            value={description}

                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length <= 300) {
                                    setDescription(val);

                                    if (val.length > 0 && val.length < 10) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            description: "Description must be at least 10 characters.",
                                        }));
                                    } else {
                                        setErrors((prev) => ({ ...prev, description: "" }));
                                    }
                                } else {
                                    setErrors((prev) => ({
                                        ...prev,
                                        description: "Description must be 300 characters or less.",
                                    }));
                                }
                            }}


                            className={`peer w-full px-4 pt-7 pb-2 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
                                errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            rows="4"
                            placeholder=" "
                        />
                        <label
                            htmlFor="description"
                            className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                        >
                            Description
                        </label>

                        <div className="text-right text-sm text-gray-400 mt-1">
                            {description.length} / 300
                        </div>

                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>



                    <div className="relative group">

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-transform duration-200">
                            ▼
                        </div>

                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={`peer w-full appearance-none px-4 pt-7 pb-2 border rounded-xl bg-white text-gray-800 shadow-sm transition focus:outline-none focus:ring-2 ${
                                errors.type
                                    ? 'border-red-500 focus:ring-red-400'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        >
                            <option value="" disabled hidden>Select category...</option>
                            <option value="SUPPORT">Support</option>
                            <option value="ISSUE">Issue</option>
                            <option value="CHANGE_REQUEST">Change Request</option>
                        </select>

                        <label
                            htmlFor="type"
                            className="absolute left-4 top-2 text-sm text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                        >
                            Category
                        </label>

                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                        )}
                    </div>

                    <div className="text-sm text-gray-500 mb-2">
                        📎 Attachments must be:
                        <ul className="list-disc list-inside ml-2">
                            <li>PDF or JPG format only</li>
                            <li>Less than 2 MB in size</li>
                            <li>Alphanumeric filenames only (A-Z, a-z, 0-9, `-`, `_`, `.`). No spaces allowed.</li>
                        </ul>
                    </div>


                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachment (optional)
                        </label>

                        <input
                            type="file"
                            onChange={handleFileChange}
                            className={`block w-full text-sm border rounded-xl shadow-sm p-2
                            file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                           ${errors.file ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-700'}
    `}
                        />

                        {file && (
                            <p className="text-sm text-gray-500 mt-1">Selected file: {file.name}</p>
                        )}

                        {errors.file && (
                            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                        )}

                    </div>


                    <div>
                        <button
                            type="submit"
                            disabled={loading || !isFileValid}
                            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                loading ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </div>
                </form>

            </div>

        </div>
    );
}

export default CreateTicket;
