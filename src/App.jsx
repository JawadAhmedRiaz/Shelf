import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import AddItemForm from './components/AddItemForm.jsx';
import ShelfList from './components/ShelfList.jsx';
import ExpiryRadar from './components/ExpiryRadar.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import SavedRecipes from './components/SavedRecipes.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import { useInventory } from './hooks/useInventory.js';
import { generateRecipe } from './utils/expiryChef.js';
import { genId } from './utils/dates.js';

const SAVED_RECIPES_KEY = 'shelflife:saved_recipes';
const SETTINGS_KEY = 'shelflife:api_settings';

export default function App() {
  const {
    inventory,
    addItem,
    editItem,
    removeItem,
    resetSampleItems,
    clearAllItems,
    defaultExpiry,
  } = useInventory();

  const [diet, setDiet] = useState('none');
  const [activeTab, setActiveTab] = useState('shelf'); // 'shelf' | 'saved'
  const [recipeStatus, setRecipeStatus] = useState('idle'); // idle | loading | done | error
  const [recipe, setRecipe] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Saved Recipes state
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const raw = localStorage.getItem(SAVED_RECIPES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // API Settings state
  const [apiSettings, setApiSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw
        ? JSON.parse(raw)
        : {
            apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
            model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash',
          };
    } catch (e) {
      return {
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash',
      };
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(savedRecipes));
    } catch (e) {}
  }, [savedRecipes]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(apiSettings));
    } catch (e) {}
  }, [apiSettings]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }

  async function handleCook() {
    if (inventory.length === 0) {
      setRecipeStatus('done');
      setRecipe(null);
      showToast('Add some items to your shelf first!');
      return;
    }

    setRecipeStatus('loading');
    setErrorMessage('');

    try {
      const result = await generateRecipe(
        inventory,
        diet,
        apiSettings.apiKey,
        apiSettings.model
      );
      setRecipe(result);
      setRecipeStatus('done');
      showToast('New recipe created by Expiry Chef!');
    } catch (err) {
      console.error('ShelfLife: Expiry Chef failed', err);
      setErrorMessage(
        err.message || "Couldn't reach Expiry Chef right now. Please try again."
      );
      setRecipeStatus('error');
    }
  }

  function handleSaveRecipe(recipeToSave) {
    if (!recipeToSave || !recipeToSave.title) return;
    const exists = savedRecipes.some((r) => r.title === recipeToSave.title);
    if (exists) {
      showToast('Recipe is already saved in your favorites!');
      return;
    }

    const newSaved = [{ ...recipeToSave, id: genId(), savedAt: new Date().toISOString() }, ...savedRecipes];
    setSavedRecipes(newSaved);
    showToast('Saved to your Favorite Recipes! ❤️');
  }

  function handleDeleteSavedRecipe(id) {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
    showToast('Recipe removed from favorites.');
  }

  function handleSelectSavedRecipe(savedRecipe) {
    setRecipe(savedRecipe);
    setRecipeStatus('done');
    setActiveTab('shelf');
    showToast(`Loaded "${savedRecipe.title}" into cooking view.`);
  }

  const isCurrentRecipeSaved =
    recipe && savedRecipes.some((r) => r.title === recipe.title);

  return (
    <div className="app">
      <Header
        diet={diet}
        onDietChange={setDiet}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentModel={apiSettings.model}
        savedCount={savedRecipes.length}
      />

      {toastMessage && <div className="app-toast">{toastMessage}</div>}

      <main className="main-content">
        {activeTab === 'shelf' ? (
          <div className="layout">
            <section className="panel inventory-panel">
              <div className="panel-header">
                <div className="eyebrow">Kitchen Shelf</div>
                <h2>Your Inventory ({inventory.length})</h2>
              </div>
              <AddItemForm onAdd={addItem} defaultExpiry={defaultExpiry} />
              <ShelfList
                inventory={inventory}
                onRemove={removeItem}
                onEdit={editItem}
                onResetSamples={resetSampleItems}
                onClearAll={clearAllItems}
              />
            </section>

            <section className="panel chef-panel">
              <div className="panel-header">
                <div className="eyebrow">Powered by Gemini AI</div>
                <h2>Expiry Radar & Chef</h2>
              </div>

              <ExpiryRadar inventory={inventory} />

              <button
                className="cook-btn"
                onClick={handleCook}
                disabled={recipeStatus === 'loading'}
              >
                {recipeStatus === 'loading'
                  ? '⚡ Gemini AI is thinking…'
                  : '✨ Cook Something Now →'}
              </button>

              <RecipeCard
                status={recipeStatus}
                recipe={recipe}
                errorMessage={errorMessage}
                onSaveRecipe={handleSaveRecipe}
                isSaved={isCurrentRecipeSaved}
              />
            </section>
          </div>
        ) : (
          <SavedRecipes
            savedRecipes={savedRecipes}
            onDeleteRecipe={handleDeleteSavedRecipe}
            onSelectRecipe={handleSelectSavedRecipe}
          />
        )}
      </main>

      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentKey={apiSettings.apiKey}
        currentModel={apiSettings.model}
        onSave={(newSettings) => {
          setApiSettings(newSettings);
          showToast(`AI settings updated: using ${newSettings.model}`);
        }}
      />

      <footer>
        <div className="footer-content">
          <span className="footer-brand">ShelfLife</span> — Cook what you have, before it's gone.
          Track your kitchen shelf & generate zero-waste meals with Google Gemini AI.
        </div>
      </footer>
    </div>
  );
}
