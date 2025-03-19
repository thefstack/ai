import { authMiddleware } from "@/lib/authMiddleware";

export default authMiddleware(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { personalContent } = req.body;
  // console.log(req.body)
  let systemMessage;

  if(personalContent==true){
    console.log("personalContent is true")
    const {summary}=req.body;

    systemMessage=`${summary}
    the above is the summary of a file that is uploaded by the user
    now Generate three thoughtful and relevant questions a learner might ask, Ensure the questions:  
    - Cover different aspects of the topic, including foundational knowledge, practical application, and advanced insights.  
    - Are highly relevant to the summary and avoid generic phrasing.  
    - Encourage actionable learning, such as applying the concept, solving a challenge, or exploring further resources.  
    - Are tailored for learners at a beginner to intermediate level unless otherwise specified.
    - Are covered under 120 words collectively without losing the overall effectiveness of the quetions
    `    
  }else{
    console.log("personalContent is false")
    const {subject,category}=req.body;
    console.log(subject,category)
    systemMessage=`Generate three thoughtful and relevant questions a learner might ask about ${subject} and subTopic ${category} to deepen their understanding. Ensure the questions:  
    - Cover different aspects of the topic, including foundational knowledge, practical application, and advanced insights.  
    - Are highly relevant to the subject and avoid generic phrasing.  
    - Encourage actionable learning, such as applying the concept, solving a challenge, or exploring further resources.  
    - Are tailored for learners at a beginner to intermediate level unless otherwise specified.
    - Are covered under 120 words collectively without losing the overall effectiveness of the quetions`
  }


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
            role: 'system',
            content: systemMessage
          }
        ],
        max_tokens: 175,
        temperature: 0.4,
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Clean up the response to remove numbers and quotes
      const questions = data.choices[0].message.content
        .trim()
        .split('\n')
        .filter(q => q)
        .map(q => q.replace(/^\d+\.\s*/, '').replace(/["']/g, ''));

      res.status(200).json({ questions });
    } else {
      res.status(500).json({ error: 'Error generating prompts' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating prompts' });
  }
}
)