import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import { getTheme } from './theme';
import './dark-mode.css';
import LoginView from './views/LoginView';
import ImprovedDashboardView from './views/ImprovedDashboardView';
import ModernDashboardView from './views/ModernDashboardView';
import CalendarView from './views/CalendarView';
import ClientsView from './views/ClientsView';
import WorkOrdersView from './views/WorkOrdersView';
import InvoicesView from './views/InvoicesView';
import EstimatesView from './views/EstimatesView';
import EnhancedEstimatesView from './views/EnhancedEstimatesView';
import EmployeesView from './views/EmployeesView';
import EquipmentView from './views/EquipmentView';
import MaterialsView from './views/MaterialsView';
import MoistureLogsView from './views/MoistureLogsView';
import VendorsView from './views/VendorsView';
import PriceListView from './views/PriceListView';
import ChangeOrdersView from './views/ChangeOrdersView';
import EnhancedQuoteGeneratorView from './views/EnhancedQuoteGeneratorView';
import CompanySettingsView from './views/CompanySettingsView';
import ServicesView from './views/ServicesView';
import PricingView from './views/PricingView';
import ResourcesView from './views/ResourcesView';
import LineItemsView from './views/LineItemsView';
import XactimateView from './views/XactimateView';
import DryOutJobsView from './views/DryOutJobsView';
import RemediationDryoutView from './views/RemediationDryoutView';
import RemediationReconstructionView from './views/RemediationReconstructionView';
import JobTrackingView from './views/JobTrackingView';
import ReportsView from './views/ReportsView';
import LoggingUtilityView from './views/LoggingUtilityView';
import MessagingView from './views/MessagingView';
import QuickSMSView from './views/QuickSMSView';
import PaymentsView from './views/PaymentsView';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewHistory, setViewHistory] = useState(['dashboard']);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const theme = getTheme(currentTheme, isDarkMode);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'moisturelogs', label: 'Moisture Logs', icon: '💧' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'workorders', label: 'Work Orders', icon: '📋' },
    { id: 'estimates', label: 'Estimates', icon: '📄' },
    { id: 'invoices', label: 'Invoices', icon: '💰' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'changeorders', label: 'Change Orders', icon: '🔄' },
    { id: 'pricelist', label: 'Price List', icon: '💲' },
    { id: 'pricing', label: 'Pricing', icon: '💵' },
    { id: 'lineitems', label: 'Line Items', icon: '🧾' },
    { id: 'employees', label: 'Employees', icon: '👷' },
    { id: 'equipment', label: 'Equipment', icon: '🔧' },
    { id: 'materials', label: 'Materials', icon: '📦' },
    { id: 'vendors', label: 'Vendors', icon: '🏢' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'quotegenerator', label: 'Quote Generator', icon: '🧮' },
    { id: 'xactimate', label: 'Xactimate', icon: '📐' },
    { id: 'remdryout', label: 'Remediation – Dryout', icon: '💧' },
    { id: 'remrecon', label: 'Remediation – Reconstruction', icon: '🏗️' },
    { id: 'dryoutjobs', label: 'Dry-Out Jobs', icon: '🔥' },
    { id: 'jobtracking', label: 'Job Tracking', icon: '🚧' },
    { id: 'loggingutility', label: 'Logging Utility', icon: '📜' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'messaging', label: 'Bulk Messaging', icon: '💬' },
    { id: 'quicksms', label: 'Quick SMS', icon: '💬' },  
    { id: 'companysettings', label: 'Settings', icon: '⚙️' },
  ];

  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
    setViewHistory(prev => [...prev, viewId]);
  };

  const handleBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  const filteredNavigation = navigation.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <ModernDashboardView onNavigate={handleNavigation} />;
      case 'calendar': return <CalendarView />;
      case 'clients': return <ClientsView />;
      case 'workorders': return <WorkOrdersView />;
      case 'invoices': return <InvoicesView />;
      case 'payments': return <PaymentsView />;
      case 'estimates': return <EnhancedEstimatesView />;
      case 'changeorders': return <ChangeOrdersView />;
      case 'pricelist': return <PriceListView />;
      case 'pricing': return <PricingView />;
      case 'employees': return <EmployeesView />;
      case 'moisturelogs': return <MoistureLogsView />;
      case 'equipment': return <EquipmentView />;
      case 'materials': return <MaterialsView />;
      case 'vendors': return <VendorsView />;
      case 'services': return <ServicesView />;
      case 'resources': return <ResourcesView />;
      case 'lineitems': return <LineItemsView />;
      case 'xactimate': return <XactimateView />;
      case 'dryoutjobs': return <DryOutJobsView />;
      case 'remdryout': return <RemediationDryoutView />;
      case 'remrecon': return <RemediationReconstructionView />;
      case 'jobtracking': return <JobTrackingView />;
      case 'loggingutility': return <LoggingUtilityView />;
      case 'reports': return <ReportsView />;
      case 'quotegenerator': return <EnhancedQuoteGeneratorView />;
      case 'messaging': return <MessagingView />;
      case 'quicksms': return <QuickSMSView />;
      case 'companysettings': return <CompanySettingsView />;
      default: return <ImprovedDashboardView />;
    }
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <AppProvider>
      <div className={`flex h-screen ${theme.mainBg}`} data-theme={isDarkMode ? 'dark' : 'light'}>
        <aside className={`bg-gradient-to-b ${theme.sidebarBg} ${theme.sidebarText} flex flex-col transition-all duration-300 shadow-2xl ${sidebarCollapsed ? 'w-20' : 'w-80'}`}>
          
          <div className={`p-6 border-b ${theme.sidebarBorder}`}>
            {!sidebarCollapsed && (
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme.brandGradient} bg-clip-text text-transparent`}>
                  BCS Desktop
                </h1>
                <p className="text-sm text-gray-400 mt-1">Building Care Solutions</p>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="text-center">
                <span className="text-2xl">🏗️</span>
              </div>
            )}
          </div>

          {/* Search Box */}
          {!sidebarCollapsed && (
            <div className="p-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-slate-800 text-gray-100 border border-slate-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchQuery && filteredNavigation.length === 0 && (
                <p className="text-xs text-gray-400 mt-2 text-center">No menu items found</p>
              )}
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-700">
            {filteredNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full text-left px-8 py-4 flex items-center gap-4 transition-all duration-200 border-l-4 ${
                  currentView === item.id
                    ? `bg-gradient-to-r ${theme.activeMenuBg} shadow-lg ${theme.activeMenuShadow} ${theme.activeMenuBorder}`
                    : `border-transparent ${theme.hoverMenuBg}`
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm leading-relaxed">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className={`p-4 border-t ${theme.sidebarBorder} space-y-3`}>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Color Theme</label>
                <select
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 text-gray-100 border border-slate-600 hover:bg-slate-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">🔵 Default Blue</option>
                  <option value="emerald">🟢 Emerald Green</option>
                  <option value="purple">🟣 Purple</option>
                  <option value="orange">🟠 Orange</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Dark Mode</label>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {!sidebarCollapsed && currentUser && (
            <div className={`p-6 border-t ${theme.companyInfoBorder} bg-opacity-30 ${theme.companyInfoBg}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.avatarBg} flex items-center justify-center text-white font-bold`}>
                  {currentUser.full_name?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{currentUser.full_name || currentUser.username}</p>
                  <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setIsAuthenticated(false);
                  setCurrentUser(null);
                }}
                className="mt-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-4 border-t ${theme.sidebarBorder} ${theme.hoverMenuBg} transition-colors`}
          >
            <span className="text-xl">{sidebarCollapsed ? '→' : '←'}</span>
          </button>

        </aside>

        <main className={`flex-1 flex flex-col overflow-hidden ${theme.mainBg}`}>
{/* Top Navigation Bar with Back Button */}
<div className={`${theme.topBarBg} border-b ${theme.topBarBorder} px-6 py-4 flex items-center gap-4`}>
  <button
    onClick={handleBack}
    disabled={viewHistory.length <= 1}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      viewHistory.length > 1
        ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
        : 'bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
    }`}
    title="Go back"
  >
    <span className="text-xl">←</span>
    <span className="text-sm font-medium">Back</span>
  </button>
  
  <div className="flex-1">
    <h1 className={`text-3xl font-bold ${theme.topBarText} flex items-center gap-3`}>
      <span className="text-4xl">{navigation.find(n => n.id === currentView)?.icon}</span>
      <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        {navigation.find(n => n.id === currentView)?.label || 'Dashboard'}
      </span>
    </h1>
  </div>

  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
  </div>
</div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
