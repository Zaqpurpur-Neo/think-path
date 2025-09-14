import Navbar from "@/components/Navbar";
import { BookOpen, Trophy, ArrowLeft, Award, AudioLines, ChartColumnIncreasing } from "lucide-react";
import { marked } from "marked";
import Head from "next/head";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";

import styles from "@/styles/Module.module.css"
import Button from "@/components/Button";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";
import { Bab, ProgressStatus } from "@/generated/prisma";
import { axim } from "@/lib/axim";
import { usePathname } from "next/navigation";

function markdownToText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#+\s/g, "")
    .replace(/>\s?/g, "")
    .replace(/^\s*[-*+]\s/gm, "")
    .replace(/^\s*\d+\.\s/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}


export default function ContentPage() {
	const { logout, loading } = useAuth();
	const userCtx = useUser()

	const router = useRouter()
	const { slug } = router.query;
	const postId = parseInt(slug?.slice(3, slug.length))
	const [content, setContent] = useState("");

	const [doneReading, setDoneReading] = useState(false)
	const [rawText, setRawText] = useState("")
	const [isReading, setIsReading] = useState(false)
	const [isQuizDone, setIsQuizDone] = useState(false)

	const [hang, setHang] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		if(slug !== undefined) {
			async function rb() {
				const res = await axim(`/api/content?module=${slug}`).post({
					userId: userCtx.user?.id,
					postId: postId,
				})
				const data: Bab & { status: ProgressStatus } = await res.json();
				const parsed: any = marked.parse(data.content);
				setContent(parsed);
				setRawText(markdownToText(data.content));

				if(data.status === "DONE_READING") {
					setDoneReading(true)
				} else if(data.status === "QUIZ_ATTEMPT") {
					setDoneReading(true)
					setIsQuizDone(true)
				} 
			}

			rb()
		}
	}, [slug])

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
	const speak = () => {
		const utterance = new SpeechSynthesisUtterance(rawText);
		utterance.lang = "id-ID";
		speechSynthesis.speak(utterance);
		setIsReading(true)
	};

	const stop = () => {
		setIsReading(false)
		speechSynthesis.cancel();
	};

	const handleReadDone = async (e) => {
		setDoneReading(true)
		setHang(true)

		const res = await axim("/api/update-progress").post({
			userId: userCtx.user?.id,
			postId: postId,
			status: "DONE_READING"
		} as { status: ProgressStatus})
		const _data = await res.json()

		setHang(false);
	}

	return (userCtx.loading && loading) ? "loading" : (
		<div className={styles.moduleRoot}>
			<Navbar 
				pages={pages} 
				user={userCtx.user}
				selectedPage={selectedPage}
				setSelectedPage={setSelectedPage}
				onLogout={logout}
			/>

			<div className={styles.contentWrapper}>
				<div onClick={() => {
					router.push("/dashboard");
				}} className={styles.topperBack}>
					<ArrowLeft /><span>Kembali</span>
				</div>
				<div className={styles.innerWrapper}>
					<div className={styles.topperFlex}>
						<div className={styles.topper}>
							<BookOpen /><span>Materi Pembelajaran</span>
						</div>

						<Button disabled={hang} onClick={isReading ? stop : speak} outline={!isReading}>
							<AudioLines />{isReading ? "Berhenti" : "Bacakan"}
						</Button>
					</div>
					<div className="markdown-body" dangerouslySetInnerHTML={{
						__html: content
					}} />

					<div className={styles.bottomWrapper}>
						<p className={styles.textLeft}>{doneReading ? "Materi telah dibaca" : "Selesaikan membaca untuk melanjutkan ke quiz"}</p>
						{!doneReading && <Button onClick={handleReadDone} outline={true}>Tandai Selesai Dibaca</Button>}
						{isQuizDone && <Button onClick={() => router.push(pathname+"/result")} outline={true}><ChartColumnIncreasing />Lihat Hasil</Button>}

						{ postId > 1 ?
							<Button onClick={() => {
								router.push(pathname + "/quiz")
							}} disabled={!doneReading}><Award />{isQuizDone ? "Ulangi" : "Mulai"} Quiz</Button> :
							<Button onClick={() => {
								router.push("/dashboard")
							}}><ArrowLeft />Kembali</Button>
						}
					</div>
				</div>


			</div>
		</div>
	)
}
