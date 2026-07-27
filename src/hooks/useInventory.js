import { useEffect, useState } from 'react';
import { threeDaysFromNowISO, genId } from '../utils/dates.js';

const STORAGE_KEY = 'shelflife:inventory';

function getSampleData() {
  const today = new Date();
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  return [
    { id: genId(), name: 'Fresh Spinach', amount: '1 bag (200g)', category: 'Produce', expiry: addDays(1) },
    { id: genId(), name: 'Whole Milk', amount: '1/2 gallon', category: 'Dairy & Eggs', expiry: addDays(1) },
    { id: genId(), name: 'Cherry Tomatoes', amount: '1 pint', category: 'Produce', expiry: addDays(2) },
    { id: genId(), name: 'Chicken Breast', amount: '500g', category: 'Protein', expiry: addDays(3) },
    { id: genId(), name: 'Brown Eggs', amount: '6 eggs', category: 'Dairy & Eggs', expiry: addDays(5) },
    { id: genId(), name: 'Bell Pepper', amount: '2 items', category: 'Produce', expiry: addDays(6) },
  ];
}

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return getSampleData();
  } catch (e) {
    return getSampleData();
  }
}

export function useInventory() {
  const [inventory, setInventory] = useState(loadFromStorage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    } catch (e) {
      // Storage unavailable fallback
    }
  }, [inventory]);

  function addItem({ name, amount, category, expiry }) {
    setInventory((prev) => [
      { id: genId(), name, amount, category: category || 'Produce', expiry },
      ...prev,
    ]);
  }

  function editItem(id, updatedFields) {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  }

  function removeItem(id) {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  }

  function resetSampleItems() {
    const samples = getSampleData();
    setInventory(samples);
  }

  function clearAllItems() {
    setInventory([]);
  }

  return {
    inventory,
    addItem,
    editItem,
    removeItem,
    resetSampleItems,
    clearAllItems,
    defaultExpiry: threeDaysFromNowISO(),
  };
}
