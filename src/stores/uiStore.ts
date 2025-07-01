// src/stores/uiStore.ts
import { create } from 'zustand';

// We can define different types of modals for each feature later
type ModalType = 'lostAndFound' | null;

interface UIState {
  // which modal is currently open
  openModal: ModalType;
  // function to open a modal
  showModal: (modal: ModalType) => void;
  // function to close any modal
  hideModal: () => void;
}

// This creates the global store
export const useUIStore = create<UIState>((set) => ({
  openModal: null,
  showModal: (modal) => set({ openModal: modal }),
  hideModal: () => set({ openModal: null }),
}));