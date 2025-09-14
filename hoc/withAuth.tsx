import useAuth from "@/hooks/useAuth"

export default function withAuth(Comp: any) {
	return (props: any[]) => {
		const { authenticated, loading } = useAuth();

		if(loading) return <h1>Loading</h1>;
		if(!authenticated) return null;

		return <Comp {...props}/>
	}
}
