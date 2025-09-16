import { Lock, ScrollText } from "lucide-react";
import styles from "./TestBox.module.css";
import Button from "../Button";
import { useRouter } from "next/router";

export default function TestBox({
	isUnlock = false
}: {
	isUnlock: boolean
}) {
	const router = useRouter();

	return (
		<div className={styles.boxRoot}>
			<div className={styles.topper}>
				<h4>UAS Computational Thinking</h4>
				<ScrollText />
			</div>

			<Button 
				onClick={() => {
					router.push("/test-result")
				}}
				outline={!isUnlock} 
				disabled={!isUnlock}>
			{
				isUnlock ? 
				<>
					<CirclePlay />
					Kerjakan UAS 
				</> :
				<>
					<Lock />
					Selesaikan Semua Modul
				</>
			}
			</Button>
		</div>
	)
}

