import { useState } from 'react';

export default function ApiKeyModal({ isOpen, onClose, currentKey, currentModel, onSave }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [model, setModel] = useState(currentModel || 'gemini-2.5-flash');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  function handleSave() {
    onSave({ apiKey: apiKey.trim(), model });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  }

  function handleResetDefault() {
    setApiKey('');
    setModel('gemini-2.5-flash');
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Google Gemini AI Settings</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            ShelfLife uses <strong>Google Gemini AI</strong> to turn your near-expiry ingredients into custom, zero-waste recipes.
          </p>

          <div className="form-group">
            <label>AI Model Selection (Low-Credit Optimized)</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="modal-select">
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Ultra Fast & Lowest Cost)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gemini API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key..."
              className="modal-input"
            />
            <span className="input-hint">Your API key is stored locally in your browser session.</span>
          </div>

          {savedNotice && <div className="toast-success">Settings saved successfully!</div>}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={handleResetDefault}>
            Clear Key
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
