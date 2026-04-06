import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Zone } from "./products";

type StoreState = {
  hearts: string[];
  invited: boolean;
  visitorName: string;
  zonesVisited: Zone[];
  storeHubVisits: number; // how many times they've been back to hub
  hasEnteredStore: boolean; // true after first "Let's go!" tap
  toggleHeart: (id: string) => void;
  isHearted: (id: string) => boolean;
  setInvited: (name: string) => void;
  markZoneVisited: (zone: Zone) => void;
  incrementHubVisit: () => void;
  markEnteredStore: () => void;
  clearHearts: () => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      hearts: [],
      invited: false,
      visitorName: "",
      zonesVisited: [],
      storeHubVisits: 0,
      hasEnteredStore: false,
      toggleHeart: (id) => {
        const { hearts } = get();
        if (hearts.includes(id)) {
          set({ hearts: hearts.filter((h) => h !== id) });
        } else {
          set({ hearts: [...hearts, id] });
        }
      },
      isHearted: (id) => get().hearts.includes(id),
      setInvited: (name) =>
        set({ invited: true, visitorName: name, zonesVisited: [], storeHubVisits: 0, hearts: [] }),
      markZoneVisited: (zone) => {
        const { zonesVisited } = get();
        if (!zonesVisited.includes(zone)) {
          set({ zonesVisited: [...zonesVisited, zone] });
        }
      },
      incrementHubVisit: () =>
        set((s) => ({ storeHubVisits: s.storeHubVisits + 1 })),
      markEnteredStore: () => set({ hasEnteredStore: true }),
      clearHearts: () => set({ hearts: [] }),
    }),
    { name: "zoe-store" }
  )
);
