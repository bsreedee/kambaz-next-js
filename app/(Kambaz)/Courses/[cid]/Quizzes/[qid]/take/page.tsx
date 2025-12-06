/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as quizClient from "../../client";
import * as attemptClient from "../../attemptClient";

export default function QuizTakingPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [quiz, setQuiz] = useState<any | null>(null);
  const [attempt, setAttempt] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Load quiz and attempt
  useEffect(() => {
    const loadQuizAndAttempt = async () => {
      try {
        setLoading(true);
        
        // Get quiz data
        const quizData = await quizClient.findQuizById(qid);
        setQuiz(quizData);

        // Check for in-progress attempt or create new one
        let attemptData = await attemptClient.getInProgressAttempt(qid);
        
        if (!attemptData) {
          // Start new attempt
          attemptData = await attemptClient.startQuizAttempt(qid);
        }

        setAttempt(attemptData);

        // Load existing answers
        if (attemptData.answers && attemptData.answers.length > 0) {
          const answersMap: Record<string, any> = {};
          attemptData.answers.forEach((ans: any) => {
            answersMap[ans.questionId] = ans.answer;
          });
          setAnswers(answersMap);
        }

        // Calculate time remaining
        if (quizData.timeLimit && quizData.timeLimit > 0) {
          const startTime = new Date(attemptData.startedAt).getTime();
          const now = new Date().getTime();
          const elapsed = Math.floor((now - startTime) / 1000);
          const limit = quizData.timeLimit * 60; // convert to seconds
          const remaining = Math.max(0, limit - elapsed);
          setTimeRemaining(remaining);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Error loading quiz. Please try again.");
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    };

    loadQuizAndAttempt();

    // Cleanup timers on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up! Auto-submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-save answer when it changes
  const saveAnswerDebounced = (questionId: string, questionType: string, answer: any) => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }

    autoSaveRef.current = setTimeout(async () => {
      if (attempt) {
        try {
          await attemptClient.saveQuestionAnswer(
            attempt._id,
            questionId,
            questionType,
            answer
          );
        } catch (error) {
          console.error("Error auto-saving answer:", error);
        }
      }
    }, 1000);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = () => {
    if (!quiz || !quiz.questions) return false;
    return quiz.questions.every((_: any, idx: number) => {
      const answer = answers[idx.toString()];
      return answer !== undefined && answer !== "" && answer !== null;
    });
  };

  const handleAnswerChange = (value: any) => {
    const questionId = currentQuestionIndex.toString();
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const questionType = currentQuestion.questionType || currentQuestion.type;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Auto-save
    saveAnswerDebounced(questionId, questionType, value);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (!allQuestionsAnswered()) {
      alert("Please answer all questions before submitting the quiz.");
      return;
    }

    const confirmSubmit = window.confirm(
      "Are you sure you want to submit this quiz? You cannot change your answers after submission."
    );

    if (!confirmSubmit) return;

    setIsSubmitting(true);

    try {
      // Save all answers first
      const savePromises = Object.entries(answers).map(([questionId, answer]) => {
        const questionIndex = parseInt(questionId);
        const question = quiz.questions[questionIndex];
        const questionType = question?.questionType || question?.type || "Multiple Choice";
        
        return attemptClient.saveQuestionAnswer(
          attempt._id,
          questionId,
          questionType,
          answer
        );
      });

      await Promise.all(savePromises);

      // Submit quiz for grading
      await attemptClient.submitQuiz(attempt._id);

      // Redirect to results page
      router.push(`/Courses/${cid}/Quizzes/${qid}/attempt/${attempt._id}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Detect question type
  const isMultipleChoice = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return (
      t.includes("multiple") ||
      t.includes("choice") ||
      (Array.isArray(q.choices) && q.choices.length > 0) ||
      (Array.isArray(q.options) && q.options.length > 0)
    );
  };

  const isTrueFalse = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return t.includes("true") || t.includes("false");
  };

  const isFillInBlank = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return t.includes("blank") || t.includes("fill");
  };

  if (loading) {
    return (
      <Container className="mt-3">
        <p>Loading quiz...</p>
      </Container>
    );
  }

  if (!quiz || !attempt || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Container className="mt-3">
        <Alert variant="warning">
          Quiz not found or has no questions.
        </Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz Details
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const questionId = currentQuestionIndex.toString();

  return (
    <Container className="mt-4" style={{ maxWidth: "900px" }}>
      <div className="row">
        {/* Main Quiz Area */}
        <div className="col-md-8">
          {/* Quiz Title */}
          <h3 className="mb-3">{quiz.title}</h3>

          {/* Warning for low time */}
          {timeRemaining !== null && timeRemaining < 300 && timeRemaining > 0 && (
            <Alert variant="warning">
              <strong>⚠️ Warning:</strong> Less than 5 minutes remaining!
            </Alert>
          )}

          {/* Question Display */}
          <div className="border rounded p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h6>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h6>
              <span className="badge bg-secondary">
                {currentQuestion.points || 0} pts
              </span>
            </div>

            {/* Question text */}
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: currentQuestion.question || "<p>No question text</p>",
              }}
            />

            {/* MULTIPLE CHOICE */}
            {isMultipleChoice(currentQuestion) && (
              <div>
                {(() => {
                  let choicesList: any[] = [];
                  
                  if (Array.isArray(currentQuestion.choices) && currentQuestion.choices.length > 0) {
                    choicesList = currentQuestion.choices;
                  } else if (Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0) {
                    choicesList = currentQuestion.options.map((opt: string) => ({
                      text: opt,
                    }));
                  }

                  return choicesList.map((choice: any, idx: number) => {
                    const choiceText = choice.text || choice;
                    const selected = answers[questionId] === choiceText;

                    return (
                      <div key={idx} className="mb-2">
                        <Form.Check
                          type="radio"
                          id={`choice-${questionId}-${idx}`}
                          name={`question-${questionId}`}
                          label={choiceText || `Option ${idx + 1}`}
                          checked={selected}
                          onChange={() => handleAnswerChange(choiceText)}
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* TRUE / FALSE */}
            {isTrueFalse(currentQuestion) && (
              <div>
                <Form.Check
                  type="radio"
                  id={`tf-${questionId}-true`}
                  name={`question-${questionId}`}
                  label="True"
                  className="mb-2"
                  checked={answers[questionId] === true}
                  onChange={() => handleAnswerChange(true)}
                />
                <Form.Check
                  type="radio"
                  id={`tf-${questionId}-false`}
                  name={`question-${questionId}`}
                  label="False"
                  className="mb-2"
                  checked={answers[questionId] === false}
                  onChange={() => handleAnswerChange(false)}
                />
              </div>
            )}

            {/* FILL IN THE BLANK */}
            {isFillInBlank(currentQuestion) && (
              <Form.Control
                type="text"
                value={answers[questionId] ?? ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here"
                style={{ maxWidth: "400px" }}
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
              ← Previous
            </Button>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button variant="primary" onClick={handleNext}>
                Next →
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={handleSubmit}
                disabled={isSubmitting || !allQuestionsAnswered()}
                title={!allQuestionsAnswered() ? "Please answer all questions before submitting" : ""}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="col-md-4">
          <div
            className="border rounded p-3 bg-white position-sticky"
            style={{ top: "20px" }}
          >
            <h6 className="mb-3">Questions</h6>
            
            {/* Timer - White background */}
            {timeRemaining !== null && (
              <div
                className={`p-3 mb-3 border rounded text-center ${
                  timeRemaining < 300 ? "border-danger bg-white" : "bg-white"
                }`}
              >
                <div className="fw-bold mb-1">Time Remaining:</div>
                <div
                  className={`fs-4 fw-bold ${
                    timeRemaining < 300 ? "text-danger" : "text-dark"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
            
            <div className="d-grid gap-2">
              {quiz.questions.map((q: any, idx: number) => {
                const isAnswered = answers[idx.toString()] !== undefined && answers[idx.toString()] !== "" && answers[idx.toString()] !== null;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <Button
                    key={idx}
                    variant={isCurrent ? "danger" : isAnswered ? "success" : "outline-secondary"}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className="text-start"
                  >
                    {isAnswered ? "✓ " : "○ "}
                    Question {idx + 1}
                  </Button>
                );
              })}
            </div>
            <hr />
            <div className="text-muted small">
              Answered: {Object.keys(answers).filter(key => {
                const val = answers[key];
                return val !== undefined && val !== "" && val !== null;
              }).length} / {quiz.questions.length}
            </div>
            {!allQuestionsAnswered() && (
              <div className="alert alert-warning mt-2 small py-2">
                Answer all questions to submit
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}