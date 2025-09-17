import { clearToken, getToken, verifyToken } from "@/lib/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; 

export default function useAuth(redirectTo: string = "/login") {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		const token = getToken();
		if(!token) router.push(redirectTo);
		else { 
			setAuthenticated(true); 
		}

		setLoading(false)
	}, [loading, authenticated]);

	return { authenticated, loading, logout: () => {
		clearToken();
		localStorage.removeItem("quizResult");
		for (let i = 2; i <= 5; i++) localStorage.removeItem(`quizResult_bab${i}`);
		localStorage.removeItem("testResult");
		router.replace(redirectTo);
	}}
}
