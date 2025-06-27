export default function Input({icon, value, onChange, name, required, placeholder, type }) {
    return(
        <input
            type={type}
            icon={icon}
            name={name}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-2xl p-3 border border-gray-400 focus:outline-none focus:border-blue-400 focus:ring-primary focus:ring-1"
        />
    );
}