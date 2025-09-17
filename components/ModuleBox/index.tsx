import { Book, BookOpen, BookOpenCheck, CircleCheckBig, Pencil, PencilRuler } from "lucide-react";
import styles from "./ModuleBox.module.css";
import { ProgressStatus } from "@/generated/prisma";
import { Progress } from "../Progress";
import { useEffect, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/router";
import CountUp from "../CountUp";
import React from "react";

type Data = {
	id: number,
	title: string,
	synopsis: string,
	number: number,
	status: ProgressStatus,
}

function ProgresButton({ number, progres, ...props }) {
	const spaned = <span>Mulai</span>
	switch(progres) {
		case "NOT_OPENED":
			return (
				<Button {...props}>
					<Book />
					<span>Mulai Belajar</span>
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

export default function ModuleBox({ data, onClick, noAction = false, miniText = "" }: { 
	data?: Data,
	onClick?: () => void | any | never,
	noAction?: boolean,
	miniText?: string
}) {
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
		<div style={noAction ? {
			maxWidth: 100 + "%"
		} : {}} className={styles.boxRoot}>
			<div className={styles.topper}>
				<h2>{data.title.split(":")[1].trim()}</h2>
				{ !noAction && (data.status === "QUIZ_ATTEMPT" ? <CircleCheckBig /> : <PencilRuler />) }
				{ noAction && percentage <= 0 && <p className={styles.miniBadge}>Belum Mulai</p> }
				{ noAction && (percentage > 0 && percentage < 100) && <p className={styles.miniBadge}>Progress</p> }
				{ noAction && percentage >= 100 && <p className={styles.miniBadge}>Selesai</p> }
			</div>
			<div className={styles.desc}>
				{!noAction && <p>{data.synopsis}</p>}
			</div>

			<div className={styles.progress}>
				<div className={styles.progressId}>
					<p>Progress</p>
					<p>
					<CountUp 
					 from={0}
					 to={percentage}
					 direction="up"
					 duration={2}
					/> % 
					</p>
				</div>
				<Progress delay={200} value={percentage} />
				<p>{miniText}</p>
			</div>

			{!noAction && <ProgresButton
				number={data.id}
				progres={data.status} 
				onClick={handleClick}/>
			}
		</div>
	)
}
