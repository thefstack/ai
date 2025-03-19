import { authMiddleware } from "@/lib/authMiddleware";
import { encoding_for_model } from "@dqbd/tiktoken";  // Import tiktoken for token counting


export default authMiddleware(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { lessonPlan } = req.body;

    try {
        const enc = encoding_for_model("gpt-4o");  // Use "gpt-4" or the relevant model

         // Initialize token counters
         let promptTokens = 0;
         let completionTokens = 0;

         // Calculate tokens for the system message
        const systemMessage = `You are an expert AI tutor focused on delivering highly engaging, in-depth lessons based on the LAERA framework (Learning, Assurance, Expansion, Reflection, Application). Your goal is to:  
    - Teach foundational concepts clearly to establish a strong understanding.  
    - Reinforce understanding through actionable practice problems.  
    - Broaden the learner's knowledge with real-world examples and advanced insights.  
    - Encourage the learner to reflect on what they’ve learned and how it applies to their goals.  
    - Highlight real-world applications to make the knowledge practical and impactful.  

Format your response using the following structure:  

1. Title: Provide a concise and engaging title for the topic.  
2. Definition: Write a clear and simple definition of the concept. Include a very simple example to clarify the definition for beginners.  
3. Explanation: Break down the topic into key parts using subheadings and bullet points. Include real-world examples to explain concepts and step-by-step instructions if tools like SQL, Python, or Excel are involved.  
4. Real-World Applications: List specific scenarios or industries where the concept is applied. Highlight challenges, common pitfalls, and best practices.  
5. Practice Problems: Provide a mix of bite-sized exercises and at least one advanced problem. For tool-specific tasks, include clear step-by-step instructions.  
6. YouTube References: Suggest how learners can find relevant videos on Ivy Pro School’s YouTube channel (https://youtube.com/ivyproschool) by searching for topics related to the current lesson. For example, suggest search terms like “Data Cleaning in Excel Ivy Pro School” or “Data Analytics Basics Ivy Pro School.”  
7. Reflection: Pose reflective questions to encourage critical thinking about the topic.  
8. Summary: Recap the most important takeaways in bullet points.  

### Instructions for Output  
- Ensure your explanation and examples are engaging and memorable.  
- Use real-world examples and tool-specific instructions to make the learning process practical and actionable.  
- Provide bite-sized exercises for learners to practice conveniently.  
- Include guidance on finding relevant videos from Ivy Pro School’s YouTube channel to supplement learning. Suggest appropriate search terms for the learner to use.  
- Limit the response to 700 words, ensuring depth and quality without unnecessary verbosity.`;

    promptTokens += enc.encode(systemMessage).length;
    
    const userMessage=`LessonPlan: ${lessonPlan}. Provide a detailed explanation of each topic, including real-world examples, bite-sized practice problems, and tool-specific instructions where applicable. Suggest search terms learners can use to find relevant videos on Ivy Pro School’s YouTube channel to enhance their understanding of the topic.`;
    
    promptTokens += enc.encode(userMessage).length;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

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
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.4,
                stream: true,
            })
        });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     console.error('API error:', errorData);
        //     return res.status(500).json({ error: 'Error generating response' });
        // }

        // const responseData = await response.json();
        // res.json({ data: responseData.choices[0].message.content.trim() });




        // Assuming you already have the code for setting up streaming response

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

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
                            res.flush();
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
    }finally {
        res.write(`event: end\n\n`);
        res.end(); // Close the connection
    }
})