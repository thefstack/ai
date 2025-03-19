import { createResumeFromInfo } from '@/services/resumeService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userInfo, jobDescription } = req.body;
        try {
            const filteredUserInfo = { ...userInfo };

            if(userInfo.personalDetails==null){
                return res.status(400).json({success:false, message:"personal details must be filled"})
            }
            if(!jobDescription){
                return res.status(400).json({success:false, message:"job description cannot be empty"})
            }

            if (filteredUserInfo.experience.length === 0) {
                delete filteredUserInfo.experience;
            }
            if (filteredUserInfo.projects.length === 0) {
                delete filteredUserInfo.projects;
            }
            if (filteredUserInfo.education.length === 0) {
                delete filteredUserInfo.education;
            }

            console.log("before: ",userInfo);
            console.log("after :",filteredUserInfo)

            console.log("generating response....")

            const markdownContent = await createResumeFromInfo(filteredUserInfo,jobDescription);
            // console.log(markdownContent)
            console.log("generating response success")
            
            res.status(200).json({ success: true, markdown: markdownContent });
        } catch (error) {
            console.log(error)
            res.status(500).json({ success:false, message: error.message });
        }
    } else {
        res.status(405).json({ success:false, error: 'Method not allowed' });
    }
}

export const config = {
    api: {
        bodyParser: {
            json: true,
        },
    },
};
