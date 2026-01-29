export const createPatientSlice = (set) => ({
  patientFilters: {
    department: "",
    doctor: "",
    search: "",
    fromDate: null,
    toDate: null,
    sortOrder: "desc",
    page: 1,
  },

  setPatientFilters: (newFilters) =>
    set((state) => ({
      patientFilters: { ...state.patientFilters, ...newFilters },
    })),

  // helper to set page specifically
  setPatientPage: (page) =>
    set((state) => ({
      patientFilters: { ...state.patientFilters, page },
    })),

  clearPatientFilters: () =>
    set({
      patientFilters: {
        department: "",
        doctor: "",
        search: "",
        fromDate: null,
        toDate: null,
        sortOrder: "desc",
        page: 1,
      },
    }),
});
