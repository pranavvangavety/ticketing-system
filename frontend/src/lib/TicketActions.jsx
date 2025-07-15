import axios from "axios";

export function closeTicket(ticketId, fetchURLBase, token, onSuccess, onError) {
    axios
        .put(`${fetchURLBase}/${ticketId}/close`, {}, {
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
