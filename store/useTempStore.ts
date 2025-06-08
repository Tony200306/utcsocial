import { Thread } from '@/types/threadType';
import { create } from 'zustand';

type useTempStoreType = {
  currentThread: Thread | null;
  setCurrentThread: (thread: Thread | null) => void;
};

const useTempStore = create<useTempStoreType>((set) => ({
  currentThread: null,
  setCurrentThread: (thread) => set({ currentThread: thread }),
}));

export default useTempStore;