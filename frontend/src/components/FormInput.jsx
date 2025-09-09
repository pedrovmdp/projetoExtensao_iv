export default function FormInput({label, type, name, value, onChange, placeholder}) {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </>
    )
}