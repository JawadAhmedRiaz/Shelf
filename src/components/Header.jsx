export default function Header({
  diet,
  onDietChange,
  activeTab,
  onTabChange,
  onOpenSettings,
  currentModel,
  savedCount,
}) {
  return (
    <header className="topbar">
      <div className="brand-section">
        <div className="brand-logo" onClick={() => onTabChange('shelf')}>
          <span className="stamp">
            SHELF
            <br />
            LIFE
          </span>
        </div>
        <div className="brand-text">
          <h1 className="brand-name">ShelfLife</h1>
          <p className="tagline">
            Cook what you have, before it's gone. Powered by <strong>Google Gemini AI</strong>.
          </p>
        </div>
      </div>

      <div className="header-controls">
        <div className="tab-nav">
          <button
            className={`nav-tab ${activeTab === 'shelf' ? 'active' : ''}`}
            onClick={() => onTabChange('shelf')}
          >
            🥗 Kitchen & AI Chef
          </button>
          <button
            className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => onTabChange('saved')}
          >
            📖 Saved Recipes {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
          </button>
        </div>

        <div className="header-right-tools">
          <div className="diet-filter">
            <label htmlFor="dietSelect">Dietary restriction</label>
            <select id="dietSelect" value={diet} onChange={(e) => onDietChange(e.target.value)}>
              <option value="none">No restrictions</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="halal">Halal</option>
              <option value="dairy-free">Dairy-free</option>
              <option value="gluten-free">Gluten-free</option>
            </select>
          </div>

          <button className="api-settings-btn" onClick={onOpenSettings} title="Gemini AI Settings">
            <span className="model-indicator">⚡ {currentModel || 'gemini-2.5-flash'}</span>
            <span className="settings-gear">⚙️</span>
          </button>
        </div>
      </div>
    </header>
  );
}
