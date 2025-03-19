import React, { useEffect, useRef, useState } from 'react';
import styles from '@/css/QuizReview.module.css';
import { useQuiz } from '@/context/QuizContext';
import ReactMarkdown from "react-markdown";
import { Share, X, Check } from 'lucide-react';
import html2canvas from 'html2canvas'; // Importing html2canvas
import jsPDF from 'jspdf'; // Importing jsPDF
import { useLesson } from '@/context/LessonContext';

const QuizReview = () => {
  const { score, questions, loading, userAnswers, quizTopic, dynamicContent, quizTitle, selectedTool, quizId, checkRank, rankResponse, rankChecked, setRankChecked, quizRes } = useQuiz();
  const { generateLessonPlanFromReview } = useLesson();
  const reviewRef = useRef(null); // Ref for the component to capture
  // const [percentile, setPercentile] = useState(null); // State to hold the percentile value


  // Function to render circular progress
  const renderCircularProgress = (score) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    if (loading) {
      return <>...Loading</>;
    }

    return (
      <svg width="160" height="160" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="#000"
          strokeWidth="15"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke="#076AD8"
          strokeWidth="16"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{
            transitionDelay: "12s",
            transition: 'stroke-dashoffset 1.5s ease',
            strokeDashoffset: circumference - progress,
          }}
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize="24"
          fill="#000"
        >
          {Math.round(score)}%
        </text>
      </svg>
    );
  };

  const generateDescription = (score) => {
    if (score === 100) {
      return "Outstanding! You've answered all questions correctly, demonstrating an excellent understanding of the topics. Keep up the great work!";
    } else if (score >= 80) {
      return "Great job! You have a solid grasp of the concepts, though there are a few areas where you can still improve. Keep studying and practicing!";
    } else if (score >= 60) {
      return "Good effort! You've got a decent understanding of the material, but there's room for improvement. Review the areas where you struggled and keep practicing.";
    } else if (score >= 40) {
      return "You're getting there, but you might want to spend more time reviewing the topics. Consider revisiting the areas where you struggled.";
    } else {
      return "It looks like you're having some trouble with the material. Don't worry! Go back and review the concepts, and try the quiz again when you're ready.";
    }
  };

  const generateMotiveText = (score) => {
    if (score === 100) {
      return "Amazing work! 🎉";
    } else if (score >= 80) {
      return "Keep pushing! 🌟";
    } else if (score >= 60) {
      return "You're doing well! 💪";
    } else if (score >= 40) {
      return "Keep going, you're improving! 🚀";
    } else {
      return "Stay determined: you’ll improve!";
    }
  };


  // useEffect = (() => {
  //   console.log("rank", checkRank)
  // }, [])

  // const calculatePercentile = () => {
  //   if (!rankResponse || !rankResponse.allScores || !Array.isArray(rankResponse.allScores)) {
  //     console.error("Rank response or allScores data is missing or invalid.");
  //     return;
  //   }

  //   const allScores = rankResponse.allScores; // Array of all scores
  //   const yourScore = score; // Assuming `score` holds the current user's score

  //   const numberOfValuesBelowX = allScores.filter((s) => s < yourScore).length;
  //   const totalNumberOfValues = allScores.length;

  //   const calculatedPercentile = (numberOfValuesBelowX / totalNumberOfValues) * 100;
  //   setPercentile(calculatedPercentile);
  // };

  const downloadPDF = () => {
    const input = reviewRef.current;

    // Ensure all <details> elements are open to capture all content
    const detailsElements = input.querySelectorAll('details');
    detailsElements.forEach(detail => detail.setAttribute('open', true));

    // Use html2canvas to capture the full component dimensions
    html2canvas(input, {
      scale: 2, // Increase quality
      useCORS: true, // For cross-origin images
      width: input.scrollWidth, // Full width of the component
      height: input.scrollHeight, // Full height of the component
      windowWidth: input.scrollWidth, // Full window width
      windowHeight: input.scrollHeight // Full window height
    }).then((canvas) => {
      // Generate PDF from the captured canvas
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add pages if content exceeds one page
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('quiz_review.pdf'); // Download the PDF

      // Close the <details> sections after download
      detailsElements.forEach(detail => detail.removeAttribute('open'));
    });
  };


  // const checkRank = () => {
  //   setRankChecked(true);
  //   console.log("quizId", quizId);
  // }


  useEffect(() => {
    setRankChecked(false)
  }, [])
  useEffect(()=>{
    console.log("quiz res:",quizRes)
  },[quizRes])


  if (!questions || questions.length === 0) {
    return (
      <div className={styles.quizReviewContainer}>
        <h1 className={styles.title}>No Review Available</h1>
      </div>
    );
  }

  return (
    <div className={styles.quizReviewContainer} id="quizReviewContainer" ref={reviewRef}> {/* Added ref for the whole component */}
      <h1 className={styles.title}>Quiz Review</h1>
      <p className={styles.description}>
        {generateDescription(score)}
      </p>

      <div className={styles.progressSection}>
        <div className={styles.dummyText}>
          <ReactMarkdown>{dynamicContent}</ReactMarkdown>
        </div>
        
        <div className={styles.progressWrapper}>
        {quizRes && !quizRes.personalContent && rankChecked && rankResponse.percentile !== undefined && (
          <div className={`${styles.rankText}`} style={{ fontSize: 16 ,color:'#0a489e'}}>
            <p>Your Percentile: {rankResponse.percentile}</p>
          </div>
        )}
          {renderCircularProgress(score)}

          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            {/* <button className={styles.rankButton} onClick={calculatePercentile}>
              Your Percentile
            </button>
            {percentile !== null && (
              <p className={styles.percentileText}>
                Your Percentile: {percentile.toFixed(2)}%
              </p>
            )} */}
            {/* Button and Rank Text Section */}
            {quizRes && !quizRes.personalContent ? !rankChecked ? (
              <button className={styles.rankButton} onClick={() => { checkRank(quizId, quizTitle, selectedTool); }}>
                Know Your Rank
              </button>
            ) : (
              <div style={{ width: '100%' }}>
                <span className={styles.rankText}>
                  {/* You're in 2nd position! */}
                  {rankResponse.quizRank === 1 ? (
                    `You're in top position out of ${rankResponse.totalStudents} students. 🌟`
                  ) : rankResponse.quizRank === 2 ? (
                    `You're in 2nd position out of ${rankResponse.totalStudents} students. 🎉`
                  ) : rankResponse.quizRank === rankResponse.totalStudents ? (
                    `You're in ${rankResponse.quizRank}th position out of ${rankResponse.totalStudents} students. Keep going! 💪`
                  ) : (
                    `You're in ${rankResponse.quizRank}th position out of ${rankResponse.totalStudents} students. Great job!`
                  )}                </span>
              </div>
            ):null}
            <p className={styles.motiveText}>{generateMotiveText(score)}</p>
            <button className={styles.shareButton} onClick={downloadPDF}>
              <Share /> Share
            </button>
            <button className={styles.generateLessonPlanBtn} onClick={(e) => { e.preventDefault; generateLessonPlanFromReview(quizId) }}>Create Lesson Plan</button>
          </div>
        </div>

      </div>

      {/* <div className={styles.generateLessonPlanCont}>
        <p>Click here <button className={styles.generateLessonPlanBtn} onClick={(e)=>{e.preventDefault; generateLessonPlanFromReview(quizTopic,dynamicContent,quizTitle,selectedTool)}}>Generate Lesson Plan</button> to generate Lesson Plan based on your Quiz  Review</p>
      </div> */}

      <div className="topic-container" style={{ marginTop: "20px", width: "100%" }}>
        <p style={{ margin: "10px 0" }}>Topics</p>
        <div className="topics" style={{ display: "flex", flexWrap: "wrap", gap: "25px", padding: "15px", userSelect: "none" }}>
          {quizTopic.map((items, index) => (
            <div key={index} className='subtopics' style={{ border: "1px solid #076AD8", padding: "25px 15px", borderRadius: "5px" }}>{items}</div>
          ))}
        </div>
      </div>

      <div className={styles.topicSection}>
        <h2>Questions</h2>
        <p style={{ fontSize: "0.8rem" }}>The following section shows the questions and your answers grouped by topic. Review each question by expanding the question. Incorrect answers are shown allowing the user to see explanations. Explore tutors for further assistance.</p>
      </div>

      <div className={styles.questionsSection}>
        {questions.map((question, index) => {
          const selectedOption = userAnswers[index];
          const correctOption = question.answer;

          return (
            <details key={index} className={styles.questionContainer}>
              <summary className={styles.questionSummary}>
                <span className={styles.iconLabel}>
                  {(selectedOption === correctOption) ? (
                    <Check className={styles.correctIconLabel} />
                  ) : selectedOption && !question.options.find(option => option.isCorrect && selectedOption === option.text) ? (
                    <X className={styles.wrongIconLabel} />
                  ) : null}
                </span>
                {question.question}
              </summary>
              <div className={styles.answersContainer}>
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`${styles.option} ${option.isCorrect ? styles.correct : selectedOption === option.text ? styles.incorrect : ''}`}
                    style={{ background: correctOption == option.text && selectedOption === correctOption ? '#b4f5b4' : "" }}
                  >
                    <span className={styles.optionLabel}>
                      {option.text === correctOption ? (
                        <Check className={styles.correctIconLabel} />
                      ) : selectedOption === correctOption ? (
                        <X className={styles.wrongIconLabel} />
                      ) : <X className={styles.wrongIconLabel} />}
                    </span>
                    {String.fromCharCode(65 + optIndex)}. {option.text}
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
};

export default QuizReview;
