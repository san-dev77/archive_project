import { create } from "zustand"

export const useFilterStore = create((set) => ({
    filtre: "",
    updateFilter(filtre) {
        console.log(filtre);

        console.log("Filtre mis à jour:", filtre); // Log the new filter value
        set({ filtre: filtre });
        console.log(filtre);

    }

}))


