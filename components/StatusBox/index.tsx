import { Trophy } from "lucide-react";
import styles from "./StatusBox.module.css";
import CountUp from "../CountUp";
import { useEffect, useState } from "react";
import { Progress } from "../Progress";

export default function StatusBox({ 
		useProgress = true, title = "", icons: Icons = Trophy, 
		miniInfo = "", from = 0, to = 100, format = "percentage", maxValue = 100
}: { format: "percentage" | "slice", useProgress: boolean, title: string, icons: any, miniInfo: string, from: number, to: number, maxValue: number }) {

	const [percentage, setPercentage] = useState(0)
	useEffect(() => {
		setPercentage(Math.round(to/maxValue * 100))
	}, [,percentage]);

	return (
		<div className={styles.boxRoot}>
			<div className={styles.topper}>
				<h4>{title}</h4>
				<Icons />
			</div>
			<div className={styles.progress}>
				<div className={styles.progressId}>
					<h3>
					{format === "percentage" && 
						<><CountUp from={from} to={percentage} direction="up" duration={2}/>%</> }
					{format === "slice" && 
						<><CountUp from={from} to={to} direction="up" duration={2}/> / {maxValue}</> }
					</h3>
				</div>
				{useProgress && <Progress delay={200} value={percentage} />}
				<p className={styles.miniInfo}>{miniInfo}</p>
			</div>
		</div>
	)
}
