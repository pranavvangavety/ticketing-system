import axios from "../lib/axios.js";

export function closeTicket(ticketId, fetchURLBase, token, role, onSuccess, onError) {
    const url =
        role === 'admin'
            ? `/admin/tickets/${ticketId}/close`
                : `tickets/resolver/${ticketId}/close`;

    axios
        .put(url, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            onSuccess?.();
        })
        .catch((err) => {
            console.error("Failed to close ticket:", err);
            onError?.(err);
        });
}





export function deleteTicket(ticketId, fetchURLBase, token, onSuccess, onError) {
    axios
        .delete(`${fetchURLBase}/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            onSuccess?.();
        })
        .catch((err) => {
            console.error("Failed to delete ticket:", err);
            onError?.(err);
        });
}
