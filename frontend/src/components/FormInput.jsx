export default function FormInput({label, type, name, value, onChange, placeholder, maxLength, className, error}) {

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={ className || "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder-gray-500"}
                maxLength={maxLength}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    )
}