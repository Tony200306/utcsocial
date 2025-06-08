import { create } from "zustand";

interface TriggerState {
  LeftSidebarOpened: boolean;
  isCreateThreadCardOpened: boolean;
  //   setTrigger: (
  //     triggerName: keyof Omit<TriggerState, "setTrigger" | "toggleTrigger">,
  //     value: boolean
  //   ) => void;
  toggleTrigger: (
    triggerName: keyof Omit<TriggerState, "setTrigger" | "toggleTrigger">
  ) => void;
}

const useTriggerStore = create<TriggerState>((set, get) => ({
  LeftSidebarOpened: false,
  isCreateThreadCardOpened: false,
  //   setTrigger: (triggerName, value) =>
  //     set((state) => ({ ...state, [triggerName]: value })),

  toggleTrigger: (triggerName) => {
    set((state) => {
      const current = state[triggerName];
      if (typeof current === "boolean") {
        return { ...state, [triggerName]: !current };
      }
      return state;
    });
  },
}));

export default useTriggerStore;
