import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import useAuth from "@/hooks/useAuth";
import styles from "@/styles/Test.module.css"
import { ArrowLeft, BookOpen, CircleQuestionMark, Trophy } from "lucide-react";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useReducer, useState } from "react";
import { loadModule } from "./dashboard";
import { Bab, ProgressStatus } from "@/generated/prisma";
import { usePathname } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { Label } from "@radix-ui/react-label";
import { axim } from "@/lib/axim";
import { Question } from "@/types";
import Button from "@/components/Button";

function answersReducer(state, action) {
	if (state[action.id] === action.value) return state // no change → no re-render 
	return { ...state, [action.id]: action.value }
}

const BoxQuestion = memo(function BoxQuestion({ item, onAnswer, initial }) {
	// value={answer} onValueChange={(value) => onAnswer(value, item.id)
	console.log("rendering q", item.id)
	const [answer, setAnswer] = useState(initial ?? "");
	const handleChange = (value) => {
		setAnswer(value)
		onAnswer(item.id, value)
	}

	return <div className={styles.innerWrapper}>
		<div className={styles.top}>
			<CircleQuestionMark />
			Pertanyaan Ke {item.id}
		</div>

		<p className={styles.question}>
			{item.text}
		</p>

		<div className={styles.options}>
			<RadioGroup value={answer} onValueChange={handleChange}>
				{Object.entries(item.options).map(([key, val]) => {
					const optionId = `q${item.id}-opt${key}`
					return <div key={key} className={styles.optionsItem}>
						<RadioGroupItem id={optionId} value={`${key}`} />
						<Label htmlFor={optionId}>{val}</Label>
					</div>
				})}
			</RadioGroup>
		</div>
	</div>
})

export default function Test({}) {
	const { logout, loading } = useAuth();
	const userCtx = useUser()
	const pathname = usePathname()

	const router = useRouter()
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
	const [modules, setModules] = useState<{ result: Bab[] } | null>(null)
	const [moduleTotal, setModuleTotal] = useState(1);
	const [moduleDone, setModuleDone] = useState(1);
	const [tests, setTests] = useState<Question[]>([]);

	useEffect(() => {
		async function rb() {
			const data = await loadModule(userCtx)
			setModules(data)
		}
		rb()
	}, [userCtx.loading])
	
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
		if(modules?.result !== undefined) {
			setModuleTotal(modules.result.length);
		}
	}, [modules?.result])

	useEffect(() => {
		if(modules?.result !== undefined) {
			const res = countModuleDone(modules.result)
			setModuleDone(res)
			
			if(res < moduleTotal) {
				router.push("/dashboard")
			}
		}
	}, [moduleTotal])

	useEffect(() => {
		async function rb() {
			const res = await axim(`/api/load-test`).get()
			const data = await res.json() as { content: { questions: Question[] } }

			setTests(data.content.questions)
		}
		rb()
	}, [])

	const initialAnswers = Object.fromEntries(
		tests.map(q => [q.id, null])
	);
 	const [answers, dispatch] = useReducer(answersReducer, initialAnswers)

  	const handleAnswer = useCallback((id, value) => {
		dispatch({ id, value })
	}, [])
	
	return (userCtx.loading && loading) ? "loading" : (
		<div className={styles.testRoot}>
			<Navbar
				pages={pages} 
				user={userCtx.user}
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
			/>

		{ loading ? "" :
			<div className={styles.contentWrapper}>
				<div onClick={() => {
					router.push("/dashboard");
				}} className={styles.topperBack}>
					<ArrowLeft /><span>Kembali ke dashboard</span>
				</div>

				{tests.length > 0 && tests.map((item, idx) => {
					return <BoxQuestion
						key={item.id}
						item={item}
						onAnswer={handleAnswer}
					/>
				})}
				<div>

				{JSON.stringify(answers)}
				{(Object.values(answers).includes(null)) ? 
					<Button disabled={true}>Selesai</Button> :
					<Button onClick={() => console.log(answers)} >Selesai</Button>
				}
				</div>
			</div>
		}		
		</div>
	)
}
