import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfilePhotoStore {
  photo: string | null; // data URL
  setPhoto: (data: string | null) => void;
}

export const useProfilePhotoStore = create<ProfilePhotoStore>()(
  persist(
    (set) => ({
      photo: null,
      setPhoto: (data) => set({ photo: data }),
    }),
    {
      name: "kp_profile_photo_store",
      partialize: (s) => ({ photo: s.photo }),
    },
  ),
);

export const PROFILE_PHOTO_KEY = "kp_profile_photo";
