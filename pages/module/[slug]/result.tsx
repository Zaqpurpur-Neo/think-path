import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";

import styles from "@/styles/Result.module.css"
import { ArrowLeft, BookOpen, BotMessageSquare, CircleCheck, CircleX, MessageSquare, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { axim } from "@/lib/axim";
import { Question } from "@/types";
import { QuizAttempt } from "@/generated/prisma";
import { QuestionTable } from "@/components/QuestionTable";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { Label } from "@/components/Label";
import CountUp from "@/components/CountUp";
import Button from "@/components/Button";
import { marked, options } from "marked";

async function loadQuiz(slug) {
	const res = await axim(`/api/load-quiz?quiz=${slug}`).get()
	const data = await res.json()

	return data;
}

function ItemComponent({ results, item, idx }: { results: QuizAttempt[], item: Question, idx: number }) {
	const res = results[idx]
	const answer = item.options[res?.answer]
	const correctAnswer = item.options[item.answer]

  	const [text, setText] = useState("");
  	const [loading, setLoading] = useState(false);

  	const handleClick = async () => {
    	setText("");
    	setLoading(true);

		console.log("clicked")

    	const res = await axim("/api/ask-ai").post({
			text: item.text,
			options: item.options,
			answer: item.answer,
			imageDescription: item["image-description"],
			answerDescription: item["answer-description"],
			table: item.table
		}) 

		if (!res.body) {
			  setLoading(false);
			  return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			  const { done, value } = await reader.read();
			  if (done) break;
			  const chunk = decoder.decode(value);
			  setText((prev) => prev + chunk);
		}

		setText(prev => marked.parse(prev))
		setLoading(false);
  	};	

  	return (
		<div className={styles.innerWrapperMini}>
			<div className={styles.topperFlexLogos}>
				<p style={{
					color: res.isCorrect ? "var(--color-green-600)" : "var(--color-red-500)"
				}}>{item?.text}</p>

				{res.isCorrect ? 
					<CircleCheck style={{ color: "var(--color-green-600)" }} /> : 
					<CircleX style={{ color: "var(--color-red-600)" }} />
				}
			</div>

			{
				item.property.includes("image-question")
					&& 
				<img className={styles.imageQuiz} srcSet={item?.image} />
			}

			{
				item.property.includes("table")
					&&
				<div style={{ padding: "1rem" }}>
					<QuestionTable table={item.table} caption="table 7x7" />
				</div>
			}
			
			<div className={styles.resultAnswer}>
				<p>Jawaban Anda:</p>
				<RadioGroup disabled={true} defaultValue={answer}>
					{Object.entries(item.options).map(itx => {
						return <div key={itx[0]} className={
							(itx[1] === answer) ? 
								((itx[1] === correctAnswer) 
									? styles.resultAnswerRight : 
									styles.resultAnswerWrong) 
							: (itx[1] === correctAnswer ? styles.resultAnswerRight : styles.optionsItem )
						}>
							<RadioGroupItem id={"id-" + itx[0]} value={`${itx[1]}`} />
							<Label htmlFor={"id-" + itx[0]}>{
								item.property.includes("image-answer") ? 
									<img className={styles.imageAnswer} srcSet={itx[1]} /> : 
								itx[1]
							}</Label>
						</div>
					})}
				</RadioGroup>
			</div>

			<div>
				<Button 
				onClick={handleClick}
				disabled={loading}
				style={{ background: "#090909" }}><MessageSquare /> {loading ? "Berpikir" : "Penjelasan AI"}</Button>

				{ text.length > 0 &&
				<div className={styles.aiResult}>
					<p className={styles.aiResultTitle}>
						<BotMessageSquare /> Penjelasan
					</p>

					<div dangerouslySetInnerHTML={{ __html: text }}>
					</div>
				</div>
				}
			</div>
		</div>
		)
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

	const [results, setResults] = useState<QuizAttempt[]>([]);
	const [quiz, setQuiz] = useState<Question[]>([]);

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
					<h1 style={{ textAlign: "center" }}>Quiz Selesai!</h1>
					<div className={styles.scoreFlex}>
						<div className={styles.scoreTitle}>
							<h3>
								<CountUp 
								 from={0}
								 to={Math.round(correctCount/total * 100)}
								 duration={2}
								 direction="up"
								/>
								%
							</h3>
							<p>Skor</p>
						</div>
						<div className={styles.scoreTitle}>
							<h3>{correctCount}</h3>
							<p>Benar</p>
						</div>
						<div className={styles.scoreTitle}>
							<h3>{total}</h3>
							<p>Total</p>
						</div>
					</div>

					<div className={styles.scoreActionFlex}>
						<Button onClick={() => {
								const pt = pathname.split("/")
								pt.pop()
								pt.push("quiz")
								router.push(pt.join("/"));							
						}}>Ulangi Quiz</Button>
					</div>
				</div>

				<h2 className={styles["tx-1"]}>Review Jawaban</h2>
				{quiz.map((item, idx) => {
					return <ItemComponent results={results} item={item} idx={idx}/>
				})}

			</div>
		</div>
	)
}

