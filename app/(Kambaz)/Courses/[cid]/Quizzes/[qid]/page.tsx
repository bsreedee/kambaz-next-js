/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Table } from "react-bootstrap";
import * as client from "../client";

const formatDateTime = (value?: string | Date) => {
  if (!value) return "Not set";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleString();
};

export default function QuizDetailsPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const [quiz, setQuiz] = useState<any | null>(null);

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
    <Container className="mt-3">
      <h3 className="mb-3">{quiz.title}</h3>

      <div className="d-flex gap-2 mb-3">
        <Button
          variant={quiz.published ? "outline-secondary" : "success"}
          onClick={handleTogglePublish}
        >
          {quiz.published ? "Unpublish" : "Publish"}
        </Button>
        <Button
          variant="outline-primary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)
          }
        >
          Edit
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() =>
            router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)
          }
        >
          Preview (stub)
        </Button>
      </div>

      <Table bordered size="sm">
        <tbody>
          <tr>
            <th>Quiz Type</th>
            <td>{quiz.quizType}</td>
          </tr>
          <tr>
            <th>Assignment Group</th>
            <td>{quiz.assignmentGroup}</td>
          </tr>
          <tr>
            <th>Points</th>
            <td>{quiz.points}</td>
          </tr>
          <tr>
            <th>Shuffle Answers</th>
            <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Time Limit</th>
            <td>{quiz.timeLimit} minutes</td>
          </tr>
          <tr>
            <th>Multiple Attempts</th>
            <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <th>Available From</th>
            <td>{formatDateTime(quiz.availableDate)}</td>
          </tr>
          <tr>
            <th>Until</th>
            <td>{formatDateTime(quiz.untilDate)}</td>
          </tr>
          <tr>
            <th>Due Date</th>
            <td>{formatDateTime(quiz.dueDate)}</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
