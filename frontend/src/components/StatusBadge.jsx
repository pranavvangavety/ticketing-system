export default function StatusBadge({ status }) {
    const color = {
        OPEN: "bg-green-100 text-green-800",
        IN_QUEUE: "bg-yellow-100 text-yellow-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        ON_HOLD: "bg-orange-100 text-orange-800",
        CLOSED: "bg-gray-200 text-gray-700",
    }[status] || "bg-gray-100 text-gray-600";

    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color} whitespace-nowrap`}>
            {status?.replace("_", " ")}
        </span>
    );

}
