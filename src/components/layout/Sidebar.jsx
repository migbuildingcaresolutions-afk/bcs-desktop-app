import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  FileText,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: <Home size={18} /> },
  { name: "Clients", path: "/clients", icon: <Users size={18} /> },
  { name: "Jobs", path: "/jobs", icon: <Briefcase size={18} /> },
  { name: "Estimates", path: "/estimates", icon: <ClipboardList size={18} /> },
  { name: "Invoices", path: "/invoices", icon: <FileText size={18} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
      <div className="py-6 px-5 text-xl font-bold tracking-wide border-b border-gray-800">
        BuildingCare
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              \`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors \${isActive
                ? "bg-gray-800 text-blue-400"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"}\`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-xs text-gray-500 border-t border-gray-800">
        v1.0.0
      </div>
    </aside>
  );
}
