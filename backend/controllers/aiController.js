import axios from "axios";
import AIUsage from "../models/AIUsage.js";
import { isSameDay } from "../utils/isSameDay.js";
import { marked } from "marked";

const DAILY_LIMIT=5;

export const generateBlog=async (req, res) => {
  try {
    const userId=req.user._id;
    const { title }=req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    //fetch or create usage record
    let usage=await AIUsage.findOne({ user: userId });
    if (!usage) {
      usage=await AIUsage.create({
        user: userId,
        count: 0,
        lastUsed: new Date()
      });
    }
    const now = new Date();

    //Reset count if new day
    if (!isSameDay(usage.lastUsed, now)) {
      usage.count=0;
    }

    //Check limit
    if (usage.count >= DAILY_LIMIT) {
      return res.status(429).json({
        error: "Daily AI limit reached (5 per day)"
      });
    }

    const hfResponse=await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are a professional blog writer.
            Rules:
            - DO NOT repeat or restate the title
            - DO NOT write "Introduction", "Conclusion", or numbered subheadings
            - Write like a real human-written blog
            - Use natural section headings when needed (no labels like Subheading 1)
            - Keep the tone conversational and engaging
            - Output plain text or HTML-friendly content (no Markdown **)`
          },
          {
            role: "user",
            content: `Write a detailed blog post on: ${title}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // const content=hfResponse.data?.choices?.[0]?.message?.content;
    const rawText=hfResponse.data?.choices?.[0]?.message?.content || "";

    const content=marked.parse(rawText); // Markdown → HTML

    if (!content) {
      throw new Error("Empty AI response");
    }

    console.log("HF RAW RESPONSE:", hfResponse.data);

    //Update usage
    usage.count+=1;
    usage.lastUsed=now;
    await usage.save();

    res.json({content, remaining: DAILY_LIMIT - usage.count,});
  } 
  catch (err) {
    console.error("HF ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
};

export const getAIUsage=async (req, res) => {
  const userId=req.user._id;

  let usage=await AIUsage.findOne({ user: userId });

  if (!usage || !isSameDay(usage.lastUsed, new Date())) {
    return res.json({ remaining: DAILY_LIMIT });
  }

  res.json({ remaining: DAILY_LIMIT - usage.count });
};
