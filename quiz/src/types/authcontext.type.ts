import { UserAuthData } from "./userdata.types";
import type { Dispatch, SetStateAction } from "react";

export type AuthContextType = {
  user: UserAuthData | null;
  setUser: Dispatch<SetStateAction<UserAuthData | null>>;
  loading: boolean;
  checkAuth: () => Promise<void>;
};