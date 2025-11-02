export default function FormInputDiv({ icon: Icon, iconColor = "text-green-600", title, children }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                {Icon && <Icon className={`${iconColor}`} />}
                <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}