import '../styles/StatsCard.css';

/**
 * Stats Card Component
 * Displays key metrics with icons, trends, and animations
 */
export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  className = '',
  onClick
}) {
  return (
    <div
      className={`stats-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stats-card-header">
        <span className="stats-icon">{icon}</span>
        <span className="stats-title">{title}</span>
      </div>
      <div className="stats-value">{value}</div>
      {trend && (
        <div className={`stats-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          <span className="trend-indicator">{trendUp ? '↑' : '↓'}</span>
          <span className="trend-value">{trend}</span>
        </div>
      )}
    </div>
  );
}
