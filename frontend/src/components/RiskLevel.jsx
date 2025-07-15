export default function RiskLevelBadge({ riskLevel }) {
    const color = {
        HIGH: "bg-red-100 text-red-700",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        LOW: "bg-green-100 text-green-700",
    }[riskLevel] || "bg-gray-100 text-gray-600";

    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {riskLevel}
    </span>
    );
}
