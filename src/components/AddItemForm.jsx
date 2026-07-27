import { useState } from 'react';
import { CATEGORIES } from '../utils/icons.js';

const QUICK_PRESETS = [
  { name: 'Spinach', amount: '1 bag', category: 'Produce', days: 2 },
  { name: 'Milk', amount: '1 L', category: 'Dairy & Eggs', days: 2 },
  { name: 'Tomatoes', amount: '4 items', category: 'Produce', days: 1 },
  { name: 'Eggs', amount: '6 items', category: 'Dairy & Eggs', days: 5 },
  { name: 'Bread', amount: '1 loaf', category: 'Bakery', days: 3 },
];

export default function AddItemForm({ onAdd, defaultExpiry }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Produce');
  const [expiry, setExpiry] = useState(defaultExpiry);

  function handleAdd() {
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      amount: amount.trim() || '1 item',
      category,
      expiry: expiry || defaultExpiry,
    });

    setName('');
    setAmount('');
    setExpiry(defaultExpiry);
  }

  function handleQuickAdd(preset) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + preset.days);
    const expiryStr = targetDate.toISOString().slice(0, 10);

    onAdd({
      name: preset.name,
      amount: preset.amount,
      category: preset.category,
      expiry: expiryStr,
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }

  return (
    <div className="add-form-container">
      <div id="addForm">
        <input
          type="text"
          placeholder="Item name (e.g. Spinach)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-input name-input"
        />
        <input
          type="text"
          placeholder="Qty / Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-input qty-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select category-select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="form-input date-input"
        />
        <button type="button" onClick={handleAdd} className="btn-add">
          + Add Item
        </button>
      </div>

      <div className="quick-presets">
        <span className="presets-label">Quick add:</span>
        {QUICK_PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="preset-chip"
            onClick={() => handleQuickAdd(p)}
          >
            + {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
