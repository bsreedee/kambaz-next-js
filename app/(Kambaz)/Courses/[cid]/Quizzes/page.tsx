/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";

import {
  Button,
  Container,
  Dropdown,
  FormControl,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import {
  BsChevronDown,
  BsChevronRight,
} from "react-icons/bs";
import {
  FaPlus,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaEllipsisV,
} from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import * as client from "./client";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";
import "./quizstyles.css";

const formatDate = (value?: string | Date | null) => {
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
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
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

  const { quizzes } = useSelector(
    (state: RootState) => state.quizzesReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showAssignmentQuizzes, setShowAssignmentQuizzes] =
    useState(true);
  const [sortBy, setSortBy] = useState<"availableDate" | "title">(
    "availableDate"
  );

  // all quizzes for this course, sorted by selected criteria
  const courseQuizzes = useMemo(
    () =>
      (quizzes || [])
        .filter((quiz: any) => quiz.course === cid)
        .slice()
        .sort((a: any, b: any) => {
          if (sortBy === "title") {
            const titleA = (a.title ?? "").toLowerCase();
            const titleB = (b.title ?? "").toLowerCase();
            return titleA.localeCompare(titleB);
          } else {
            // sort by availableDate (default)
            const aDate = a.availableDate
              ? new Date(a.availableDate).getTime()
              : 0;
            const bDate = b.availableDate
              ? new Date(b.availableDate).getTime()
              : 0;
            return aDate - bDate;
          }
        }),
    [quizzes, cid, sortBy]
  );

  const filteredQuizzes = useMemo(() => {
    if (!searchText.trim()) return courseQuizzes;
    const lower = searchText.toLowerCase();
    return courseQuizzes.filter((q: any) =>
      (q.title ?? "").toLowerCase().includes(lower)
    );
  }, [courseQuizzes, searchText]);

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
      assignmentGroup: "Assignment quizzes",
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
    router.push(`/Courses/${cid}/Quizzes/${created._id}/editor`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      await client.deleteQuiz(quizId);
    } catch {
      // ignore
    }
    dispatch(deleteQuiz({ _id: quizId }));
  };

  const handleTogglePublish = async (quiz: any) => {
    const updatedQuiz = { ...quiz, published: !quiz.published };
    let saved = updatedQuiz;
    try {
      saved = await client.updateQuiz(updatedQuiz);
    } catch {
      // ignore
    }
    dispatch(updateQuiz(saved));
  };

  const handlePublishAll = async () => {
    if (!courseQuizzes.length) return;
    const updatedCourseQuizzes = await Promise.all(
      courseQuizzes.map((q: any) =>
        client.updateQuiz({ ...q, published: true })
      )
    );
    const updatedMap = new Map(
      updatedCourseQuizzes.map((q: any) => [q._id, q])
    );
    const next = quizzes.map(
      (q: any) => updatedMap.get(q._id) ?? q
    );
    dispatch(setQuizzes(next));
  };

  const handleUnpublishAll = async () => {
    if (!courseQuizzes.length) return;
    const updatedCourseQuizzes = await Promise.all(
      courseQuizzes.map((q: any) =>
        client.updateQuiz({ ...q, published: false })
      )
    );
    const updatedMap = new Map(
      updatedCourseQuizzes.map((q: any) => [q._id, q])
    );
    const next = quizzes.map(
      (q: any) => updatedMap.get(q._id) ?? q
    );
    dispatch(setQuizzes(next));
  };

  const handleSortByAvailableDate = () => {
    setSortBy("availableDate");
  };

  const handleSortByTitle = () => {
    setSortBy("title");
  };

  return (
    <Container id="wd-quizzes" className="mt-3">
      {/* Search box + header */}
      <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
        {/* Search box on the left */}
        <div className="flex-grow-1" style={{ maxWidth: 360 }}>
          <div className="position-relative">
            <button
              type="button"
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted border-0 bg-transparent p-0"
              onClick={() =>
                document.getElementById("search-input")?.focus()
              }
            >
              <IoMdSearch />
            </button>
            <FormControl
              id="search-input"
              placeholder="Search for quiz"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="ps-5"
            />
          </div>
        </div>

        {/* + Quiz & menu on the right */}
        {isFaculty && (
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="danger"
              className="custom-btn"
              onClick={handleAddQuiz}
            >
              <FaPlus className="me-2 fs-5" />
              Quiz
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="btn p-0 border-0 text-secondary"
                id="wd-quiz-header-menu"
              >
                <FaEllipsisV className="fs-4" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleSortByAvailableDate}>
                  Sort by available date
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSortByTitle}>
                  Sort by quiz name
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handlePublishAll}>
                  Publish all
                </Dropdown.Item>
                <Dropdown.Item onClick={handleUnpublishAll}>
                  Unpublish all
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>

      {isLoading && <p>Loading quizzes...</p>}

      {!isLoading && courseQuizzes.length === 0 && (
        <div className="text-muted mt-3">
          No quizzes yet. Click <strong>+ Quiz</strong> to add the first
          quiz.
        </div>
      )}

      {courseQuizzes.length > 0 && (
        <ListGroup
          className="wd-lessons rounded-0 mt-2"
          id="wd-quiz-list"
        >
          {/* Canvas-style section header with toggle */}
          <ListGroupItem className="p-0 border-gray">
            <div className="p-3 ps-1 bg-secondary d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn btn-link p-0 d-flex align-items-center text-decoration-none text-dark fw-semibold"
                onClick={() =>
                  setShowAssignmentQuizzes(!showAssignmentQuizzes)
                }
              >
                {showAssignmentQuizzes ? (
                  <BsChevronDown className="me-2" />
                ) : (
                  <BsChevronRight className="me-2" />
                )}
                <span>Assignment quizzes</span>
              </button>
            </div>
          </ListGroupItem>

          {/* List items */}
          {showAssignmentQuizzes &&
            filteredQuizzes.map((quiz: any, index: number) => {
              const numberOfQuestions =
                quiz.questions?.length ?? 0;

              const attemptsAllowed =
                quiz.attemptsAllowed ??
                quiz.howManyAttempts ??
                1;
              const attemptText =
                quiz.multipleAttempts && attemptsAllowed > 1
                  ? "Multiple Attempt"
                  : "Single Attempt";

              return (
                <ListGroupItem
                  className="p-3 ps-1 d-flex align-items-start justify-content-between wd-quiz-row"
                  key={quiz._id}
                >
                  <div className="d-flex">
                    {/* Icon */}
                    <IoIosRocket className="me-3 fs-3 text-success" />

                    <div>
                      <Link
                        href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                        className="text-black text-decoration-none fw-semibold"
                      >
                        {`Q${index + 1} ${quiz.title}`}
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
                          {numberOfQuestions} Questions
                        </span>{" "}
                        |{" "}
                        <span className="fw-semibold">
                          {attemptText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {/* Publish / Unpublish icon (only for faculty) */}
                    {isFaculty && (
                      <button
                        type="button"
                        className="btn btn-link p-0 border-0"
                        onClick={() => handleTogglePublish(quiz)}
                        title={
                          quiz.published ? "Unpublish" : "Publish"
                        }
                      >
                        {quiz.published ? (
                          <FaCheckCircle className="text-success fs-4" />
                        ) : (
                          <FaBan className="text-danger fs-4" />
                        )}
                      </button>
                    )}

                    {/* Three dots dropdown (only for faculty) */}
                    {isFaculty && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="link"
                          className="d-flex align-items-center justify-content-center p-1 text-secondary border-0"
                          id={`quiz-actions-${quiz._id}`}
                        >
                          <FaEllipsisV className="text-secondary fs-4" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              router.push(
                                `/Courses/${cid}/Quizzes/${quiz._id}`
                              )
                            }
                          >
                            Edit details
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              handleTogglePublish(quiz)
                            }
                          >
                            {quiz.published
                              ? "Unpublish"
                              : "Publish"}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() =>
                              handleDeleteQuiz(quiz._id)
                            }
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
