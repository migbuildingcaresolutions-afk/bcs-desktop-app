import React from 'react';

/**
 * Branded Header Component
 * Displays prominent "Building Care Solutions" branding at the top of each view
 */
export const BrandedHeader = ({
  title,
  subtitle,
  icon = '',
  actionButton = null,
  gradient = 'from-blue-600 to-cyan-600'
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-2xl shadow-xl p-8 md:p-10 text-white`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {icon && <span className="mr-3">{icon}</span>}
            {title}
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Building Care Solutions - {subtitle}
          </p>
        </div>
        {actionButton && (
          <div className="flex-shrink-0">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandedHeader;
