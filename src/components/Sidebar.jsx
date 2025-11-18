import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const navItems = [
  { name: "Dashboard", path: "/" },

  // --- Core Business ---
  { name: "Clients", path: "/clients" },
  { name: "Invoices", path: "/invoices" },
  { name: "Work Orders", path: "/work-orders" },
  { name: "Estimates", path: "/estimates" },
  { name: "Change Orders", path: "/change-orders" },

  // --- Resources / Assets ---
  { name: "Equipment", path: "/equipment" },
  { name: "Materials", path: "/materials" },
  { name: "Employees", path: "/employees" },
  { name: "Vendors", path: "/vendors" },
  { name: "Services", path: "/services" },
  { name: "Price List", path: "/price-list" },
  { name: "Pricing", path: "/pricing" },

  // --- Specialized Modules ---
  { name: "Xactimate", path: "/xactimate" },
  { name: "Resources", path: "/resources" },
  { name: "Line Items", path: "/line-items" },

  // --- Remediation ---
  { name: "Remediation – Dryout", path: "/remediation-dryout" },
  { name: "Remediation – Reconstruction", path: "/remediation-reconstruction" },

  // --- Job Flow ---
  { name: "Dry-Out Jobs", path: "/dry-out-jobs" },
  { name: "Job Tracking", path: "/job-tracking" },

  // --- Utility / Admin ---
  { name: "Logging Utility", path: "/logging-utility" },
  { name: "Reports", path: "/reports" },
  { name: "Settings", path: "/settings" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">BCS</div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">v1.0.0</div>
    </aside>
  );
}


