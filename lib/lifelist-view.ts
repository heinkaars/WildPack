import { LifelistEntry } from './types';

export type SortOrder = 'newest' | 'name' | 'name-desc' | 'most-captured';

/** What the life list's Filter pop-up sets. */
export type LifelistView = {
  /** Category ids from `lib/categories.ts`; empty means all. */
  categories: string[];
  sort: SortOrder;
};

export const DEFAULT_VIEW: LifelistView = { categories: [], sort: 'newest' };

export const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: 'newest', label: 'Recently captured' },
  { id: 'name', label: 'A to Z' },
  { id: 'name-desc', label: 'Z to A' },
  { id: 'most-captured', label: 'Most captured' },
];

export function isDefaultView(view: LifelistView): boolean {
  return view.categories.length === 0 && view.sort === DEFAULT_VIEW.sort;
}

/** Adds the category if it isn't picked yet, removes it if it is. */
export function toggleCategory(view: LifelistView, id: string): LifelistView {
  const categories = view.categories.includes(id)
    ? view.categories.filter((picked) => picked !== id)
    : [...view.categories, id];
  return { ...view, categories };
}

export function applyView(entries: LifelistEntry[], view: LifelistView): LifelistEntry[] {
  const shown =
    view.categories.length > 0 ? entries.filter((entry) => view.categories.includes(entry.categoryId)) : [...entries];

  switch (view.sort) {
    case 'newest':
      return shown.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
    case 'name':
      return shown.sort((a, b) => a.commonName.localeCompare(b.commonName));
    case 'name-desc':
      return shown.sort((a, b) => b.commonName.localeCompare(a.commonName));
    case 'most-captured':
      return shown.sort((a, b) => b.sightingCount - a.sightingCount || b.lastSeenAt.localeCompare(a.lastSeenAt));
  }
}
