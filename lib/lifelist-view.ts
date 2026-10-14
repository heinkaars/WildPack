import { LifelistEntry } from './types';

export type SortOrder = 'newest' | 'oldest' | 'name' | 'most-seen';

/** What the life list's Filter pop-up sets. */
export type LifelistView = {
  /** A category id from `lib/categories.ts`, or null for all. */
  category: string | null;
  sort: SortOrder;
};

export const DEFAULT_VIEW: LifelistView = { category: null, sort: 'newest' };

export const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: 'newest', label: 'Recently seen' },
  { id: 'oldest', label: 'First found' },
  { id: 'name', label: 'A to Z' },
  { id: 'most-seen', label: 'Most seen' },
];

export function isDefaultView(view: LifelistView): boolean {
  return view.category === DEFAULT_VIEW.category && view.sort === DEFAULT_VIEW.sort;
}

export function applyView(entries: LifelistEntry[], view: LifelistView): LifelistEntry[] {
  const shown = view.category ? entries.filter((entry) => entry.categoryId === view.category) : [...entries];

  switch (view.sort) {
    case 'newest':
      return shown.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
    case 'oldest':
      return shown.sort((a, b) => a.firstSeenAt.localeCompare(b.firstSeenAt));
    case 'name':
      return shown.sort((a, b) => a.commonName.localeCompare(b.commonName));
    case 'most-seen':
      return shown.sort((a, b) => b.sightingCount - a.sightingCount || b.lastSeenAt.localeCompare(a.lastSeenAt));
  }
}
