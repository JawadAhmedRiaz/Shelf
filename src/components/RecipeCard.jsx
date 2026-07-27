import { useState } from 'react';

export default function RecipeCard({
  status,
  recipe,
  errorMessage,
  onSaveRecipe,
  isSaved,
}) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [copied, setCopied] = useState(false);

  if (status === 'loading') {
    return (
      <div className="recipe-card loading-state">
        <div className="spinner"></div>
        <div className="loading-text">
          <h3>Consulting Expiry Chef...</h3>
          <p>Analyzing ingredients, expiry dates, and dietary preferences for a zero-waste recipe.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="recipe-card error-state">
        <span className="error-icon">⚠️</span>
        <div>
          <h4>Couldn't generate recipe</h4>
          <p>{errorMessage || "Couldn't reach Expiry Chef right now. Please try again."}</p>
        </div>
      </div>
    );
  }

  if (
    status === 'idle' ||
    !recipe ||
    !recipe.title ||
    recipe.title === 'Not enough ingredients' ||
    !recipe.steps ||
    recipe.steps.length === 0
  ) {
    return (
      <div className="recipe-card empty-state">
        <div className="empty-illustration">👩‍🍳</div>
        <h3>Ready to Cook?</h3>
        <p>
          Add items to your shelf above, choose any dietary preferences, then tap{' '}
          <strong>"Cook something now →"</strong> to generate a tailored recipe.
        </p>
      </div>
    );
  }

  function toggleStep(idx) {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleCopy() {
    const text = `${recipe.title}\n${recipe.description || ''}\nPrep: ${
      recipe.prep_time_minutes || 15
    } mins | Servings: ${(recipe.servings || 2) * servingsMultiplier}\n\nSteps:\n${recipe.steps
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const baseServings = recipe.servings || 2;
  const currentServings = baseServings * servingsMultiplier;

  return (
    <div className="recipe-card active-recipe">
      <div className="recipe-card-header">
        <span className="recipe-stamp">EXPIRY CHEF • AI RECIPE</span>
        <div className="recipe-actions-top">
          <button
            className={`btn-action-icon ${isSaved ? 'saved' : ''}`}
            onClick={() => onSaveRecipe(recipe)}
            title={isSaved ? 'Saved to favorites' : 'Save to favorites'}
          >
            {isSaved ? '❤️ Saved' : '🤍 Save'}
          </button>
          <button className="btn-action-icon" onClick={handleCopy} title="Copy recipe to clipboard">
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>

      <h3 className="recipe-title">{recipe.title}</h3>
      {recipe.description && <p className="recipe-description">{recipe.description}</p>}

      <div className="recipe-meta-bar">
        <div className="meta-item">
          <span className="meta-label">PREP TIME</span>
          <span className="meta-val">⏱️ {recipe.prep_time_minutes || 15} mins</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">SERVINGS</span>
          <div className="servings-control">
            <button
              onClick={() => setServingsMultiplier(Math.max(0.5, servingsMultiplier - 0.5))}
              className="btn-scale"
            >
              -
            </button>
            <span className="meta-val">🍽️ {currentServings}</span>
            <button
              onClick={() => setServingsMultiplier(servingsMultiplier + 0.5)}
              className="btn-scale"
            >
              +
            </button>
          </div>
        </div>
        <div className="meta-item">
          <span className="meta-label">DIFFICULTY</span>
          <span className="meta-val">⚡ {recipe.difficulty || 'Easy'}</span>
        </div>
      </div>

      {recipe.uses_expiring_items && recipe.uses_expiring_items.length > 0 && (
        <div className="recipe-section">
          <div className="section-label">✅ Rescued from your shelf (Expiring Soon)</div>
          <div className="tag-row">
            {recipe.uses_expiring_items.map((item, idx) => (
              <span className="tag tag-uses" key={idx}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
        <div className="recipe-section">
          <div className="section-label">🛒 Common Pantry Staples / Pickups</div>
          <div className="tag-row">
            {recipe.missing_ingredients.map((item, idx) => (
              <span className="tag tag-missing" key={idx}>
                + {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="recipe-section">
        <div className="section-label">
          🍳 Interactive Cooking Instructions ({Object.keys(completedSteps).filter((k) => completedSteps[k]).length}/{recipe.steps.length} done)
        </div>
        <ol className="recipe-steps-list">
          {recipe.steps.map((step, idx) => (
            <li
              key={idx}
              className={`step-item ${completedSteps[idx] ? 'completed' : ''}`}
              onClick={() => toggleStep(idx)}
            >
              <input
                type="checkbox"
                checked={!!completedSteps[idx]}
                onChange={() => {}}
                className="step-checkbox"
              />
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
