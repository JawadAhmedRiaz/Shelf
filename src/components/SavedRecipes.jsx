import { useState } from 'react';

export default function SavedRecipes({ savedRecipes, onDeleteRecipe, onSelectRecipe }) {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = savedRecipes.filter((r) =>
    r.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (savedRecipes.length === 0) {
    return (
      <div className="saved-recipes-empty">
        <div className="empty-icon">📖</div>
        <h3>No Saved Recipes Yet</h3>
        <p>When Expiry Chef generates a recipe you like, tap "Save to Favorites" to keep it here.</p>
      </div>
    );
  }

  return (
    <div className="saved-recipes-container">
      <div className="saved-header">
        <h2>Your Saved Favorites ({savedRecipes.length})</h2>
        <input
          type="text"
          placeholder="Search saved recipes..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="recipes-grid">
        {filtered.map((r, idx) => (
          <div className="saved-recipe-card" key={r.id || idx}>
            <div className="card-top">
              <span className="recipe-badge">SAVED</span>
              <button
                className="btn-delete-saved"
                title="Remove from saved"
                onClick={() => onDeleteRecipe(r.id)}
              >
                ✕
              </button>
            </div>

            <h3 className="saved-title">{r.title}</h3>
            <p className="saved-desc">{r.description || 'Custom zero-waste recipe'}</p>

            <div className="saved-meta">
              <span>⏱️ {r.prep_time_minutes || 15} mins</span>
              <span>🍽️ Serves {r.servings || 2}</span>
            </div>

            {r.uses_expiring_items && r.uses_expiring_items.length > 0 && (
              <div className="saved-tags">
                {r.uses_expiring_items.map((item, i) => (
                  <span key={i} className="mini-tag">
                    {item}
                  </span>
                ))}
              </div>
            )}

            <button className="btn-cook-saved" onClick={() => onSelectRecipe(r)}>
              Cook This Now →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
