import Button from "@/components/Button";
import { Label } from "@/components/Label";
import Navbar from "@/components/Navbar";
import { Progress } from "@/components/Progress";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { useUser } from "@/context/UserContext";
import { ProgressStatus } from "@/generated/prisma";
import useAuth from "@/hooks/useAuth";
import { axim } from "@/lib/axim";
import styles from "@/styles/Quiz.module.css"
import { ArrowLeft, BookOpen, CircleQuestionMark, Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

type Answer = "A" | "B" | "C" | "D" | "E"

type Quiz = {
	id: number,
	text: string,
	options: {
		[key: Answer]: any
	},
	answer: Answer
}

export default function Quiz() {
	const router = useRouter();
	const pathname = usePathname();
	const { logout, loading } = useAuth();
	const userCtx = useUser();
	const { slug } = router.query;
	const postId = parseInt(slug?.slice(3, slug.length))

	const [totalPage, setTotalPage] = useState(1)
	const [currentPage, setCurrentPage] = useState(1)

	const pages: any[] = [
		{
			route: "dashboard",
			icon: BookOpen
		},
		{
			route: "progress",
			icon: Trophy
		}
	]
	const [selectedPage, setSelectedPage] = useState(null);
	const [quiz, setQuiz] = useState<Quiz[]>([]);
	const [answer, setAnswer] = useState<{ [key: string]: null | Answer }>({
		"1": null,
		"2": null,
		"3": null,
		"4": null,
		"5": null,
	})
	const [percentage, setPercantage] = useState(0);

	const currentQuiz: Quiz = quiz[currentPage - 1];
	const currentAnswer: Answer | null = answer[`${currentPage}`]

	useEffect(() => {
		const ct = Math.round(currentPage/totalPage * 100)
		setPercantage(ct)
	}, [,currentPage, totalPage, percentage]);

	useEffect(() => {
		if(slug !== undefined) {
			async function rb() {
				const res = await axim(`/api/load-quiz?quiz=${slug}`).get()
				const data = await res.json()

				setQuiz(data.content.questions)
				setTotalPage(data.content.questions.length)
			}
			rb()
		}
	}, [,slug])

	const handleChange = (value) => {
		setAnswer({ ...answer, [`${currentPage}`]: value })
	}

	const handleSubmit = async () => {
		const token = localStorage.getItem("token")
		const attempts = await Promise.all(Object.entries(answer).map(async (item) => {
			const res = await axim("/api/attempt-quiz", { Authorization: `Bearer ${token}` }).post({	
			// console.log({
			// return ({
				babId: slug,
				quizId: parseInt(item[0]),
				answer: item[1]
			})
			return await res.json()
		}))

		const resulted = JSON.stringify(attempts.map(i => i?.attempt));
		localStorage.setItem("quizResult", resulted)
		router.push(`/module/${slug}/result`)
	}

	const handleQuizAttempted = async (e) => {
		const res = await axim("/api/update-progress").post({
			userId: userCtx.user?.id,
			postId: postId,
			status: "QUIZ_ATTEMPT"
		} as { status: ProgressStatus})
	}

	return (userCtx.loading && loading) ? "" : (
		<div className={styles.quizRoot}>
			<Navbar 
				pages={pages} 
				user={userCtx.user}
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
			/>

			{ loading ? "" :
			<div className={styles.contentWrapper}>
				<div className={styles.topperFlex}>	
					<div onClick={() => {
						const pt = pathname.split("/")
						pt.pop()
						router.push(pt.join("/"));
					}} className={styles.topperBack}>
						<ArrowLeft /><span>Kembali ke materi</span>
					</div>
					<p>
						Pertanyaan {currentPage} dari {totalPage}	
					</p>
				</div>

				<div className={styles.progress}>
					<div className={styles.progressId}>
						<p>Progress</p>
						<p>{percentage}%</p>
					</div>
					<Progress value={percentage} />
				</div>

				<div className={styles.innerWrapper}>
					<div className={styles.top}>
						<CircleQuestionMark />
						Pertanyaan {currentPage}
					</div>

					<p className={styles.question}>
						{currentQuiz && currentQuiz.text}
					</p>

					<div className={styles.options}>
						<RadioGroup value={currentAnswer} onValueChange={handleChange}>
							{currentQuiz && Object.entries(currentQuiz.options).map(item => {
								return <div key={item[0]} className={styles.optionsItem}>
									<RadioGroupItem id={"id-" + item[0]} value={`${item[0]}`} />
									<Label htmlFor={"id-" + item[0]}>{item[1]}</Label>
								</div>
							})}
						</RadioGroup>
					</div>

					<div className={styles.navigation}>
						 <Button 
						 	outline={true} 
							disabled={currentPage <= 1}
							onClick={() => {
								if(currentPage > 1) setCurrentPage(prev => prev - 1)
						 	}}>
							Sebelumnya
						</Button>
						 { (Object.values(answer).includes(null) && currentPage === quiz.length) ? 
							 (<Button disabled={true}>
						 		Selesai
							 </Button>) :
							 (<Button onClick={async () => {
								if(currentPage < quiz.length) setCurrentPage(prev => prev + 1);
								else {
									await handleQuizAttempted();
									handleSubmit();
								}
							 }}>
							 	{currentPage === quiz.length ? "Selesai" : "Selanjutnya"}
							  </Button>)
						 }
					</div>
				</div>

				<div className={styles.numNav}>
					{Array.from({ length: totalPage }).map((_, idx) => {
						return <button onClick={() => {
								setCurrentPage(idx + 1)
							}} 
							className={`${styles.numNavItem} ${(currentPage === idx + 1) && styles.numNavItemSelected}`} 
							key={idx}>
							{idx + 1}
						</button>
					})}
				</div>
			</div>
			}

		</div>
	)
}
