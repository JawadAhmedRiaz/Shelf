const ICONS = [
  [/spinach|lettuce|kale|herb|basil|cilantro|parsley|greens|salad|cabbage/i, '🥬'],
  [/tomato|cherry tomato/i, '🍅'],
  [/pepper|capsicum|bell pepper|chili/i, '🫑'],
  [/onion|garlic|shallot|scallion|leek/i, '🧅'],
  [/carrot/i, '🥕'],
  [/potato|sweet potato|yam/i, '🥔'],
  [/cucumber|zucchini/i, '🥒'],
  [/corn/i, '🌽'],
  [/mushroom/i, '🍄'],
  [/broccoli|cauliflower/i, '🥦'],
  [/avocado/i, '🥑'],
  [/milk|cream|yogurt|butter/i, '🥛'],
  [/cheese|cheddar|mozzarella|parmesan/i, '🧀'],
  [/egg|eggs/i, '🥚'],
  [/chicken|turkey/i, '🍗'],
  [/beef|steak|pork|bacon|ham|sausage/i, '🥩'],
  [/fish|salmon|tuna|shrimp|prawn|seafood/i, '🐟'],
  [/bread|bun|bagel|toast|croissant/i, '🍞'],
  [/rice|pasta|noodle|spaghetti|grain/i, '🍚'],
  [/apple/i, '🍎'],
  [/banana/i, '🍌'],
  [/berry|blueberries|strawberries|raspberries/i, '🍓'],
  [/lemon|lime|orange|citrus/i, '🍋'],
  [/grape|grapes/i, '🍇'],
  [/watermelon|melon/i, '🍉'],
  [/oil|olive oil|vinegar|sauce/i, '🍾'],
  [/can|canned|soup|beans/i, '🥫'],
];

export function iconFor(name) {
  if (!name) return '🥫';
  for (const [re, icon] of ICONS) {
    if (re.test(name)) return icon;
  }
  return '🥗';
}

export const CATEGORIES = [
  { id: 'Produce', label: 'Produce', icon: '🥬' },
  { id: 'Dairy & Eggs', label: 'Dairy & Eggs', icon: '🥛' },
  { id: 'Protein', label: 'Protein & Meat', icon: '🥩' },
  { id: 'Bakery', label: 'Bakery', icon: '🍞' },
  { id: 'Pantry', label: 'Pantry & Canned', icon: '🥫' },
];
