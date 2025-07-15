export default function TypeBadge({ type }) {
    let bg = "";
    let text = "";

    switch (type) {
        case "SUPPORT":
            bg = "bg-blue-100 text-blue-700";
            text = "SUPPORT";
            break;
        case "ISSUE":
            bg = "bg-red-100 text-red-700";
            text = "ISSUE";
            break;
        case "CHANGE_REQUEST":
            bg = "bg-purple-100 text-purple-700";
            text = "CHANGE REQUEST";
            break;
        default:
            bg = "bg-gray-100 text-gray-700";
            text = type;
    }

    return (
        <span className={`inline-block text-[13px] font-medium px-2 py-0.5 rounded-full ${bg} whitespace-nowrap`}>
            {text}
        </span>
    );

}
