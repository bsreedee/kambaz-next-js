/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
  Badge,
  Button,
  Container,
  Dropdown,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import {
  BsGripVertical,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { FaPlus, FaTrash, FaBan, FaCheckCircle } from "react-icons/fa";

import * as client from "./client";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";

const formatDate = (value?: string | Date) => {
  if (!value) return "No date";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getAvailabilityText = (quiz: any) => {
  const now = new Date();
  const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

  if (availableDate && now < availableDate) {
    return `Not available until ${formatDate(availableDate)}`;
  }

  if (untilDate && now > untilDate) {
    return "Closed";
  }

  if (availableDate || untilDate) {
    return "Available";
  }

  return "No availability dates";
};

export default function QuizzesPage() {
  const { cid } = useParams() as { cid: string };
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [isLoading, setIsLoading] = useState(false);

  const courseQuizzes = useMemo(
    () =>
      (quizzes || [])
        .filter((quiz: any) => quiz.course === cid)
        .slice()
        .sort((a: any, b: any) => {
          const aDate = a.availableDate ? new Date(a.availableDate).getTime() : 0;
          const bDate = b.availableDate ? new Date(b.availableDate).getTime() : 0;
          return aDate - bDate;
        }),
    [quizzes, cid]
  );

  const fetchQuizzes = async () => {
    if (!cid) return;
    try {
      setIsLoading(true);
      const data = await client.findQuizzesForCourse(cid);
      dispatch(setQuizzes(data));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const handleAddQuiz = async () => {
    if (!cid) return;
    const defaultQuiz = {
      title: "New Quiz",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      points: 0,
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      attemptsAllowed: 1,
      showCorrectAnswers: "Never",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      availableDate: new Date().toISOString(),
      dueDate: null,
      untilDate: null,
      published: false,
      questions: [],
    };

    const created = await client.createQuizForCourse(cid, defaultQuiz);
    dispatch(addQuiz(created));
    // Navigate directly to details/editor later; for now details stub:
    router.push(`/Courses/${cid}/Quizzes/${created._id}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      await client.deleteQuiz(quizId);
    } catch {
      // ignore network errors for now; we'll still optimistically update UI
    }
    dispatch(deleteQuiz({ _id: quizId }));
  };

  const handleTogglePublish = async (quiz: any) => {
    const updatedQuiz = { ...quiz, published: !quiz.published };
    let saved = updatedQuiz;
    try {
      saved = await client.updateQuiz(updatedQuiz);
    } catch {
      // keep optimistic value
    }
    dispatch(updateQuiz(saved));
  };

  return (
    <Container id="wd-quizzes">
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h3 className="mb-0">Quizzes</h3>
        {isFaculty && (
          <Button
            variant="danger"
            className="custom-btn"
            onClick={handleAddQuiz}
          >
            <FaPlus className="me-2 fs-5" />
            Quiz
          </Button>
        )}
      </div>

      <hr />

      {isLoading && <p>Loading quizzes...</p>}

      {!isLoading && courseQuizzes.length === 0 && (
        <div className="text-muted mt-3">
          No quizzes yet. Click{" "}
          {isFaculty ? <strong>+ Quiz</strong> : <strong>Back</strong>} to add
          the first quiz.
        </div>
      )}

      {courseQuizzes.length > 0 && (
        <ListGroup className="wd-lessons rounded-0 mt-3" id="wd-quiz-list">
          <ListGroupItem className="p-0 mb-4 fs-5 border-gray">
            <div className="p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <strong>QUIZZES</strong>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="light" text="dark">
                  Sorted by Available date
                </Badge>
              </div>
            </div>
          </ListGroupItem>

          {courseQuizzes.map((quiz: any, index: number) => {
            const numberOfQuestions = quiz.questions?.length ?? 0;

            return (
              <ListGroupItem
                className="p-3 ps-1 d-flex align-items-start justify-content-between"
                key={quiz._id}
              >
                <div className="d-flex">
                  <BsGripVertical className="me-3 fs-3 text-secondary" />
                  <div>
                    <Link
                      href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                      className="text-black text-decoration-none fw-semibold"
                    >
                      {`Q${index + 1} - ${quiz.title}`}
                    </Link>
                    <div className="text-muted small mt-1">
                      <span className="fw-semibold">
                        {getAvailabilityText(quiz)}
                      </span>{" "}
                      | <span className="fw-semibold">Due</span>{" "}
                      {formatDate(quiz.dueDate)} |{" "}
                      <span className="fw-semibold">
                        {quiz.points ?? 0} pts
                      </span>{" "}
                      |{" "}
                      <span className="fw-semibold">
                        {numberOfQuestions} questions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  {/* Publish / Unpublish icon */}
                  <button
                    type="button"
                    className="btn btn-link p-0 border-0"
                    onClick={() => handleTogglePublish(quiz)}
                    title={quiz.published ? "Unpublish" : "Publish"}
                  >
                    {quiz.published ? (
                      <FaCheckCircle className="text-success fs-4" />
                    ) : (
                      <FaBan className="text-danger fs-4" />
                    )}
                  </button>

                  {/* Context menu */}
                  {isFaculty && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="button"
                        className="btn btn-link p-0 border-0"
                        id={`quiz-actions-${quiz._id}`}
                      >
                        <BsThreeDotsVertical className="fs-4" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() =>
                            router.push(`/Courses/${cid}/Quizzes/${quiz._id}`)
                          }
                        >
                          Edit details
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleTogglePublish(quiz)}
                        >
                          {quiz.published ? "Unpublish" : "Publish"}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() => handleDeleteQuiz(quiz._id)}
                        >
                          <FaTrash className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      )}
    </Container>
  );
}
