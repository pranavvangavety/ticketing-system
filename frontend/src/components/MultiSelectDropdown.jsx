import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function MultiSelectDropdown({ label, options, selected, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleCheckboxChange = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="relative" ref={dropdownRef} data-tag="filter-dropdown">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between px-4 py-2 text-sm border border-gray-300 bg-white rounded-full shadow-sm w-52 hover:border-gray-400 transition focus:outline-none"
            >
        <span className="text-gray-700 font-medium">
          {selected.length > 0 ? `${selected.length} selected` : `All ${label}`}
        </span>
                <ChevronDown
                    className={`w-4 h-4 ml-2 text-gray-500 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl p-2 max-h-60 overflow-auto transition-all duration-200">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer transition"
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                                className="accent-blue-600 w-4 h-4"
                            />
                            <span className="capitalize">{option.replaceAll("_", " ")}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MultiSelectDropdown;
