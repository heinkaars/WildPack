export type Category = {
  id: string;
  label: string;
};

export const CATEGORIES: Category[] = [
  { id: 'birds', label: 'Birds' },
  { id: 'mammals', label: 'Mammals' },
  { id: 'insects', label: 'Insects' },
  { id: 'reptiles', label: 'Reptiles' },
  { id: 'amphibians', label: 'Amphibians' },
  { id: 'fish', label: 'Fish' },
];

export function categoryById(id: string): Category | null {
  return CATEGORIES.find((category) => category.id === id) ?? null;
}
