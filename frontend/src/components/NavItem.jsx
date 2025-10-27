import { Link } from "react-router-dom"

export default function NavItem ({ to, icon: Icon, children, isActive, onClick }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-600 transition-colors ${
            isActive ? 'bg-blue-600 border-r-2 border-white' : ''
            }`}
            onClick={onClick}
        >
            <Icon className="w-5 h-5" />
            <span>{children}</span>
        </Link>
    )
};