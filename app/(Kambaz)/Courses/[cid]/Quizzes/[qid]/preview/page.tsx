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
      <Container className="mt-3" style={{ maxWidth: "900px" }}>
        <h3 className="mb-3">{quiz.title}</h3>
        <div className="alert alert-warning">
          This quiz has no questions yet. Add questions in the editor first.
        </div>
        <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor`)}>
          Go to Editor
        </Button>
      </Container>
    );
  }

  const questions = quiz.questions;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Get question type
  const getQuestionType = (q: any) => {
    if (Array.isArray(q.blanks) && q.blanks.length > 0) return "fill-in-blank";
    const t = (q.type || q.questionType || "").toString().toLowerCase();
    if (t.includes("blank") || t.includes("fill")) return "fill-in-blank";
    if (typeof q.correctAnswer === "boolean" || t.includes("true") || t.includes("false")) return "true-false";
    return "multiple-choice";
  };

  const questionType = getQuestionType(currentQuestion);

  const handleAnswerChange = (value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: value,
    }));
  };

  const handleBlankAnswerChange = (blankIndex: number, value: string) => {
    const currentAnswers = answers[currentQuestion._id] || {};
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...currentAnswers,
        [blankIndex]: value,
      },
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((idx) => Math.min(totalQuestions - 1, idx + 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((idx) => Math.max(0, idx - 1));
  };

  const handleSubmit = () => {
    alert("Quiz submitted! (This is a preview; answers are not stored.)");
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  const formatStartTime = () => {
    return startTime.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isAnswered = (q: any) => {
    const value = answers[q._id];
    if (value === undefined || value === null) return false;
    if (typeof value === "object" && !Array.isArray(value)) {
      return Object.values(value).some((v) => v !== "" && v !== undefined);
    }
    return value !== "";
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "900px" }}>
      <div className="row">
        <div className="col-md-8">
          <h3 className="mb-3">{quiz.title}</h3>

          <div className="alert alert-warning d-flex align-items-center">
            <span className="me-2">ℹ️</span>
            <span>
              This is a preview. Your responses are not stored.
              {currentUser && " (Faculty view)"}
            </span>
          </div>

          {quiz.description && (
            <div className="mb-4">
              <h5>Quiz Instructions</h5>
              <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
            </div>
          )}

          {/* Question Display */}
          <div className="border rounded p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h6>Question {currentQuestionIndex + 1} of {totalQuestions}</h6>
              <span className="badge bg-secondary">{currentQuestion.points || 0} pts</span>
            </div>

            <div className="mb-4" dangerouslySetInnerHTML={{ __html: currentQuestion.question || "<p>No question text</p>" }} />

            {/* MULTIPLE CHOICE */}
            {questionType === "multiple-choice" && (
              <div>
                {(() => {
                  let choicesList: any[] = [];
                  if (Array.isArray(currentQuestion.choices) && currentQuestion.choices.length > 0) {
                    choicesList = currentQuestion.choices;
                  } else if (Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0) {
                    choicesList = currentQuestion.options.map((opt: string) => ({ text: opt }));
                  }

                  if (choicesList.length === 0) {
                    return <p className="text-muted">No answer choices available</p>;
                  }

                  return choicesList.map((choice: any, idx: number) => {
                    const choiceText = typeof choice === "string" ? choice : (choice?.text || `Option ${idx + 1}`);
                    const selected = answers[currentQuestion._id] === choiceText;

                    return (
                      <div
                        key={idx}
                        className={`mb-2 p-3 border rounded`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleAnswerChange(choiceText)}
                      >
                        <Form.Check
                          type="radio"
                          id={`choice-${currentQuestion._id}-${idx}`}
                          name={`question-${currentQuestion._id}`}
                          label={choiceText}
                          checked={selected}
                          onChange={() => handleAnswerChange(choiceText)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            )}

            {/* TRUE/FALSE */}
            {questionType === "true-false" && (
              <div>
                {[true, false].map((value) => {
                  const selected = answers[currentQuestion._id] === value;
                  return (
                    <div
                      key={value.toString()}
                      className={`mb-2 p-3 border rounded`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAnswerChange(value)}
                    >
                      <Form.Check
                        type="radio"
                        id={`tf-${currentQuestion._id}-${value}`}
                        name={`question-${currentQuestion._id}`}
                        label={value ? "True" : "False"}
                        checked={selected}
                        onChange={() => handleAnswerChange(value)}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* FILL IN THE BLANKS */}
            {questionType === "fill-in-blank" && (
              <div>
                {Array.isArray(currentQuestion.blanks) && currentQuestion.blanks.length > 1 ? (
                  <div>
                    <p className="text-muted small mb-3">Fill in each blank below:</p>
                    {currentQuestion.blanks.map((_: any, index: number) => {
                      const currentAnswers = answers[currentQuestion._id] || {};
                      return (
                        <div key={index} className="mb-3">
                          <Form.Label className="fw-semibold">Blank {index + 1}:</Form.Label>
                          <Form.Control
                            type="text"
                            value={currentAnswers[index] || ""}
                            onChange={(e) => handleBlankAnswerChange(index, e.target.value)}
                            placeholder={`Answer for blank ${index + 1}`}
                            style={{ maxWidth: "400px" }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <p className="text-muted small mb-2">Type your answer below:</p>
                    <Form.Control
                      type="text"
                      value={answers[currentQuestion._id] ?? ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here"
                      style={{ maxWidth: "400px" }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mb-4">
            <Button variant="secondary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button variant="secondary" onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1}>
              Next
            </Button>
          </div>

          {/* Submit Preview / Edit */}
          <div className="d-flex justify-content-end gap-2 mb-4">
            <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor`)}>
              Edit Quiz
            </Button>
            <Button variant="danger" onClick={handleSubmit}>
              Submit Preview
            </Button>
          </div>

          <div className="text-center text-muted mb-3">
            <small>Quiz started at {formatStartTime()}</small>
          </div>
        </div>

        {/* Sidebar - Question Navigation */}
        <div className="col-md-4">
          <div className="border rounded p-3 bg-white position-sticky" style={{ top: "20px" }}>
            <h6 className="mb-3">Questions</h6>
            <ul className="list-unstyled">
              {questions.map((q: any, idx: number) => (
                <li key={q._id} className="mb-2">
                  <button
                    type="button"
                    className={`btn w-100 text-start ${
                      idx === currentQuestionIndex ? "btn-primary" : "btn-outline-secondary"
                    }`}
                    onClick={() => setCurrentQuestionIndex(idx)}
                  >
                    {isAnswered(q) ? (
                      <span className="text-success">●</span>
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