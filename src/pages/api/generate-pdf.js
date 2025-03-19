import { convertMarkdownToPDF } from '@/utils/convertMarkdownToPDF';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { markdown } = req.body;
        if (!markdown) {
            return res.status(400).json({ message: 'Markdown content is required' });
        }

        const outputPath = path.join(process.cwd(), 'public', 'resume.pdf');
        await convertMarkdownToPDF(markdown, outputPath);

        res.status(200).json({ message: 'PDF generated successfully', pdfUrl: '/resume.pdf' });
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
}
