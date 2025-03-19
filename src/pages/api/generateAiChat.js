import { authMiddleware } from "@/lib/authMiddleware";
import { encoding_for_model } from "@dqbd/tiktoken";  // Import tiktoken for token counting

export default authMiddleware(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, previousMessages, lessonPlan, model, tutorType } = req.body;

    try {
        const enc = encoding_for_model("gpt-4o-mini");  // Use "gpt-4" or the relevant model

        // Initialize token counters
        let promptTokens = 0;
        let completionTokens = 0;

       // Calculate tokens for the system message
       const systemMessage = `You are a ${tutorType || 'knowledgeable and friendly AI tutor'}, designed by Ivy Professional School, dedicated to helping students. You must strictly focus on the lesson plan provided below and should not answer any question or respond to topics outside this lesson plan: Lesson Plan: ${JSON.stringify(lessonPlan)}.
        If a question or topic is outside this scope, respond with: "I'm sorry, I can only assist with questions related to the current lesson plan.
       `;

       promptTokens += enc.encode(systemMessage).length;

       // Limit the previous messages to the last two
const limitedPreviousMessages = previousMessages.slice(-2);

// Recalculate prompt tokens with limited messages
limitedPreviousMessages.forEach(msg => {
   promptTokens += enc.encode(msg.content).length;
});

// Calculate tokens for the user's message
const userMessage=`${message}`
promptTokens += enc.encode(userMessage).length;

        const response = await fetch(`${process.env.AI}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: systemMessage
                    },
                    ...limitedPreviousMessages,
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.4,
                stream: true,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error:', errorData);
            return res.status(500).json({ error: 'Error generating response' });
        }

        // Stream response setup
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Stream the response to the client in chunks
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = decoder.decode(value, { stream: true });
            const lines = textChunk.split('\n');

            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    let jsonString = line.replace(/^data: /, '');

                    // Skip lines like [DONE]
                    if (jsonString === '[DONE]') {
                        return;
                    }

                    try {
                        const messageData = JSON.parse(jsonString);
                        if (messageData.choices) {
                            const content = messageData.choices[0].delta.content || '';
                            completionTokens += enc.encode(content).length;  // Add tokens for streamed content
                            res.write(`data: ${JSON.stringify({ content })}\n\n`);
                            res.flush(); // Force data to be sent immediately
                        }
                    } catch (error) {
                        console.error('Stream parsing error:', error);
                    }
                }
            });
        }
        // Calculate total tokens used
        const totalTokens = promptTokens + completionTokens;

        // Send final token usage information
        res.write(`data: ${JSON.stringify({ 
            usage: {
                prompt_tokens: promptTokens,
                completion_tokens: completionTokens,
                total_tokens: totalTokens 
            }
        })}\n\n`);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
    finally {
        res.write(`event: end\n\n`);
        res.end(); // Close the connection
    }
}
)