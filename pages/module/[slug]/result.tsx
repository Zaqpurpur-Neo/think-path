import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";

import styles from "@/styles/Result.module.css"
import { ArrowLeft, BookOpen, CircleCheck, CircleX, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { axim } from "@/lib/axim";

async function loadQuiz(slug) {
	const res = await axim(`/api/load-quiz?quiz=${slug}`).get()
	const data = await res.json()

	return data;
}

export default function ResultPage() {
	const router = useRouter();
	const pathname = usePathname();
	const { slug } = router.query;
	const { logout, loading } = useAuth();
	const userCtx = useUser();
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

	const [results, setResults] = useState<any[]>([]);
	const [quiz, setQuiz] = useState([]);

	useEffect(() => {
		const stored = localStorage.getItem("quizResult");
		if (stored) setResults(JSON.parse(stored));
	}, []);

	useEffect(() => {
		if(slug !== undefined) {
			async function rb() {
				const result = await loadQuiz(slug)
				setQuiz(result.content.questions)
			}

			rb()
		}
	}, [slug])

	const correctCount = results.filter(r => r.isCorrect).length;
	const total = results.length;

	return (userCtx.loading && loading) ? "loading" : (
		<div className={styles.resultRoot}>
			<Navbar 
				pages={pages} 
				user={userCtx.user}
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
			/>

			<div className={styles.contentWrapper}>
				<div className={styles.topperFlex}>	
					<div onClick={() => {
						const pt = pathname.split("/")
						pt.pop()
						router.push(pt.join("/"));
					}} className={styles.topperBack}>
						<ArrowLeft /><span>Kembali ke materi</span>
					</div>
				</div>

				<div className={styles.innerWrapper}>
				</div>

				<h2>Review Jawaban</h2>
				{quiz.map((item, idx) => {
					const res = results[idx]
					const answer = item.options[res.answer]
					const correctAnswer = item.options[item.answer]

					return (
						<div className={styles.innerWrapperMini}>
							<div className={styles.topperFlexLogos}>
								<p>{item?.text}</p>

								{res.isCorrect ? 
									<CircleCheck style={{ color: "var(--color-green-600)" }} /> : 
									<CircleX style={{ color: "var(--color-red-600)" }} />
								}
							</div>

							<div className={styles.resultAnswer}>
								<p className={res.isCorrect ? styles.resultAnswerRight : styles.resultAnswerWrong}>Jawaban Anda: {answer}</p>
								{!res.isCorrect && 
									<p className={styles.resultAnswerRight}>Jawaban Benar: {correctAnswer}</p> 
								}
							</div>
						</div>
					)
				})}

			</div>
		</div>
	)
}

