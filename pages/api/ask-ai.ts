import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
	res.writeHead(200, {
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
	});

	const { text, options, answer, imageDescription, answerDescription, table } = req.body;
	let pilihan = ""

	console.log(req.body)

	for (let item of Object.keys(options)) {
		pilihan += item + ". " + options[item] + "\n"
	}

	const prompt = ` Berikut adalah soal Computational thinking: ${text},
Berikut adalah pilihan ganda dari soal tadi: ${pilihan}

${table !== null ?
`
berikut adalah tabel dalam format json untuk soal diatas:
${JSON.stringify(table)}
` : ""}

${imageDescription ? `
Berikut adalah deskripsi gambar dari soal diatas:
${imageDescription}
` : ""}

${answerDescription ? `
Berikut adalah deskripsi gambar untuk jawaban:
${answerDescription}
` : ""}

dan berikut adalah jawaban yang benar: ${answer}. Bisakah anda memberikan penjelasan mengenai jawaban dan dari soal tersebut dalam bahasa indonesia.`

	const response = await fetch(process.env.OPENROUTER_URL, {
		method: "POST",
		headers: {
		  Authorization: `Bearer ${process.env.OPENROUTER_DEEPSEK_API_KEY}`,
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
		  messages: [
			  { role: "system", content: "penjelasan maksimal 10-15 kalimat" },
			  { role: "user", content: prompt }
		  ],
		  stream: true,
		}),
	  });



	if (!response.body) {
		console.log("LOG: something wrong")
		res.end();
		return;
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	try {
		console.log("LOG:", "enter try")
		while (true) {
		  const { done, value } = await reader.read();
		  if (done) break;

		  const chunk = decoder.decode(value, { stream: true });
		  const lines = chunk.split("\n");

		  if(Array.isArray(lines) && lines[0].includes("error")) {
			  res.status(400).end()
			  break;
		  }

		  for (const line of lines) {
			if (line.startsWith("data: ")) {
			  const data = line.slice(6);
			  if (data === "[DONE]") {
				res.write("\n\n");
				res.end();
				return;
			  }

			  try {
				const parsed = JSON.parse(data);
				const content = parsed.choices[0]?.delta?.content;
				if (content) {
				  res.write(`${content}`);
				}
			  } catch (err) {
			  }
			}
		  }
		}
	} catch(err) {
		console.log(err)
		res.end()
		reader.cancel()
	} finally {
		reader.cancel();
	}

}

