import { useState } from 'react';
import { daysLeft, urgencyClass, urgencyLabel, formatDate } from '../utils/dates.js';
import { iconFor } from '../utils/icons.js';

export default function ShelfList({
  inventory,
  onRemove,
  onEdit,
  onResetSamples,
  onClearAll,
}) {
  const [filter, setFilter] = useState('all'); // all | now | soon | fresh
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Sorting: Soonest expiring first
  const sorted = [...inventory].sort((a, b) => daysLeft(a.expiry) - daysLeft(b.expiry));

  // Filtering
  const filtered = sorted.filter((item) => {
    const d = daysLeft(item.expiry);
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'now') return d <= 1;
    if (filter === 'soon') return d > 1 && d <= 3;
    if (filter === 'fresh') return d > 3;
    return true;
  });

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingItem) return;
    onEdit(editingItem.id, {
      name: editingItem.name,
      amount: editingItem.amount,
      category: editingItem.category,
      expiry: editingItem.expiry,
    });
    setEditingItem(null);
  }

  return (
    <div className="shelf-container">
      <div className="shelf-controls">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shelf-search"
        />

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({inventory.length})
          </button>
          <button
            className={`filter-btn now ${filter === 'now' ? 'active' : ''}`}
            onClick={() => setFilter('now')}
          >
            Use Now
          </button>
          <button
            className={`filter-btn soon ${filter === 'soon' ? 'active' : ''}`}
            onClick={() => setFilter('soon')}
          >
            Soon
          </button>
          <button
            className={`filter-btn fresh ${filter === 'fresh' ? 'active' : ''}`}
            onClick={() => setFilter('fresh')}
          >
            Fresh
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-shelf">
          <p>No items found matching your filter.</p>
          {inventory.length === 0 && (
            <div className="empty-actions">
              <button className="btn-secondary-sm" onClick={onResetSamples}>
                Load Sample Items
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="shelf-list">
          {filtered.map((item) => {
            const d = daysLeft(item.expiry);
            const cls = urgencyClass(d);
            return (
              <li className={`shelf-item urgency-${cls}`} key={item.id}>
                <span className="shelf-icon">{iconFor(item.name)}</span>
                <div className="shelf-info">
                  <div className="shelf-name">
                    {item.name}
                    {item.category && <span className="cat-chip">{item.category}</span>}
                  </div>
                  <div className="shelf-meta">
                    {item.amount} · Exp: {formatDate(item.expiry)}
                  </div>
                </div>
                <span className={`badge ${cls}`}>{urgencyLabel(d)}</span>

                <div className="item-actions">
                  <button
                    className="icon-btn edit-btn"
                    title="Edit item"
                    onClick={() => setEditingItem(item)}
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn used-btn"
                    title="Mark used"
                    onClick={() => onRemove(item.id)}
                  >
                    ✓
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    title="Remove item"
                    onClick={() => onRemove(item.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {inventory.length > 0 && (
        <div className="shelf-footer-actions">
          <button className="btn-link" onClick={onResetSamples}>
            ↺ Reset Samples
          </button>
          <button className="btn-link danger" onClick={onClearAll}>
            🗑 Clear Shelf
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Shelf Item</h3>
              <button className="modal-close" onClick={() => setEditingItem(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="modal-body">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity / Amount</label>
                <input
                  type="text"
                  value={editingItem.amount}
                  onChange={(e) => setEditingItem({ ...editingItem, amount: e.target.value })}
                  className="modal-input"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={editingItem.expiry}
                  onChange={(e) => setEditingItem({ ...editingItem, expiry: e.target.value })}
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
