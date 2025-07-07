import React, {useEffect, useState, useRef} from "react";

function TicketActionsDropdown({ticketId, isClosed, onClose, onEdit, onDelete}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect( () => {
        function handleClickOutside(event) {
            if( menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button onClick={() => setOpen(!open)} className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded">
                ⋮
            </button>


            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20">
                    <div className="py-1 text-sm text-gray-700">
                        {!isClosed && (

                            <button onClick={() => {
                                onClose(ticketId);
                                setOpen(false);
                            }}
                            className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                            >
                                Close
                            </button>
                        )}

                        <button onClick={() => {

                            onEdit(ticketId);

                            setOpen(false);
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                            Edit
                        </button>

                        <button onClick={() => {
                            onDelete(ticketId);
                            setOpen(false);
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                            Delete
                        </button>
                    </div>

                </div>
            )}

        </div>
    )
}

export default TicketActionsDropdown;