import { authMiddleware } from "@/lib/authMiddleware";
import User from "@/model/user";

export default authMiddleware(async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
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
    if (!(await user.canUseFeature("lesson"))) {
        return res
            .status(400)
            .json({
                success: false,
                message: "User has reached the daily limit for lesson",
            });
    }

    const { selectedTitle, selectedCategory, selectedSubCategory, selectedDays, selectedTime, selectedDifficulty } = req.body;

    try {
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
                        role: 'user',
                        content: `Generate a detailed lesson plan based on the following inputs:

- Course: ${selectedTitle}
- Tool: ${selectedCategory}
- Topics: ${selectedSubCategory.join(', ')}
- Duration: ${selectedDays} days (Ensure exactly this number of days is generated)
- Study Time: ${selectedTime} per day
- Difficulty Level: ${selectedDifficulty}

### Lesson Plan Requirements:

1. **Course Overview**
   - Clearly define the purpose of the course and the target audience (e.g., beginners, intermediates).
   - List key learning objectives with a focus on practical, beginner-friendly outcomes.
   - Suggest optional advanced topics or projects for intermediate learners.

2. **Day-by-Day Plan**
   - Generate **exactly ${selectedDays} days** of lessons—no extra or missing days.
   - Each day must include:
     - A **topic** selected from the provided topics list.
     - A **list of key concepts** to be covered (as a string, separated by commas).
   - **Every third day (if applicable), include a reflection or checkpoint activity.**
   - **The final day must include a capstone project or practical activity to reinforce learning.**

3. **Difficulty Adaptation**
   - **Easy:** Focus on core concepts, avoid technical jargon, and simplify explanations.
   - **Medium:** Include hands-on exercises and deeper practical applications.
   - **Hard:** Add advanced techniques, challenges, or optional deep dives for self-paced learners.

4. **Output Format (JSON)**
Return the lesson plan in the following structured JSON format:

\`\`\`json
{
    "courseOverview": "string",
    "dayByDayPlan": [
        {
            "day": 1,
            "topic": "string",
            "keyConceptsToBeCovered": "string, string, string",
            "activity": "optional activity for reflection, assessment, or deeper exploration"
        },
        ...
    ]
}
\`\`\`

### Important Rules:
- **Ensure ${selectedTitle} and ${selectedSubCategory} are always defined** to prevent errors.
- **The "dayByDayPlan" array must contain exactly ${selectedDays} entries—no more, no less.**
- **Use topics from ${selectedSubCategory} dynamically** without repetition errors.
- **Follow the requested JSON structure exactly** without additional text or explanations.`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.4,
            })
        });

        const data = await response.json();

        if (response.ok) {
            const tokenUsage = {
                prompt_tokens: data.usage.prompt_tokens,
                completion_tokens: data.usage.completion_tokens,
                total_tokens: data.usage.total_tokens
            };

            // Process the response and format the lesson plan
            let lessonPlanString = data.choices[0].message.content.trim();

            // Remove unnecessary backticks or markdown-like code blocks from the response
            lessonPlanString = lessonPlanString.replace(/```json/g, "").replace(/```/g, "");

            // Step 3: Parse the corrected string into JSON
            const lessonPlan = JSON.parse(lessonPlanString);

            // Decrement the feature usage
            await user.useFeature("lesson");

            res.status(200).json({ lessonPlan, tokenUsage });
        } else {
            res.status(500).json({ error: 'Error generating lesson plan' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating lesson plan' });
    }
});
