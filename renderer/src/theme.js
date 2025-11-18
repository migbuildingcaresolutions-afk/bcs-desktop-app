// Theme Configuration for Building Care Solutions
// Enhanced theme system with color themes and dark mode support

export const themes = {
  default: {
    name: 'Default Blue',
    // Sidebar colors
    sidebarBg: 'from-slate-900 to-slate-950',
    sidebarText: 'text-gray-100',
    sidebarBorder: 'border-slate-800',

    // Active menu item
    activeMenuBg: 'from-blue-600 to-blue-700',
    activeMenuBorder: 'border-blue-400',
    activeMenuShadow: 'shadow-blue-500/50',

    // Hover states
    hoverMenuBg: 'hover:bg-slate-800/60',

    // Brand colors
    brandGradient: 'from-blue-400 to-cyan-400',
    primaryColor: 'blue',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryBorder: 'border-blue-500',
    primaryText: 'text-blue-600',

    // Top bar
    topBarBg: 'bg-white',
    topBarText: 'text-gray-800',
    topBarBorder: 'border-gray-200',

    // Main content
    mainBg: 'bg-gray-50',

    // Cards and borders
    cardBg: 'bg-white',
    cardBorder: 'border-blue-200',
    cardHeaderBg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    cardHeaderText: 'text-white',

    // Company info section
    companyInfoBg: 'bg-slate-900/30',
    companyInfoBorder: 'border-slate-800',

    // User avatar
    avatarBg: 'from-blue-500 to-cyan-500',

    // Buttons
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },

  emerald: {
    name: 'Emerald Green',
    sidebarBg: 'from-emerald-950 to-slate-950',
    sidebarText: 'text-gray-100',
    sidebarBorder: 'border-emerald-900',
    activeMenuBg: 'from-emerald-600 to-emerald-700',
    activeMenuBorder: 'border-emerald-400',
    activeMenuShadow: 'shadow-emerald-500/50',
    hoverMenuBg: 'hover:bg-emerald-900/40',
    brandGradient: 'from-emerald-400 to-teal-400',
    primaryColor: 'emerald',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryBorder: 'border-emerald-500',
    primaryText: 'text-emerald-600',
    topBarBg: 'bg-white',
    topBarText: 'text-gray-800',
    topBarBorder: 'border-gray-200',
    mainBg: 'bg-gray-50',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-200',
    cardHeaderBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
    cardHeaderText: 'text-white',
    companyInfoBg: 'bg-emerald-950/40',
    companyInfoBorder: 'border-emerald-900',
    avatarBg: 'from-emerald-500 to-teal-500',
    buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },

  purple: {
    name: 'Purple',
    sidebarBg: 'from-purple-950 to-slate-950',
    sidebarText: 'text-gray-100',
    sidebarBorder: 'border-purple-900',
    activeMenuBg: 'from-purple-600 to-purple-700',
    activeMenuBorder: 'border-purple-400',
    activeMenuShadow: 'shadow-purple-500/50',
    hoverMenuBg: 'hover:bg-purple-900/40',
    brandGradient: 'from-purple-400 to-pink-400',
    primaryColor: 'purple',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryBorder: 'border-purple-500',
    primaryText: 'text-purple-600',
    topBarBg: 'bg-white',
    topBarText: 'text-gray-800',
    topBarBorder: 'border-gray-200',
    mainBg: 'bg-gray-50',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-200',
    cardHeaderBg: 'bg-gradient-to-r from-purple-600 to-pink-600',
    cardHeaderText: 'text-white',
    companyInfoBg: 'bg-purple-950/40',
    companyInfoBorder: 'border-purple-900',
    avatarBg: 'from-purple-500 to-pink-500',
    buttonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },

  orange: {
    name: 'Orange',
    sidebarBg: 'from-orange-950 to-slate-950',
    sidebarText: 'text-gray-100',
    sidebarBorder: 'border-orange-900',
    activeMenuBg: 'from-orange-600 to-orange-700',
    activeMenuBorder: 'border-orange-400',
    activeMenuShadow: 'shadow-orange-500/50',
    hoverMenuBg: 'hover:bg-orange-900/40',
    brandGradient: 'from-orange-400 to-amber-400',
    primaryColor: 'orange',
    primaryBg: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryBorder: 'border-orange-500',
    primaryText: 'text-orange-600',
    topBarBg: 'bg-white',
    topBarText: 'text-gray-800',
    topBarBorder: 'border-gray-200',
    mainBg: 'bg-gray-50',
    cardBg: 'bg-white',
    cardBorder: 'border-orange-200',
    cardHeaderBg: 'bg-gradient-to-r from-orange-600 to-amber-600',
    cardHeaderText: 'text-white',
    companyInfoBg: 'bg-orange-950/40',
    companyInfoBorder: 'border-orange-900',
    avatarBg: 'from-orange-500 to-amber-500',
    buttonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  },
};

export const getTheme = (themeName = 'default', isDarkMode = false) => {
  const baseTheme = themes[themeName] || themes.default;

  if (!isDarkMode) {
    return baseTheme;
  }

  // Dark mode overrides - keep the color theme but make backgrounds dark
  return {
    ...baseTheme,
    // Override light backgrounds with dark
    topBarBg: 'bg-gray-900',
    topBarText: 'text-gray-100',
    topBarBorder: 'border-gray-800',
    mainBg: 'bg-gray-950',
    cardBg: 'bg-gray-900',
    cardBorder: baseTheme.cardBorder, // Keep theme color for borders
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
  };
};
