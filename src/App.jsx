import "./styles/sidebar.css";   // <-- add this line
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import DashboardView from "./views/DashboardView";
import ClientsView from "./views/ClientsView";
import JobsView from "./views/JobsView";
import EstimatesView from "./views/EstimatesView";
import InvoicesView from "./views/InvoicesView";
import SettingsView from "./views/SettingsView";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/jobs" element={<JobsView />} />
          <Route path="/estimates" element={<EstimatesView />} />
          <Route path="/invoices" element={<InvoicesView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </Layout>
    </Router>
  );
}

