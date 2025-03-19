import { authMiddleware } from "@/lib/authMiddleware";

export default authMiddleware(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { selectedTopics, question, userAnswers } = req.body;
  // console.log("generate quiz summary", selectedTopics);

  if (!selectedTopics || selectedTopics.length === 0) {
    return res.status(400).json({ error: 'No topics selected' });
  }

  try {
    // Create a prompt based on the selected topics
    const prompt = `
Generate a detailed summary review for the entire quiz on the topics: ${selectedTopics.join(', ')}. 
quiz questions and options are :- ${JSON.stringify(question)}
user answers is:- ${userAnswers}
Instructions:
Evaluate the student's performance by comparing their answers to the correct answers for the quiz.

Highlight the following:

  Summarize the student's overall understanding and proficiency in the quiz topic dont use any heading for this.

- **Strengths**: 
  .Identify key areas where the student performed well, emphasizing their grasp of the concepts and any correct answers. 
  .Provide positive reinforcement for their strong performance.

- **Weaknesses**:
  .Provide a general overview of areas where the student struggled or made errors. 
  .Instead of going question by question, identify common patterns or topics where their understanding needs improvement.
  . Provide a brief explanation of why these areas are challenging and how the correct concepts work.

- **Suggestions for Improvement**:
  Offer actionable strategies and recommendations for the student to improve in the weak areas identified. This could include:
    - Revisiting specific concepts or topics.
    - Engaging in targeted practice on certain question types.
    - Addressing common misconceptions.

Avoid question-by-question analysis. Focus on general themes in the student's performance and maintain a clear, encouraging, and motivational tone to inspire improvement.
use bullet points where needed.
 Ensure a smooth and cohesive flow in the response.
 use words as if you are talking to that student.
   Start directly with the evaluation without providing any introductory remarks like file readability or listing the correct answers.

`;





    const response = await fetch(`${process.env.AI}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are working at Ivy Professional School. You are reviewing the quiz performance based on the student's answers. Summarize the feedback, focusing on overall performance and areas for improvement. use ReactMarkDown for better alignment and readability. let them know if their review is bad dont give opposite feedback eg if quiz is bad then them that they have to improve and how`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();


    if (response.ok) {
      const tokenUsage={
        prompt_tokens:data.usage.prompt_tokens,
        completion_tokens:data.usage.completion_tokens,
        total_tokens:data.usage.total_tokens
      }
      const generatedText = data.choices[0].message.content.trim();
      console.log(generatedText)
      res.status(200).json({ generatedText: generatedText,tokenUsage });
    } else {
      res.status(500).json({ error: 'Failed to generate prompt',tokenUsage });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating prompt' });
  }
}
)