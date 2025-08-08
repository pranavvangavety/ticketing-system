import React from "react";

function ResolverDropdown({ selected, onSelect, resolvers }) {
    return (
        <select
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
        >
            <option value="">Unassigned</option>
            {resolvers.map((username) => (
                <option key={username} value={username}>
                    {username}
                </option>
            ))}

        </select>
    );
}

export default ResolverDropdown;
