import { Book, BookOpen, BookOpenCheck, CircleCheckBig, Pencil, PencilRuler } from "lucide-react";
import styles from "./ModuleBox.module.css";
import { ProgressStatus } from "@/generated/prisma";
import { Progress } from "../Progress";
import { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/router";

type Data = {
	id: number,
	title: string,
	synopsis: string,
	number: number,
	status: ProgressStatus,
}

function ProgresButton({ number, progres, ...props }) {
	switch(progres) {
		case "NOT_OPENED":
			return (
				<Button {...props}>
					<Book />
					Mulai Belajar
				</Button>
			);
		case "OPENED":
			return (
				<Button {...props}>
					<BookOpen />
					Lanjutkan
				</Button>
			);
		case "DONE_READING":
			return number > 1 ? (
					<Button {...props}>
						<Pencil />
						Kerjakan Quiz
					</Button>
					) : (
					<Button outline={true} {...props}>
						<BookOpenCheck />
						Ulangi Module
					</Button>
					)
		case "QUIZ_ATTEMPT":
			return (
				<Button outline={true} {...props}>
					<BookOpenCheck />
					Ulangi Module
				</Button>

			);
	}
}

export default function ModuleBox({ data, onClick }: { data: Data }) {
	let arg: ProgressStatus[] = [] 
	if(data.id > 1) arg = ["NOT_OPENED", "OPENED", "DONE_READING", "QUIZ_ATTEMPT"];
	else arg = ["NOT_OPENED", "OPENED", "DONE_READING"];

	const router = useRouter();
	
	const [percentage, setPercantage] = useState(0);
	useEffect(() => {
		const idx = arg.indexOf(data.status);
		const len = arg.length - 1;

		setPercantage(Math.round(idx/len * 100))
	}, []);

	const handleClick = e => {
		onClick()
		setTimeout(() => router.push(`/module/bab${data.number}`), 1000)
	}

	return (
		<div className={styles.boxRoot}>
			<div className={styles.topper}>
				<h2>{data.title.split(":")[1].trim()}</h2>
				{ data.status === "QUIZ_ATTEMPT" ? <CircleCheckBig /> : <PencilRuler /> }
			</div>
			<div className={styles.desc}>
				<p>{data.synopsis}</p>
			</div>

			<div className={styles.progress}>
				<div className={styles.progressId}>
					<p>Progress</p>
					<p>{percentage}%</p>
				</div>
				<Progress delay={200} value={percentage} />
			</div>

			<ProgresButton
				number={data.id}
				progres={data.status} 
				onClick={handleClick}/>
		</div>
	)
}
