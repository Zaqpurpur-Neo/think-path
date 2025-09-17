import { BookOpenCheck, ChartColumnIncreasing, CirclePlay, Lock, ScrollText } from "lucide-react";
import styles from "./TestBox.module.css";
import Button from "../Button";
import { useRouter } from "next/router";

export default function TestBox({
	isUnlock = false,
	isDone = false,
	onClick = () => {}
}: {
	isUnlock: boolean
}) {
	const router = useRouter();

	const handleTransition = (route) => {
		setTimeout(() => {
			router.push(route)
		}, 600)
	}

	return (
		<div className={styles.boxRoot}>
			<div className={styles.topper}>
				<h4>UAS Computational Thinking</h4>
				<ScrollText />
			</div>

			{!isDone ? (
			<Button 
				onClick={() => {
					if(isUnlock) {
						onClick()
						handleTransition("/test") 
					}
				}}
				outline={!isUnlock} 
				disabled={!isUnlock}>
			{!isDone && (
				isUnlock ? 
				<>
					<CirclePlay />
					Kerjakan UAS 
				</> :
				<>
					<Lock />
					Selesaikan Semua Modul
				</>
			)}
			</Button>
			) : (
			<div className={styles.flex}>
				<Button outline={true} onClick={() => {
					onClick()
					handleTransition("/test-result")
				}}>
					<ChartColumnIncreasing />
					Lihat Hasil
				</Button>

				<Button onClick={() => {
					onClick()
					handleTransition("/test")
				}}>
					<BookOpenCheck />
					Ulangi UAS
				</Button>
			</div>
			)}
		</div>
	)
}

