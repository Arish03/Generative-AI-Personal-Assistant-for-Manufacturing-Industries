import { Router } from "express";
import { AzureOpenAI } from "openai";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

        if (!endpoint || !apiKey || !deployment) {
            console.warn("Azure OpenAI credentials not fully configured.");
            return res.status(200).json({
                content:
                    "Azure OpenAI is not fully configured. Please check your .env.local file.\n\n*This is a fallback response.*",
            });
        }

        const systemPrompt = `You are G.A.P (Generative AI Personal Assistant), an advanced AI specialized in manufacturing, ERP, and MES systems. 
You help factory managers, engineers, and operators analyze production data, troubleshoot machine issues, and optimize workflows.
Always be concise, professional, and provide actionable insights. Format your responses using markdown where appropriate (lists, bold text, code blocks for data).`;

        console.log(`🤖 [Azure OpenAI] Initializing client for deployment: ${deployment}`);
        const client = new AzureOpenAI({
            endpoint,
            apiKey,
            apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
            deployment,
        });

        console.log(`🤖 [Azure OpenAI] Sending message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
        const startTime = Date.now();

        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
            ],
            model: deployment,
        });

        const duration = Date.now() - startTime;
        console.log(`✅ [Azure OpenAI] Response received in ${duration}ms`);
        console.log(`📊 [Azure OpenAI] Tokens used - Prompt: ${result.usage?.prompt_tokens}, Completion: ${result.usage?.completion_tokens}, Total: ${result.usage?.total_tokens}`);

        res.json({ content: result.choices[0].message.content });
    } catch (error: any) {
        console.error("❌ [Azure OpenAI] API Error Details:");
        console.error(error?.response?.data || error);
        res.status(500).json({ error: "Failed to process chat request" });
    }
});

export default router;
