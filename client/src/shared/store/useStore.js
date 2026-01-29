import { create } from "zustand";
import { createAuthSlice } from "../../features/auth/model/authSlice";
import { createPatientSlice } from "../../features/patients/model/patientSlice";

export const useStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createPatientSlice(...a),
}));
