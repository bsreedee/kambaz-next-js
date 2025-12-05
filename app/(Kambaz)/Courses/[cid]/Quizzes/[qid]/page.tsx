/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../client";

const formatDateTime = (value?: string | Date) => {
  if (!value) return "Not set";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

export default function QuizDetailsPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const [quiz, setQuiz] = useState<any | null>(null);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  useEffect(() => {
    const load = async () => {
      const data = await client.findQuizById(qid);
      setQuiz(data);
    };
    load();
  }, [qid]);

  const handleTogglePublish = async () => {
    if (!quiz) return;
    const updated = await client.updateQuiz({
      ...quiz,
      published: !quiz.published,
    });
    setQuiz(updated);
  };

  if (!quiz) {
    return <Container className="mt-3">Loading quiz...</Container>;
  }

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      {/* Action Buttons - Canvas style */}
      {isFaculty && (
        <div className="d-flex gap-2 mb-4">
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}
          >
            Preview
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor`)}
          >
            <span>✏️</span> Edit
          </Button>
        </div>
      )}

      {/* Quiz Title */}
      <h2 className="mb-4">{quiz.title}</h2>

      {/* Quiz Details - Canvas two-column layout */}
      <div className="border rounded p-4 bg-white">
        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Quiz Type</div>
          <div className="col-7">{quiz.quizType || "Graded Quiz"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Points</div>
          <div className="col-7">{quiz.points || 0}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Assignment Group</div>
          <div className="col-7">{quiz.assignmentGroup || "QUIZZES"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Shuffle Answers</div>
          <div className="col-7">{quiz.shuffleAnswers ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Time Limit</div>
          <div className="col-7">{quiz.timeLimit} Minutes</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Multiple Attempts</div>
          <div className="col-7">{quiz.multipleAttempts ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">View Responses</div>
          <div className="col-7">Always</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Show Correct Answers</div>
          <div className="col-7">{quiz.showCorrectAnswers || "Immediately"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">One Question at a Time</div>
          <div className="col-7">{quiz.oneQuestionAtATime ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Require Respondus LockDown Browser</div>
          <div className="col-7">No</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Required to View Quiz Results</div>
          <div className="col-7">No</div>
        </div>

        <div className="row mb-2">
          <div className="col-5 text-end fw-semibold">Webcam Required</div>
          <div className="col-7">{quiz.webcamRequired ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-4">
          <div className="col-5 text-end fw-semibold">Lock Questions After Answering</div>
          <div className="col-7">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
        </div>

        {/* Due Date Table */}
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Due</th>
              <th>For</th>
              <th>Available from</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{formatDateTime(quiz.dueDate)}</td>
              <td>Everyone</td>
              <td>{formatDateTime(quiz.availableDate)}</td>
              <td>{formatDateTime(quiz.untilDate)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}