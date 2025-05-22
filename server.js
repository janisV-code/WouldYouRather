const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Kalpo HTML/CSS/JS no public mapes

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/question", async (req, res) => {
  const { theme } = req.body;

  if (!theme) {
    return res.status(400).json({ error: "Tēma nav norādīta." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Tu ģenerē tikai 'Vai tu labāk' tipa jautājumus latviešu valodā. Atbildi tikai ar vienu jautājumu šādā formātā: 'Vai tu labāk ... vai ...?'. Nekādu komentāru vai paskaidrojumu.",
        },
        {
          role: "user",
          content: `Lūdzu, izveido vienu 'Vai tu labāk' jautājumu par tēmu: ${theme}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 60,
    });

    const choice = completion.choices && completion.choices[0];
    const message = choice && choice.message && choice.message.content;

    if (!message) {
      return res.status(500).json({ error: "OpenAI neatgrieza derīgu jautājumu." });
    }

    const question = message.trim();
    res.json({ question });
  } catch (error) {
    console.error("Kļūda:", error);
    res.status(500).json({ error: "Neizdevās iegūt jautājumu no OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Serveris darbojas: http://localhost:${port}`);
});