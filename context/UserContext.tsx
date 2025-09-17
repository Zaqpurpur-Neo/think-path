import { User, UserContextType } from "@/types";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const UserContext = createContext<UserContextType | undefined>(undefined);

async function authFetch(url: string, options: RequestInit = {}) {
	const token = localStorage.getItem("token");
	const headers = {
		...options.headers,
		Authorization: token ? `Bearer ${token}` : "",
		"Content-Type": "application/json",
	};
	return fetch(url, { ...options, headers, method: "POST" });
}

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter()

	const refreshUser = async () => {
		const res = await authFetch("/api/auth/profile");
		console.log(router)
		if (res.ok) {
			const data = await res.json();
			setUser(data.user);
			setLoading(false);
		} else {
			if(res.status >= 400 && router.pathname !== "/") {
				router.push("/login")
			}
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, refreshUser }}>
		{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const ctx = useContext(UserContext);
	if (!ctx) throw new Error("useUser must be used within a UserProvider");
	return ctx;
}

