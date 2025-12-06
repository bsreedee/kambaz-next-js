/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Alert, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import * as attemptClient from "../../../attemptClient";
import * as quizClient from "../../../client";

export default function QuizResultsPage() {
  const { cid, qid, attemptId } = useParams() as {
    cid: string;
    qid: string;
    attemptId: string;
  };
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [attempt, setAttempt] = useState<any | null>(null);
  const [quiz, setQuiz] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        
        const attemptData = await attemptClient.getAttemptById(attemptId);
        setAttempt(attemptData);

        const quizData = await quizClient.findQuizById(qid);
        setQuiz(quizData);

        setLoading(false);
      } catch (error) {
        console.error("Error loading results:", error);
        alert("Error loading quiz results");
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    };

    loadResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Check if correct answers should be shown
  const canShowCorrectAnswers = () => {
    if (!quiz) return false;
    
    const setting = quiz.showCorrectAnswers || "Never";
    
    if (setting === "Immediately") return true;
    if (setting === "Never") return false;
    
    if (setting === "After Due Date") {
      if (!quiz.dueDate) return false;
      const dueDate = new Date(quiz.dueDate);
      const now = new Date();
      return now > dueDate;
    }
    
    return false;
  };

  const showAnswers = canShowCorrectAnswers();

  if (loading) {
    return (
      <Container className="mt-3">
        <p>Loading results...</p>
      </Container>
    );
  }

  if (!attempt || !quiz) {
    return (
      <Container className="mt-3">
        <Alert variant="warning">Quiz results not found.</Alert>
        <Button onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = attempt.answers?.find(
    (a: any) => a.questionId === currentQuestionIndex.toString()
  );

  // Question type detection
  const isMultipleChoice = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return t.includes("multiple") || t.includes("choice") ||
           (Array.isArray(q.choices) && q.choices.length > 0) ||
           (Array.isArray(q.options) && q.options.length > 0);
  };

  const isTrueFalse = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return t.includes("true") || t.includes("false");
  };

  const isFillInBlank = (q: any) => {
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    return t.includes("blank") || t.includes("fill");
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "1000px" }}>
      {/* Header with Score */}
      <div className="mb-4">
        <h3>{quiz.title}</h3>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1">
              <strong>Attempt {attempt.attemptNumber}</strong> - Submitted{" "}
              {formatDate(attempt.submittedAt)}
            </p>
            <p className="mb-1">
              This attempt took {formatTime(attempt.timeSpent || 0)}.
            </p>
          </div>
          <div className="text-end">
            <h4>
              Score: <strong>{attempt.score}</strong> out of{" "}
              {attempt.totalPoints}
            </h4>
            <Badge bg={attempt.percentage >= 70 ? "success" : "warning"} className="fs-6">
              {attempt.percentage?.toFixed(1)}%
            </Badge>
          </div>
        </div>
      </div>

      {/* Show/Hide Answers Alert */}
      {!showAnswers && (
        <Alert variant="info">
          <strong>ℹ️ Correct answers are not available yet.</strong>
          {quiz.showCorrectAnswers === "After Due Date" && quiz.dueDate && (
            <> They will be available after {formatDate(quiz.dueDate)}.</>
          )}
          {quiz.showCorrectAnswers === "Never" && (
            <> Correct answers will not be shown for this quiz.</>
          )}
        </Alert>
      )}

      <hr />

      {/* Question Display */}
      <div className="row">
        <div className="col-md-9">
          <div className="border rounded p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h5>
              <div>
                <Badge
                  bg={currentAnswer?.isCorrect ? "success" : "danger"}
                  className="me-2"
                >
                  {currentAnswer?.pointsEarned || 0} / {currentQuestion.points || 0} pts
                </Badge>
              </div>
            </div>

            {/* Question Text */}
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: currentQuestion.question || "<p>No question text</p>",
              }}
            />

            {/* Multiple Choice Display */}
            {isMultipleChoice(currentQuestion) && (
              <div>
                {(() => {
                  let choicesList: any[] = [];
                  
                  if (Array.isArray(currentQuestion.choices)) {
                    choicesList = currentQuestion.choices;
                  } else if (Array.isArray(currentQuestion.options)) {
                    choicesList = currentQuestion.options.map((opt: string) => ({
                      text: opt,
                      correct: opt === currentQuestion.correctAnswer,
                    }));
                  }

                  return choicesList.map((choice: any, idx: number) => {
                    const choiceText = choice.text || choice;
                    const isSelected = currentAnswer?.answer === choiceText;
                    const isCorrect = showAnswers && (choice.correct || choiceText === currentQuestion.correctAnswer);

                    let className = "p-3 mb-2 border rounded";
                    if (isSelected && isCorrect) {
                      className += " bg-success text-white";
                    } else if (isSelected && !isCorrect) {
                      className += " bg-danger text-white";
                    } else if (!isSelected && isCorrect && showAnswers) {
                      className += " border-success bg-light";
                    }

                    return (
                      <div key={idx} className={className}>
                        <div className="d-flex align-items-center">
                          {isSelected && <span className="me-2">▶</span>}
                          <span>{choiceText}</span>
                          {isSelected && isCorrect && (
                            <Badge bg="success" className="ms-auto">
                              Your Answer ✓
                            </Badge>
                          )}
                          {isSelected && !isCorrect && (
                            <Badge bg="danger" className="ms-auto">
                              Your Answer ✗
                            </Badge>
                          )}
                          {!isSelected && isCorrect && showAnswers && (
                            <Badge bg="success" className="ms-auto">
                              Correct Answer ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* True/False Display */}
            {isTrueFalse(currentQuestion) && (
              <div>
                {[true, false].map((value) => {
                  const isSelected = currentAnswer?.answer === value;
                  const isCorrect = showAnswers && value === currentQuestion.correctAnswer;

                  let className = "p-3 mb-2 border rounded";
                  if (isSelected && isCorrect) {
                    className += " bg-success text-white";
                  } else if (isSelected && !isCorrect) {
                    className += " bg-danger text-white";
                  } else if (!isSelected && isCorrect && showAnswers) {
                    className += " border-success bg-light";
                  }

                  return (
                    <div key={value.toString()} className={className}>
                      <div className="d-flex align-items-center">
                        {isSelected && <span className="me-2">▶</span>}
                        <span>{value ? "True" : "False"}</span>
                        {isSelected && isCorrect && (
                          <Badge bg="success" className="ms-auto">
                            Your Answer ✓
                          </Badge>
                        )}
                        {isSelected && !isCorrect && (
                          <Badge bg="danger" className="ms-auto">
                            Your Answer ✗
                          </Badge>
                        )}
                        {!isSelected && isCorrect && showAnswers && (
                          <Badge bg="success" className="ms-auto">
                            Correct Answer ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fill in Blank Display */}
            {isFillInBlank(currentQuestion) && (
              <div>
                <div className="mb-3">
                  <strong>Your Answer:</strong>
                  <div className={`p-3 border rounded ${currentAnswer?.isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    {currentAnswer?.answer || "(No answer provided)"}
                    {currentAnswer?.isCorrect && <Badge bg="success" className="ms-2">✓</Badge>}
                    {!currentAnswer?.isCorrect && <Badge bg="danger" className="ms-2">✗</Badge>}
                  </div>
                </div>
                
                {showAnswers && (
                  <div>
                    <strong>Correct Answer{currentQuestion.blanks?.length > 1 ? 's' : ''}:</strong>
                    <div className="p-3 border border-success rounded bg-light">
                      {Array.isArray(currentQuestion.blanks) && currentQuestion.blanks.length > 0
                        ? currentQuestion.blanks.join(", ")
                        : currentQuestion.correctAnswer}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-between mb-4">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(quiz.questions.length - 1, currentQuestionIndex + 1)
                )
              }
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next →
            </Button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Button
              variant="primary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
            >
              Back to Quiz Details
            </Button>
          </div>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="col-md-3">
          <div
            className="border rounded p-3 bg-white position-sticky"
            style={{ top: "20px" }}
          >
            <h6 className="mb-3">Questions</h6>
            <div className="d-grid gap-2">
              {quiz.questions.map((q: any, idx: number) => {
                const ans = attempt.answers?.find(
                  (a: any) => a.questionId === idx.toString()
                );
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <Button
                    key={idx}
                    size="sm"
                    variant={
                      isCurrent
                        ? "danger"
                        : ans?.isCorrect
                        ? "success"
                        : "outline-danger"
                    }
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className="text-start"
                  >
                    {ans?.isCorrect ? "✓ " : "✗ "}Q{idx + 1}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}