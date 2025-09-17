// pages/module/[slug]/result.tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/context/UserContext";

import styles from "@/styles/Result.module.css";
import {
  ArrowLeft,
  BookOpen,
  BotMessageSquare,
  CircleCheck,
  CircleX,
  MessageSquare,
  Trophy,
  Send,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { axim } from "@/lib/axim";
import { Question } from "@/types";
import { QuizAttempt } from "@/node_modules/generated/prisma";
import { QuestionTable } from "@/components/QuestionTable";
import { RadioGroup, RadioGroupItem } from "@/components/Radio";
import { Label } from "@/components/Label";
import CountUp from "@/components/CountUp";
import Button from "@/components/Button";
import { marked } from "marked";

async function loadQuiz(slug: string) {
  const res = await axim(`/api/load-quiz?quiz=${slug}`).get();
  const data = await res.json();
  return data;
}

type Role = "system" | "user" | "assistant";
type Message = { role: Role; content: string };
type ChatMsg = { role: Role; content: string; isHtml?: boolean };

/* =========================================================
   UTIL: Bangun konteks kuis (markdown) agar chatbot paham
   ========================================================= */
function toLetter(idx: number) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[idx] ?? String(idx + 1);
}

function formatKeyAsLetter(
  optionEntries: [string, string][],
  key: string | number | undefined
): string {
  if (key === undefined || key === null) return "?";
  const keyStr = String(key);
  if (/^[A-Za-z]$/.test(keyStr)) return keyStr.toUpperCase();
  const idx = optionEntries.findIndex(([k]) => String(k) === keyStr);
  return idx >= 0 ? toLetter(idx) : keyStr.toUpperCase();
}

function buildQuizContextMarkdown(quiz: Question[], results: QuizAttempt[]) {
  const lines: string[] = [];
  lines.push("### KONTEKS KUIS");
  lines.push(
    "Gunakan daftar berikut saat pengguna merujuk ke \"no X\". Nomor mengikuti urutan pertanyaan di bawah."
  );
  lines.push("");

  quiz.forEach((q, i) => {
    const n = i + 1;
    const optionEntries = Object.entries(q.options || {});
    const correctKey = q.answer as any;
    const correctLetter = formatKeyAsLetter(optionEntries, correctKey);
    const correctText = (q.options as any)?.[correctKey];

    const userAnsKey = results?.[i]?.answer as any;
    const userLetter = formatKeyAsLetter(optionEntries, userAnsKey);
    const userText = (q.options as any)?.[userAnsKey];

    lines.push(`#### ${n}. ${q.text ?? "(tanpa teks)"}`);
    if (q.property?.includes("image-question")) {
      lines.push("- (Pertanyaan berisi gambar)");
    }
    if (q.property?.includes("table")) {
      lines.push("- (Pertanyaan berisi tabel)");
    }

    optionEntries.forEach(([, v], idx) => {
      lines.push(`- ${toLetter(idx)}. ${v}`);
    });

    lines.push(
      `- **Jawaban benar:** ${correctLetter}${correctText ? ` (${correctText})` : ""}`
    );
    if (userAnsKey !== undefined) {
      lines.push(
        `- **Jawaban Anda:** ${userLetter}${userText ? ` (${userText})` : ""}`
      );
      if (results?.[i]?.isCorrect === false) lines.push(`- **Status:** Jawaban Anda salah`);
      else if (results?.[i]?.isCorrect === true) lines.push(`- **Status:** Jawaban Anda benar`);
    }

    const expl =
      (q as any)["answer-description"] ||
      (q as any)["explanation"] ||
      undefined;
    if (expl) lines.push(`- **Catatan/penjelasan:** ${expl}`);

    lines.push("");
  });

  return lines.join("\n");
}

/* =========================
   ChatPanel — DeepSeek Chat
   ========================= */
function ChatPanel({
  quizTitle,
  scorePct,
  correct,
  total,
  quiz,
  results,
}: {
  quizTitle?: string;
  scorePct: number;
  correct: number;
  total: number;
  quiz: Question[];
  results: QuizAttempt[];
}) {
  const [contextMd, setContextMd] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "Kamu adalah asisten belajar Computational Thinking. Jawab ringkas, terstruktur (poin-poin), rujuk nomor soal dengan jelas, dan sertakan contoh/latihan singkat bila relevan.",
    },
  ]);
  const [chat, setChat] = useState<ChatMsg[]>([]); // UI messages; assistant akan di-render pakai marked.parse
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quiz || quiz.length === 0) return;
    setContextMd(buildQuizContextMarkdown(quiz, results || []));
  }, [quiz, results]);

  useEffect(() => {
    if (!contextMd) return;
    setMessages((prev) => {
      const already = prev.some((m) => m.role === "system" && m.content.startsWith("### KONTEKS KUIS"));
      if (already) return prev;
      return [
        ...prev,
        {
          role: "system",
          content:
            `Skor pengguna: ${scorePct}% (${correct}/${total}).\n` +
            `Gunakan konteks berikut untuk rujukan nomor soal.\n\n` +
            contextMd,
        },
      ];
    });
  }, [contextMd, scorePct, correct, total]);

  const pushUser = (content: string) =>
    setChat((prev) => [...prev, { role: "user", content }]);

  const pushAssistantText = (content: string) =>
    setChat((prev) => [...prev, { role: "assistant", content }]);

  const pushAssistantMarkdown = (md: string) => {
    const html = marked.parse(md || "");
    setChat((prev) => [...prev, { role: "assistant", content: html as string, isHtml: true }]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user" as Role, content: input.trim() };
    const newMessages = [...messages, userMsg];

    // tampilkan di UI
    pushUser(userMsg.content);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        let detail = "";
        try {
          const text = await resp.text();
          try {
            const j = JSON.parse(text);
            detail = typeof (j as any).detail === "string" ? (j as any).detail : JSON.stringify(j);
          } catch {
            detail = text;
          }
        } catch {}
        pushAssistantText(
          `⚠️ Terjadi error saat menghubungi model.\n\n**Status:** ${resp.status}\n**Detail:** ${detail || "(kosong)"}`
        );
        return;
      }

      const data = await resp.json();
      const assistant = data?.content || "(tidak ada respons)";

      // === Inilah bagian yang kamu minta: render rapi pakai marked.parse ===
      pushAssistantMarkdown(assistant);
      // ================================================================

      // sinkronkan state 'messages' (untuk percakapan berikutnya)
      setMessages(newMessages.concat([{ role: "assistant", content: assistant }]));
    } catch (err: any) {
      pushAssistantText(`⚠️ Gagal memanggil /api/chat.\n\n**Error:** ${String(err?.message || err)}`);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  };

  return (
    <div className={styles.chatPanel}>
      <h2 className={styles.chatTitle}>
        <BotMessageSquare style={{ marginRight: 8 }} /> Tanya AI tentang Quiz/CT
      </h2>

      <div ref={listRef} className={styles.chatList}>
        {chat.map((m, idx) => (
          <div
            key={idx}
            className={
              m.role === "user"
                ? `${styles.bubble} ${styles.bubbleUser}`
                : `${styles.bubble} ${styles.bubbleAssistant}`
            }
          >
            <div className={styles.bubbleMeta}>{m.role === "user" ? "You" : "Assistant"}</div>
            <div className={styles.bubbleText}>
              {m.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: m.content }} />
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className={`${styles.bubble} ${styles.bubbleAssistant} ${styles.pulse}`}>
            <div className={styles.bubbleMeta}>Ibu guru</div>
            <div className={styles.bubbleText}>…sedang berpikir</div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className={styles.chatForm}>
        <input
          className={styles.chatInput}
          placeholder='Contoh: "Kenapa no 1 jawabannya C?"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading} className={styles.chatSendBtn} title="Kirim">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function ItemComponent({
  results,
  item,
  idx,
}: {
  results: QuizAttempt[];
  item: Question;
  idx: number;
}) {
  const res = results[idx];
  const answer = item.options[res?.answer];
  const correctAnswer = item.options[item.answer];

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setText("");
    setLoading(true);

    const resp = await axim("/api/ask-ai").post({
      text: item.text,
      options: item.options,
      answer: item.answer,
      imageDescription: (item as any)["image-description"],
      answerDescription: (item as any)["answer-description"],
      table: (item as any).table,
    });

    if (!resp.body) {
      setLoading(false);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

	let arg = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
	  arg += chunk;
      setText((prev) => prev + chunk);
    }

	const done = await marked.parse(arg);

    // Sudah rapi pakai marked.parse setelah selesai stream
    setText(done);
    setLoading(false);
  };

  return (
    <div className={styles.innerWrapperMini}>
      <div className={styles.topperFlexLogos}>
        <p
          style={{
            color: res.isCorrect ? "var(--color-green-600)" : "var(--color-red-500)",
          }}
        >
          {item?.text}
        </p>

        {res.isCorrect ? (
          <CircleCheck style={{ color: "var(--color-green-600)" }} />
        ) : (
          <CircleX style={{ color: "var(--color-red-600)" }} />
        )}
      </div>

      {item.property.includes("image-question") && (
        <img className={styles.imageQuiz} srcSet={item?.image} />
      )}

      {item.property.includes("table") && (
        <div style={{ padding: "1rem" }}>
          <QuestionTable table={(item as any).table} caption="table 7x7" />
        </div>
      )}

      <div className={styles.resultAnswer}>
        <p>Jawaban Anda:</p>
        <RadioGroup disabled={true} defaultValue={answer}>
          {Object.entries(item.options).map((itx) => {
            return (
              <div
                key={itx[0]}
                className={
                  itx[1] === answer
                    ? itx[1] === correctAnswer
                      ? styles.resultAnswerRight
                      : styles.resultAnswerWrong
                    : itx[1] === correctAnswer
                    ? styles.resultAnswerRight
                    : styles.optionsItem
                }
              >
                <RadioGroupItem id={"id-" + itx[0]} value={`${itx[1]}`} />
                <Label htmlFor={"id-" + itx[0]}>
                  {item.property.includes("image-answer") ? (
                    <img className={styles.imageAnswer} srcSet={itx[1]} />
                  ) : (
                    itx[1]
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      <div>
        <Button onClick={handleClick} disabled={loading} style={{ background: "#090909" }}>
          <MessageSquare /> {loading ? "Berpikir" : "Penjelasan AI"}
        </Button>

        {text.length > 0 && (
          <div className={styles.aiResult}>
            <p className={styles.aiResultTitle}>
              <BotMessageSquare /> Penjelasan
            </p>

            <div dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { slug } = router.query as { slug?: string };
  const { logout, loading } = useAuth();
  const userCtx = useUser();

  const pages: any[] = [
    { route: "dashboard", icon: BookOpen },
    { route: "progress", icon: Trophy },
  ];
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const [results, setResults] = useState<QuizAttempt[]>([]);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(`quizResult_${slug}`);
    if (stored) setResults(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (slug !== undefined) {
      async function rb() {
        const result = await loadQuiz(slug);
        setQuiz(result.content.questions);
        setQuizTitle(result?.content?.title || slug);
      }
      rb();
    }
  }, [slug]);

  const correctCount = results.filter((r) => r.isCorrect).length;
  const total = results.length;
  const scorePct = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  return userCtx.loading && loading ? (
    "loading"
  ) : (
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
          <div
            onClick={() => {
              const pt = pathname.split("/");
              pt.pop();
              router.push(pt.join("/"));
            }}
            className={styles.topperBack}
          >
            <ArrowLeft />
            <span>Kembali ke materi</span>
          </div>
        </div>

        <div className={styles.innerWrapper}>
          <h1 style={{ textAlign: "center" }}>Quiz Selesai!</h1>
          <div className={styles.scoreFlex}>
            <div className={styles.scoreTitle}>
              <h3>
                <CountUp from={0} to={scorePct} duration={2} direction="up" />%
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
            <Button
              onClick={() => {
                const pt = pathname.split("/");
                pt.pop();
                pt.push("quiz");
                router.push(pt.join("/"));
              }}
            >
              Ulangi Quiz
            </Button>
          </div>
        </div>

        <h2 className={styles["tx-1"]}>Review Jawaban</h2>
        {quiz.map((item, idx) => {
          return <ItemComponent key={idx} results={results} item={item} idx={idx} />;
        })}

        {/* Chatbot dengan konteks kuis + output markdown rapi */}
        <ChatPanel
          quizTitle={quizTitle}
          scorePct={scorePct}
          correct={correctCount}
          total={total}
          quiz={quiz}
          results={results}
        />
      </div>
    </div>
  );
}
