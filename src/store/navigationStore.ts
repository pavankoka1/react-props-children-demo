import { create } from "zustand";

export interface NavigationState {
  currentPage: number;
  visitedPages: number[];
  setCurrentPage: (page: number) => void;
}

export const useNavigationStore = create<NavigationState>((setState) => ({
  currentPage: 1,
  visitedPages: [1],
  setCurrentPage: (page: number) =>
    setState((state) => ({
      currentPage: page,
      visitedPages: [...new Set([...state.visitedPages, page])],
    })),
}));
