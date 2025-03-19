import puppeteer from 'puppeteer';
import markdownIt from 'markdown-it';

export async function convertMarkdownToPDF(markdown, outputPath) {
    const md = new markdownIt();
    const htmlContent = md.render(markdown);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Convert Markdown HTML to a proper document
    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3 { color: #333; }
          p { font-size: 14px; line-height: 1.6; }
          ul { margin-left: 20px; }
          li { margin-bottom: 5px; }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>`;

    await page.setContent(html);
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true });

    await browser.close();
    console.log(`✅ PDF saved: ${outputPath}`);
}
