import {
	createElement,
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import AuthCheck from "../services/auth.check.js";
import type { AuthContextType } from "../types/authcontext.type.js";
import type { UserAuthData } from "../types/userdata.types.js";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserAuthData | null>(null);
	const [loading, setLoading] = useState(true);

	const checkAuth = useCallback(async () => {
		setLoading(true);
		try {
			const userData = await AuthCheck();
			setUser(userData ?? null);
            console.log("User data set in context:", userData);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void checkAuth();
	}, [checkAuth]);

	const value = useMemo(
		() => ({ user, setUser, loading, checkAuth }),
		[user, loading, checkAuth]
	);

	return createElement(AuthContext.Provider, { value }, children);
};
