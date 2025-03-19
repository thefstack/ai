import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/model/user";
import axios from "axios";

export default authMiddleware(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.user.id || req.user.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check feature usage limits
  if (!(await user.canUseFeature("quiz"))) {
    return res.status(400).json({
      success: false,
      message: "User has reached the daily limit for quiz",
    });
  }

  let {
    topics,
    numberOfQuestions,
    selectedDifficulty,
    selectedCategory,
    selectedTool,
  } = req.body;

  if (!topics) {
    return res.status(400).json({ error: "No topics provided" });
  }

  // Normalize topics to an array, splitting by commas if it’s a string
  if (typeof topics === "string") {
    topics = topics.split(",").map((topic) => topic.trim()); // Trim whitespace around each topic
  }

  try {
    const response = await axios.post(
      `${process.env.AI}`,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Generate ${numberOfQuestions} multiple-choice questions with difficultyLevel: ${selectedDifficulty} on the selected domain:${selectedCategory}, selected tool:${selectedTool}, on the topics: ${topics.join(
              ", "
            )}. The questions should:

1. Match the difficulty level specified ({difficultyLevel: 'easy', 'medium', 'hard'})  to ensure they are appropriate for the learner's preference:
   - Easy: Focus on basic definitions, simple concepts, and straightforward application.
   - Medium: Include moderately challenging questions that require understanding and application of concepts.
   - Hard: Focus on advanced understanding, problem-solving, and real-world applications.

2. Include exactly one correct answer and three plausible distractors:
   - Ensure distractors are plausible yet clearly distinguishable from the correct answer.
   - Use common misconceptions, related terms, or slightly incorrect interpretations as distractors to challenge the learner.
   - Avoid overly simple or irrelevant distractors, particularly for hard-level questions.

3. Ensure the questions assess one or more of the following:
   - Conceptual understanding (e.g., definitions, principles).
   - Application-based learning (e.g., interpreting textual scenarios or data descriptions).

4. Handle broad topics effectively:
   - If the topic is broad (e.g., 'Machine Learning'), break it into smaller subtopics (e.g., 'Supervised Learning,' 'Unsupervised Learning') and generate focused questions.
   - For abstract topics like 'AI Ethics,' break them into practical subtopics (e.g., 'Bias in AI,' 'Explainability') and create subtopic-specific questions.

5. Avoid requiring visual elements such as charts, images, or diagrams:
   - Instead, create descriptive textual scenarios for application-based questions. For example:
     - Provide a short description of a dataset or a situation in the question text.
     - Use plain text to simulate real-world scenarios without relying on visuals.

6. Randomize the placement of the correct answer among the options (A,  B, C, or D):
    -The correct answer should not always appear in the same position across questions.

7. Format the output as a JSON array in the following structure:
[
  {
    "text": "question", // The question text
    "options": [
      { "label": "A", "text": "option 1", "isCorrect": true }, // Mark the correct answer with "isCorrect: true"
      { "label": "B", "text": "option 2", "isCorrect": false },
      { "label": "C", "text": "option 3", "isCorrect": false },
      { "label": "D", "text": "option 4", "isCorrect": false }
    ]
  }
]

### Additional Guidelines: 
- Questions should be clear, concise, and relevant to the selected topics.
- Avoid ambiguous phrasing or overly complex wording, especially for easy and medium difficulty levels.
- Calibrate difficulty levels with concrete examples:
   - **Easy Example:** "What is the purpose of gradient descent?"
   - **Medium Example:** "How does the learning rate in gradient descent impact convergence?"
   - **Hard Example:** "Explain why a high learning rate might prevent gradient descent from minimizing the cost function.`,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log(response.data.choices)

    // Parse the response properly

    const questions = JSON.parse(
      response.data.choices[0].message.content
        .replace(/```json/g, "")
        .replace(/```/g, "")
    );

    // Check if questions is an array
    if (!Array.isArray(questions)) {
      throw new Error("Expected questions to be an array");
    }

    const tokenUsage = {
      prompt_tokens: response.data.usage.prompt_tokens,
      completion_tokens: response.data.usage.completion_tokens,
      total_tokens: response.data.usage.total_tokens,
    };

    // Decrement the feature usage
    await user.useFeature("quiz");

    res.status(200).json({ questions, tokenUsage });
  } catch (error) {
    console.error("Error:", error); // Improved error logging
    res.status(500).json({ message: "Error generating questions", error });
  }
});
