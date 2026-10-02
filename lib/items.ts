import type { Item, Rarity } from "./types";

export const ITEMS: Item[] = [
  // Common
  { id: "pebble", name: "Lucky Pebble", icon: "🪨", rarity: "common", description: "A smooth stone. Probably not lucky." },
  { id: "bottlecap", name: "Bottle Cap", icon: "🔘", rarity: "common", description: "Shiny, dented, beloved." },
  { id: "string", name: "Ball of String", icon: "🧵", rarity: "common", description: "Endless. Somehow." },
  { id: "acorn", name: "Acorn", icon: "🌰", rarity: "common", description: "A tiny promise of a tree." },
  { id: "paperclip", name: "Bent Paperclip", icon: "📎", rarity: "common", description: "It has seen things." },
  { id: "marble", name: "Glass Marble", icon: "⚪", rarity: "common", description: "Rolls further than expected." },

  // Uncommon
  { id: "compass", name: "Brass Compass", icon: "🧭", rarity: "uncommon", description: "Points somewhere. Usually north." },
  { id: "key", name: "Small Key", icon: "🔑", rarity: "uncommon", description: "Opens something, somewhere." },
  { id: "feather", name: "Quill Feather", icon: "🪶", rarity: "uncommon", description: "Light as a good idea." },
  { id: "shell", name: "Spiral Shell", icon: "🐚", rarity: "uncommon", description: "Hold it up and hear the arcade." },
  { id: "candle", name: "Stub Candle", icon: "🕯️", rarity: "uncommon", description: "Burns twice as bright, half as long." },

  // Rare
  { id: "gem_blue", name: "Sapphire Chip", icon: "💎", rarity: "rare", description: "Cool to the touch." },
  { id: "coin_gold", name: "Gilded Coin", icon: "🪙", rarity: "rare", description: "Heavier than it looks." },
  { id: "scroll", name: "Old Scroll", icon: "📜", rarity: "rare", description: "The ink is still wet." },
  { id: "lantern", name: "Pocket Lantern", icon: "🏮", rarity: "rare", description: "Never needs a match." },

  // Epic
  { id: "crown", name: "Tarnished Crown", icon: "👑", rarity: "epic", description: "Worn by someone who mattered." },
  { id: "orb", name: "Humming Orb", icon: "🔮", rarity: "epic", description: "It knows your next move." },
  { id: "hourglass", name: "Stopped Hourglass", icon: "⏳", rarity: "epic", description: "Frozen mid-fall. Forever." },

  // Legendary
  { id: "dragon_scale", name: "Dragon Scale", icon: "🐉", rarity: "legendary", description: "Warm, and faintly alive." },
  { id: "star_shard", name: "Star Shard", icon: "🌟", rarity: "legendary", description: "Fell a very long way to be here." },

  // Mythic
  { id: "void_pearl", name: "Void Pearl", icon: "🖤", rarity: "mythic", description: "It reflects nothing at all." },
  { id: "phoenix_egg", name: "Phoenix Egg", icon: "🥚", rarity: "mythic", description: "Warm. Patient. Waiting." },
];

export const ITEM_MAP: Record<string, Item> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i])
);

export function itemsByRarity(r: Rarity): Item[] {
  return ITEMS.filter((i) => i.rarity === r);
}

export function randomItemOfRarity(r: Rarity): Item {
  const pool = itemsByRarity(r);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const TOTAL_ITEMS = ITEMS.length;
