import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const core_rarities: string[] = [
  "Common", "Uncommon", "Rare", "Epic", "Legendary",
  "Mythic", "Divine", "Ancient", "Celestial", "Cosmic",
  "Eternal", "Transcendent", "Infinite", "Primordial",
  "Omniversal", "Singularity", "Absolute", "Paradoxical",
  "Boundless", "Undefined"
];

const restart_point: string = "Legendary";

const prefixes: string[] = [
  "Ultra", "Hyper", "Meta", "Neo", "Post", "Supra",
  "Omni", "Para", "Quantum", "Chrono", "Prime", "Final"
];

export function getNextRarity(current: string): string {
  const parts = current.split(" ");

  // Case 1: still climbing core list
  if (core_rarities.includes(current)) {
    const idx = core_rarities.indexOf(current);
    if (idx + 1 < core_rarities.length) {
      return core_rarities[idx + 1];
    } else {
      // hit end → restart at Legendary with first prefix
      return prefixes[0] + " " + restart_point;
    }
  }
  // Case 2: already prefixed
  else {
    const prefix_chain = parts.slice(0, -1); // e.g. ["Ultra", "Hyper"]
    const core = parts[parts.length - 1];    // e.g. "Legendary"

    const last_prefix = prefix_chain[prefix_chain.length - 1];
    if (prefixes.includes(last_prefix)) {
      const idx = prefixes.indexOf(last_prefix);
      if (idx + 1 < prefixes.length) {
        // upgrade last prefix
        return [...prefix_chain.slice(0, -1), prefixes[idx + 1], core].join(" ");
      } else {
        // add another prefix layer
        return [...prefix_chain, prefixes[0], core].join(" ");
      }
    } else {
      return prefixes[0] + " " + restart_point;
    }
  }
}
