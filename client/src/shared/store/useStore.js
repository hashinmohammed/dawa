import { create } from "zustand";
import { createAuthSlice } from "../../features/auth/model/authSlice";

export const useStore = create((...a) => ({
  ...createAuthSlice(...a),
}));
