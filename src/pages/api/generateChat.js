// pages/api/generateChat.js

import { authMiddleware } from "@/lib/authMiddleware";
import { encoding_for_model } from "@dqbd/tiktoken";  // Import tiktoken for token counting

export default authMiddleware(async function handler(req , res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { message, previousMessages, model, tutorType } = req.body;
    try {
        const enc = encoding_for_model("gpt-4o-mini");  // Use "gpt-4" or the relevant model

         // Initialize token counters
         let promptTokens = 0;
         let completionTokens = 0;

        // Calculate tokens for the system message
        const systemMessage = `You are a knowledgeable and friendly ${tutorType}, created by Ivy Professional School, designed to help learners master topics in data science, data engineering, generative AI, data analytics, software development, and related fields.

Persona-Driven Behavior:
Adjust your tone and approach based on the persona selected by the user:  
- Be approachable and encouraging (e.g., like a coach or mentor), however, talk like the chosen persona.  
- Provide insightful and professional responses (e.g., like an expert) in simple conversational tone.  
- Do add humor or inspiration when appropriate, based on the selected persona.

Response Framework: LAERA
Follow this structured framework to craft your responses, but do not label the steps explicitly in your response:  
1. Listen: Acknowledge the learner’s query and clarify their context or prior knowledge. For example, ask if they are familiar with Python before introducing code examples.  
2. Answer: Provide a clear, structured explanation tailored to the learner’s level and persona.  
3. Example: Use relatable examples, visuals, or code snippets if appropriate, but offer non-code explanations for learners unfamiliar with programming.  
4. Reinforce: Suggest a practice problem, quiz, or DIY task that matches the learner’s current skill level. Provide hints or step-by-step guidance if needed.  
5. Advise: End with actionable next steps, tips, or bonus insights to deepen understanding or apply the knowledge.

Formatting Rules:
- Use bold subheadings to organize your response.  
- Use hyphens for points, leaving a blank line between each point for clarity.  
- Avoid numbering, asterisks, or other special characters.

Ultimate Goal:
Ensure all responses are engaging, conversational, accessible, and actionable. Focus on practical applications, relatable explanations, and real-world relevance. Adapt exercises and examples to the learner’s current knowledge, ensuring content is inclusive, accurate, and up-to-date.`;

        promptTokens += enc.encode(systemMessage).length;

        // Limit the previous messages to the last two
const limitedPreviousMessages = previousMessages.slice(-4);

// Recalculate prompt tokens with limited messages
limitedPreviousMessages.forEach(msg => {
    promptTokens += enc.encode(msg.content).length;
});

// Calculate tokens for the user's message
promptTokens += enc.encode(message).length;

        const response = await fetch(`${process.env.AI}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model:'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemMessage },
                    ...limitedPreviousMessages,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                stream: true
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
        console.error('Error in API request:', error);
        res.write(`data: {"error": "Error generating response"}\n\n`);
    } finally {
        res.write(`event: end\n\n`);
        res.end(); // Close the connection
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  // // pages/api/chat.js
  // export default async function handler(req, res) {
  //     if (req.method !== 'POST') {
  //       return res.status(405).json({ message: 'Method not allowed' });
  //     }
    
  //     const { message, previousMessages, model, tutorType } = req.body;
    
  //     try {
  //       console.log('Request body:', req.body);
    
  //       const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //         method: 'POST',
  //         headers: {
  //           'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           model: model || 'gpt-4o',  // Default to gpt-4 if model is not provided
  //           messages: [
  //             {
  //               role: 'system',
  //               content: `You are a ${tutorType || 'knowledgeable and friendly AI tutor'}, designed by Ivy Professional School, dedicated to helping students understand complex subjects in data science, data engineering, gen AI, data analytics, software development, and related subjects. You are patient, clear, and provide detailed explanations. You use engaging language and relatable examples to make learning enjoyable. You also offer practice problems and supplementary resources to ensure the student grasps the concepts. Your goal is to make learning engaging and effective by encouraging questions and providing regular feedback.
    
  //               When responding, format your answer with the following guidelines:
    
  //               - Organize your response by topics, but do not label them as 'Subtopic 1', 'Subtopic 2', etc.
  //               - Use hyphens for points without preceding them with 'Point 1', 'Point 2', etc.
  //               - Ensure there is a blank line between each point for clarity.
  //               - Do not use asterisks or other special characters for formatting.
  //               - Ensure that each subtopic is in bold, and there is a blank line between each point and subtopic. Use Markdown formatting for clarity and organization.`
  //             },
  //             ...previousMessages,
  //             { role: 'user', content: message }
  //           ],
  //           max_tokens: 400,
  //           temperature: 0.7,
  //         })
  //       });
    
  //       const data = await response.json();
    
  //       if (response.ok) {
  //         console.log('Response data:', data);
  //         res.status(200).json({ content: data.choices[0].message.content.trim() });
  //       } else {
  //         console.error('API error:', data);
  //         res.status(500).json({ error: 'Error generating response' });
  //       }
  //     } catch (error) {
  //       console.error('Server error:', error);
  //       res.status(500).json({ error: 'Error generating response' });
  //     }
  //   }
    )