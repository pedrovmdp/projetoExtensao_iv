export default function Header ({icon, title, text}) {
    return (
        <div className="flex items-center gap-3 mb-8">
            {icon}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-1">
                   {text}
                </p>
            </div>
        </div>
    )   
}