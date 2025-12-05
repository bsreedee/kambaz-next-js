/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Form } from "react-bootstrap";
import * as client from "../../client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

export default function QuizPreviewPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const [quiz, setQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [startTime] = useState(new Date());
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await client.findQuizById(qid);
        console.log("Loaded quiz:", data); // Debug
        setQuiz(data);
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
    };
    load();
  }, [qid]);

  if (!quiz) {
    return (
      <Container className="mt-3">
        <p>Loading quiz...</p>
      </Container>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <Container className="mt-3">
        <div className="alert alert-warning">
          This quiz has no questions yet. Add questions in the editor first.
        </div>
        <Button 
          variant="primary" 
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor`)}
        >
          Go to Editor
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  console.log("Current question:", currentQuestion); // Debug
  console.log("Current answers:", answers); // Debug

  const handleAnswerChange = (value: any) => {
    console.log("Answer changed to:", value); // Debug
    setAnswers({
      ...answers,
      [currentQuestion._id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    alert("Quiz submitted! (This is a preview)");
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const formatStartTime = () => {
    return startTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "900px" }}>
      <div className="row">
        {/* Main Quiz Area */}
        <div className="col-md-8">
          {/* Quiz Title */}
          <h3 className="mb-3">{quiz.title}</h3>

          {/* Preview Warning Banner */}
          <div className="alert alert-warning d-flex align-items-center mb-3">
            <span className="me-2">ℹ️</span>
            <span>This is a preview of the published version of the quiz</span>
          </div>

          {/* Started Time */}
          <p className="text-muted">Started: {formatStartTime()}</p>

          {/* Quiz Instructions */}
          {quiz.description && (
            <div className="mb-4">
              <h5>Quiz Instructions</h5>
              <div 
                dangerouslySetInnerHTML={{ __html: quiz.description }}
              />
            </div>
          )}

          {/* Question Display */}
          <div className="border rounded p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h6>Question {currentQuestionIndex + 1}</h6>
              <span className="badge bg-secondary">{currentQuestion.points} pts</span>
            </div>

            <div 
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question || "<p>No question text</p>" }}
            />

            {/* Multiple Choice */}
            {currentQuestion.type === "multiple-choice" && (
              <div>
                {currentQuestion.choices && currentQuestion.choices.length > 0 ? (
                  currentQuestion.choices.map((choice: any, idx: number) => {
                    const choiceText = choice.text || choice || "";
                    const isSelected = answers[currentQuestion._id] === choiceText;
                    
                    console.log(`Choice ${idx}:`, choice, "Text:", choiceText, "Selected:", isSelected); // Debug
                    
                    return (
                      <div key={idx} className="mb-2">
                        <Form.Check
                          type="radio"
                          id={`choice-${currentQuestion._id}-${idx}`}
                          name={`question-${currentQuestion._id}`}
                          label={choiceText || `Option ${idx + 1}`}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(choiceText)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">No answer choices available</p>
                )}
              </div>
            )}

            {/* True/False */}
            {currentQuestion.type === "true-false" && (
              <div>
                <Form.Check
                  type="radio"
                  id={`true-${currentQuestion._id}`}
                  name={`question-${currentQuestion._id}`}
                  label="True"
                  checked={answers[currentQuestion._id] === true}
                  onChange={() => handleAnswerChange(true)}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id={`false-${currentQuestion._id}`}
                  name={`question-${currentQuestion._id}`}
                  label="False"
                  checked={answers[currentQuestion._id] === false}
                  onChange={() => handleAnswerChange(false)}
                  className="mb-2"
                />
              </div>
            )}

            {/* Fill in the Blank */}
            {currentQuestion.type === "fill-in-blank" && (
              <Form.Control
                type="text"
                value={answers[currentQuestion._id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here"
                style={{ maxWidth: "300px" }}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mb-4">
            <Button 
              variant="secondary" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            )}
          </div>

          {/* Quiz Save Info */}
          <div className="text-center text-muted mb-3">
            <small>Quiz saved at {formatStartTime()}</small>
          </div>

          {/* Keep Editing Button */}
          <div className="border rounded p-3 bg-light text-center mb-4">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor`)}
            >
              ✏️ Keep Editing This Quiz
            </Button>
          </div>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="col-md-4">
          <div className="border rounded p-3 bg-white position-sticky" style={{ top: "20px" }}>
            <h6 className="mb-3">Questions</h6>
            <ul className="list-unstyled">
              {quiz.questions.map((q: any, idx: number) => (
                <li key={q._id} className="mb-2">
                  <button
                    className={`btn btn-link text-decoration-none w-100 text-start ${
                      idx === currentQuestionIndex ? "text-danger fw-bold" : "text-secondary"
                    }`}
                    onClick={() => setCurrentQuestionIndex(idx)}
                  >
                    {answers[q._id] !== undefined ? (
                      <span className="text-danger">●</span>
                    ) : (
                      <span className="text-secondary">○</span>
                    )}{" "}
                    Question {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
}