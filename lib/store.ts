import { create } from "zustand";

interface FilterState {
  selectedCategories: string[];
  selectedCities: string[];
  priceRange: string | null;
  toggleCategory: (category: string) => void;
  toggleCity: (city: string) => void;
  setPriceRange: (range: string | null) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedCategories: [],
  selectedCities: [],
  priceRange: null,
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),
  toggleCity: (city) =>
    set((state) => ({
      selectedCities: state.selectedCities.includes(city)
        ? state.selectedCities.filter((c) => c !== city)
        : [...state.selectedCities, city],
    })),
  setPriceRange: (range) =>
    set((state) => ({
      priceRange: state.priceRange === range ? null : range,
    })),
  resetFilters: () =>
    set({ selectedCategories: [], selectedCities: [], priceRange: null }),
}));
