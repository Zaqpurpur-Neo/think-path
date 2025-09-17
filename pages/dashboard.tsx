import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";

import withAuth from "@/hoc/withAuth";
import useAuth from "@/hooks/useAuth"
import styles from "@/styles/Dashboard.module.css"

import { axim } from "@/lib/axim";
import { UserContextType } from "@/types";
import { BookOpen, BookType, CircleCheckBig, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import ModuleBox from "@/components/ModuleBox";
import { Bab, ProgressStatus } from "@/generated/prisma";
import StatusBox from "@/components/StatusBox";
import TestBox from "@/components/TestBox";
import ListTable from "@/components/ListTable";

type Pages = "dashboard" | "progress";

export async function loadModule(userCtx: UserContextType) {
	if(userCtx.loading) return;	
	
	const res = await axim("/api/module-preview").post({
		userId: userCtx.user?.id
	})
	const data = await res.json()
	return data
}

function HomeSection({ modules, userId, move, setMove }) {
	const [moduleTotal, setModuleTotal] = useState(1);
	const [moduleDone, setModuleDone] = useState(1);
	const [loading, setLoading] = useState(false);
	const [isTestDone, setIsTestDone] = useState(false);

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

	const countModuleDone = (result: (Bab & { status: ProgressStatus })[]): number => {
		let count = 0;
		if(moduleTotal > 1 && moduleDone <= moduleTotal) {
			for (let item of result) {
				if(item.id === 1 && item.status === "DONE_READING") {
					count += 1;
				} else {
					if(item.status === "QUIZ_ATTEMPT") {
						count += 1;
					}
				}
			}

		}

		return count;
	}

	useEffect(() => {
		setLoading(true)
		if(modules?.result !== undefined) {
			setModuleTotal(modules.result.length);
		}

		if(moduleTotal > 1) {
			setLoading(false)
		}
	}, [modules?.result])

	useEffect(() => {
		if(modules?.result !== undefined) {
			const res = countModuleDone(modules.result)
			setModuleDone(res);
		}
		setLoading(false)
	}, [moduleTotal])

	useEffect(() => {
		const res = localStorage.getItem("testAttempt")
		if(res !== null && res !== undefined) {
			setIsTestDone(true)
		}
	}, [])

	return !loading && (
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
					<TestBox onClick={() => setMove(true)} isDone={isTestDone} isUnlock={moduleDone === moduleTotal} />
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

function ProgressSection({ modules, userId, move, setMove }) {
	const [moduleTotal, setModuleTotal] = useState(1);
	const [moduleDone, setModuleDone] = useState(1);
	const [loading, setLoading] = useState(false);
	const [quizLoading, setQuizLoading] = useState(false);
	const [testLoading, setTestLoading] = useState(false);
	const [leaderboard, setLeaderboard] = useState([])

	const [avgQuiz, setAvgQuiz] = useState(0);
	const [avgTest, setAvgTest] = useState(0);

	const countModuleDone = (result: (Bab & { status: ProgressStatus })[]): number => {
		let count = 0;
		if(moduleTotal > 1 && moduleDone <= moduleTotal) {
			for (let item of result) {
				if(item.id === 1 && item.status === "DONE_READING") {
					count += 1;
				} else {
					if(item.status === "QUIZ_ATTEMPT") {
						count += 1;
					}
				}
			}

		}

		return count;
	}

	useEffect(() => {
		setLoading(true)
		if(modules?.result !== undefined) {
			setModuleTotal(modules.result.length);
		}

		if(moduleTotal > 1) {
			setLoading(false)
		}
	}, [modules?.result])

	useEffect(() => {
		if(modules?.result !== undefined) {
			const res = countModuleDone(modules.result)
			setModuleDone(res);
		}
		setLoading(false)
	}, [moduleTotal])

	useEffect(() => {
		setQuizLoading(true)
		setTestLoading(true)

		if(avgQuiz <= 0) {
			let gh = 0;
			let count = 20;
			for (let i = 2; i <= 5; i++) {
				const arg = localStorage.getItem(`quizResult_bab${i}`)
				if(arg === null || arg == undefined) {
					setQuizLoading(false)
					break;
				}
				const lm = JSON.parse(arg)
				const jh = lm.filter(it => it.isCorrect)
				gh += jh.length;
			}

			const jk = gh/count * 100;
			setAvgQuiz(jk)
		}

		if(avgTest <= 0) {
			let gh = 0;
			let count = 20;
			for (let i = 2; i <= 5; i++) {
				const arg = localStorage.getItem("testResult")
				if(arg === null || arg == undefined) {
					setTestLoading(false)
					break;
				}
				const lm = JSON.parse(arg)
				const jh = lm.filter(it => it.isCorrect)
				gh += jh.length;
			}

			const jk = gh/count * 100;
			setAvgTest(jk)
		}
	}, [])

	const getQuizScore = (id) => {
		const arg = localStorage.getItem(`quizResult_bab${id}`)
		if(arg === undefined || arg === null) return 0;
		
		let gh = 0;
		let count = 5;
		const lm = JSON.parse(arg)
		const jh = lm.filter(it => it.isCorrect)
		gh += jh.length;
		const jk = gh/count * 100;
		return jk;
	}

	useEffect(() => {
		async function rb() {
			const ark = await axim("/api/leaderboard?limit=22").get();
			const data = await ark.json();

			setLeaderboard(data.leaderboard);
		}

		rb()
	}, [])

	useEffect(() => {
		if(avgQuiz > 0) setQuizLoading(false);
		if(avgTest > 0) setTestLoading(false);
	}, [avgQuiz, avgTest])

	const isLoading = !loading && !quizLoading && !testLoading

	return isLoading && (
		<div className={`${styles.progressSection} ${move && styles.fadeOut}`}>
			<div className={styles.homeInner}>
				<div className={styles.moduleSectionTop}>
					<StatusBox 
						title="Progress Keseluruhan" from={0} to={moduleDone} 
						maxValue={moduleTotal} format="percentage" useProgress={false} 
						icons={BookOpen}/>
					<StatusBox 
						title="Rata Rata Quiz" from={0} 
						to={avgQuiz} maxValue={100} format="percentage" useProgress={false}
						icons={Trophy} />
					<StatusBox 
						title="Nilai UAS" from={0} 
						to={avgTest} maxValue={100} format="percentage" useProgress={false}
						icons={BookType} />
				</div>

				<div className={styles.contentWrapper}>
					<div className={styles.flexing}>
						<div className={styles.moduleSectionDown}>
							{modules?.result && modules.result.map((item: Bab & { status: ProgressStatus })=> {
								const score = getQuizScore(item.id);
								return <ModuleBox
									key={item.id}
									data={item}
									noAction={true}
									miniText={`Quiz: ${score}%`}
									onClick={() => {}}
								/>
							})}
						</div>
						<div className={styles.innerWrapper}>
							<div className={styles.top}>
								<Trophy />
								<p>Leaderboard</p>
							</div>

							<ListTable 
								headers={["Ranking", "Nama", "Email", "Skor", "Total benar"]}
								arrays={leaderboard}
								setup={(item) => [item.rank, item.name, item.email, `${Math.floor(item.correctCount/20*100)}%`, item.correctCount]} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function Dashboard() {
	const [move, setMove] = useState(false);
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
	const [modules, setModules] = useState<{ result: Bab[] } | null>(null)

	useEffect(() => {
		async function rb() {
			const data = await loadModule(user)
			setModules(data)
		}
		rb()
	}, [user.loading])

	return user.loading ? "loading" : (
		<div className="container">
			<Navbar 
				pages={pages}
				user={user.user}
				normalRoute="dashboard"
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
				isSlideOut={move}
			/>

			{selectedPage === "dashboard" && modules !== null ?
				<HomeSection move={move} setMove={setMove} userId={user.user?.id} modules={modules} /> : 
				<ProgressSection move={move} setMove={setMove} userId={user.user?.id} modules={modules} />
			}
		</div>
	)
}

export default withAuth(Dashboard)
