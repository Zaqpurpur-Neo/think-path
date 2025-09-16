import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";

import withAuth from "@/hoc/withAuth";
import useAuth from "@/hooks/useAuth"
import styles from "@/styles/Dashboard.module.css"

import { axim } from "@/lib/axim";
import { UserContextType } from "@/types";
import { BookOpen, CircleCheckBig, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import ModuleBox from "@/components/ModuleBox";
import { Bab, ProgressStatus } from "@/generated/prisma";
import StatusBox from "@/components/StatusBox";
import TestBox from "@/components/TestBox";

type Pages = "dashboard" | "progress";

async function loadModule(userCtx: UserContextType) {
	if(userCtx.loading) return;	
	
	const res = await axim("/api/module-preview").post({
		userId: userCtx.user?.id
	})
	const data = await res.json()
	return data
}

function HomeSection({ modules, userId }) {
	const [move, setMove] = useState(false);
	const [moduleTotal, setModuleTotal] = useState(1);
	const [moduleDone, setModuleDone] = useState(1);

	const handleOpenend = async (postId: number) => {
		if(userId !== undefined || userId !== null) {
			const res = await axim("/api/update-progress").post({
				userId: userId,
				postId: postId,
				status: "OPENED"
			} as { status: ProgressStatus})
			const _data = await res.json()
		}
	}

	const countModuleDone = (result: (Bab & { status: ProgressStatus })[]) => {
		if(moduleTotal > 1 && moduleDone <= moduleTotal) {
			for (let item of result) {
				if(item.id === 1 && item.status === "DONE_READING") {
					setModuleDone(prev => prev + 1);
				} else {
					if(item.status === "QUIZ_ATTEMPT") setModuleDone(prev => prev + 1)
				}
			}
			setModuleDone(prev => prev - 1)
		}
	}

	useEffect(() => {
		if(modules?.result !== undefined) {
			setModuleTotal(modules.result.length);
		}
	}, [modules?.result])

	useEffect(() => {
		if(modules?.result !== undefined) {
			countModuleDone(modules.result)
		}
	}, [moduleTotal])

	return (
		<div className={`${styles.homeSection} ${move && styles.fadeOut}`}>
			<div className={styles.homeInner}>
				<div className={styles.moduleSectionTop}>
					<StatusBox 
						title="Progress Keseluruhan" from={0} to={moduleDone} 
						maxValue={moduleTotal} format="percentage" 
						icons={BookOpen}/>
					<StatusBox 
						title="Modul Selesai" from={0} 
						to={moduleDone} maxValue={moduleTotal} format="slice"
						icons={CircleCheckBig} />
					<TestBox />
				</div>
				<h1 className={styles.titleModule}>Modul Pembelajaran</h1>
				<div className={styles.moduleSection}>
					{modules?.result && modules.result.map((item: Bab & { status: ProgressStatus })=> {
						return <ModuleBox
							key={item.id}
							data={item}
							onClick={() => {
								setMove(true)
								if(item.status === "NOT_OPENED") handleOpenend(item.number)
							}}
						/>
					})}
				</div>
			</div>
		</div>
	)
}

function ProgressSection() {
	return (
		<div className={styles.progressSection}>
		</div>
	)
}

function Dashboard() {
	const { logout } = useAuth();
	const user = useUser();

	const pages: {
		[key: string]: any
	} = {
		dashboard: {
			route: "dashboard",
			icon: BookOpen,
			pages: HomeSection
		},
		progress: {
			route: "progress",
			icon: Trophy,
			pages: ProgressSection
		}
	}
	const [selectedPage, setSelectedPage] = useState<Pages>("dashboard");
	const [modules, setModules] = useState([])

	useEffect(() => {
		async function rb() {
			const data = await loadModule(user)
			setModules(data)
		}
		rb()
	}, [,user])

	return user.loading ? "loading" : (
		<div className="container">
			<Navbar 
				pages={pages}
				user={user.user}
				normalRoute="dashboard"
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
			/>

			{selectedPage === "dashboard" ?
				<HomeSection userId={user.user?.id} modules={modules} /> : 
				<ProgressSection />
			}
		</div>
	)
}

export default withAuth(Dashboard)
