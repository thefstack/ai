'use client'
import React, { useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import axios from 'axios'

const languages = {
  javascript: { name: "JavaScript", extension: "js" },
  python: { name: "Python", extension: "py" },
  c: { name: "C", extension: "c" },
  cpp: { name: "C++", extension: "cpp" },
  java: { name: "Java", extension: "java" },
}

// Code templates for each language
const codeTemplates = {
  javascript: `// JavaScript Template\nconsole.log("Hello, World!");`,
  python: `# Python Template\nprint("Hello, World!")`,
  c: `// C Template\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  cpp: `// C++ Template\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  java: `// Java Template\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
}

export default function CodeEditor() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(codeTemplates[language]) // Set initial template
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput('Running...')
    try {
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: getLanguageId(language),
          stdin: '',
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      )

      const { token } = response.data
      const result = await pollForResult(token)
      setOutput(result)
    } catch (error) {
      console.log(error)
      setOutput('Error executing code')
    } finally {
      setIsRunning(false)
    }
  }

  const pollForResult = async (token) => {
    while (true) {
      const result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      })
      const { stdout, stderr, status } = result.data
      if (status.id === 3) return stdout || 'No output'
      if (status.id === 6) return stderr || 'Compilation error'
      if (status.id >= 7) return `Error: ${stderr || 'Execution error'}`
      await new Promise((res) => setTimeout(res, 1000))
    }
  }

  const getLanguageId = (language) => {
    const languageIds = {
      javascript: 63,
      python: 71,
      c: 50,
      cpp: 54,
      java: 62,
    }
    return languageIds[language]
  }

  // Update language and load corresponding code template
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    setCode(codeTemplates[newLanguage]) // Set the editor code to the template
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h3 style={styles.heading}>Select Language</h3>
        <select 
          value={language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={styles.select}
        >
          {Object.entries(languages).map(([key, { name }]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div style={styles.editorContainer}>
        <div style={styles.monacoContainer}>
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <button 
          onClick={handleRunCode} 
          disabled={isRunning}
          style={styles.button}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <div style={styles.outputContainer}>
          <h3 style={styles.heading}>Output:</h3>
          <pre style={styles.output}>
            {output}
          </pre>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
    width: '100%',
    overflow: 'scroll', // Prevents scrolling on the main container
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    overflowY: 'auto', // Allows sidebar to scroll if it overflows
    flexShrink: 0, // Prevents the sidebar from shrinking on small screens
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flexGrow: 1,
    minHeight:'400px',
    overflowY: 'auto', // Allows the editor to scroll if it overflows
  },
  monacoContainer: {
    height: '60vh', // Responsive height to fit within viewport
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  outputContainer: {
    flexGrow: 1,
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight:'100px',
    padding: '1rem',
    backgroundColor: '#fff',
    overflowY: 'auto', // Allows output to scroll if it overflows
  },
  heading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  output: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  '@media (min-width: 768px)': {
    container: {
      flexDirection: 'row',
    },
    sidebar: {
      width: '25%',
    },
    editorContainer: {
      width: '75%',
    },
    monacoContainer: {
      height: '60vh', // Keeps height consistent on larger screens
    },
  },
}
