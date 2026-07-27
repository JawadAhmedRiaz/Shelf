import { daysLeft } from '../utils/dates.js';

export default function ExpiryRadar({ inventory }) {
  const now = inventory.filter((i) => daysLeft(i.expiry) <= 1).length;
  const soon = inventory.filter((i) => {
    const d = daysLeft(i.expiry);
    return d > 1 && d <= 3;
  }).length;
  const fresh = inventory.filter((i) => daysLeft(i.expiry) > 3).length;

  return (
    <div className="radar-summary">
      <div className="radar-stat now">
        <div className="stat-icon">🚨</div>
        <div className="num">{now}</div>
        <div className="lbl">Use now (0-1 days)</div>
      </div>
      <div className="radar-stat soon">
        <div className="stat-icon">⚠️</div>
        <div className="num">{soon}</div>
        <div className="lbl">Soon (2-3 days)</div>
      </div>
      <div className="radar-stat fresh">
        <div className="stat-icon">🌱</div>
        <div className="num">{fresh}</div>
        <div className="lbl">Fresh (4+ days)</div>
      </div>
    </div>
  );
}
