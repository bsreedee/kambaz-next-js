/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../store";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionsEditor";
import * as client from "../../client";
import { updateQuiz } from "../../reducer";
import { Container } from "react-bootstrap";

export default function QuizEditorPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use ref to track latest quiz state
  const quizRef = useRef<any>(null);

  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }
    fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  // Update ref whenever quiz changes
  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  const fetchQuiz = async () => {
    try {
      const data = await client.findQuizById(qid);
      setQuiz(data);
      quizRef.current = data;
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save when switching tabs
  const handleTabChange = async (newTab: "details" | "questions") => {
    if (quizRef.current) {
      try {
        const saved = await client.updateQuiz(quizRef.current);
        setQuiz(saved);
        quizRef.current = saved;
        dispatch(updateQuiz(saved));
      } catch (error) {
        console.error("Error auto-saving:", error);
      }
    }
    setActiveTab(newTab);
  };

  // Update quiz state without saving
  const handleQuizChange = (updatedQuiz: any) => {
    setQuiz(updatedQuiz);
    quizRef.current = updatedQuiz;
  };

  const handleSave = async (updatedQuiz: any) => {
    try {
      const saved = await client.updateQuiz(updatedQuiz);
      setQuiz(saved);
      quizRef.current = saved;
      dispatch(updateQuiz(saved));
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Error saving quiz. Please try again.");
    }
  };

  const handleSaveAndPublish = async (updatedQuiz: any) => {
    try {
      const saved = await client.updateQuiz({ ...updatedQuiz, published: true });
      dispatch(updateQuiz(saved));
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error saving and publishing quiz:", error);
      alert("Error saving and publishing quiz. Please try again.");
    }
  };

  const handleCancel = async () => {
    // Auto-save before canceling
    if (quizRef.current) {
      try {
        await client.updateQuiz(quizRef.current);
      } catch (error) {
        console.error("Error auto-saving before cancel:", error);
      }
    }
    router.push(`/Courses/${cid}/Quizzes/${qid}`);
  };

  if (loading) {
    return (
      <Container className="mt-3">
        <div>Loading quiz editor...</div>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container className="mt-3">
        <div>Quiz not found</div>
      </Container>
    );
  }

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingTop: "20px" }}>
      <Container style={{ maxWidth: "900px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Edit Quiz</h5>
          <div className="d-flex align-items-center gap-3">
            <span><strong>Points:</strong> {totalPoints}</span>
            <span className={`badge ${quiz?.published ? "bg-success" : "bg-secondary"}`}>
              {quiz?.published ? "✓ Published" : "⊝ Not Published"}
            </span>
          </div>
        </div>

        <div className="bg-white border-bottom">
          <div className="d-flex">
            <button
              className={`btn btn-link text-decoration-none px-4 py-3 ${
                activeTab === "details"
                  ? "text-danger border-bottom border-danger border-3"
                  : "text-dark"
              }`}
              onClick={() => handleTabChange("details")}
              style={{ borderRadius: 0, fontWeight: activeTab === "details" ? "600" : "normal" }}
            >
              Details
            </button>
            <button
              className={`btn btn-link text-decoration-none px-4 py-3 ${
                activeTab === "questions"
                  ? "text-danger border-bottom border-danger border-3"
                  : "text-dark"
              }`}
              onClick={() => handleTabChange("questions")}
              style={{ borderRadius: 0, fontWeight: activeTab === "questions" ? "600" : "normal" }}
            >
              Questions
            </button>
          </div>
        </div>

        <div className="bg-white p-4">
          {activeTab === "details" ? (
            <QuizDetailsEditor
              quiz={quiz}
              onSave={handleSave}
              onSaveAndPublish={handleSaveAndPublish}
              onCancel={handleCancel}
              onChange={handleQuizChange}
            />
          ) : (
            <QuizQuestionsEditor
              quiz={quiz}
              onSave={handleSave}
              onSaveAndPublish={handleSaveAndPublish}
              onCancel={handleCancel}
              onChange={handleQuizChange}
            />
          )}
        </div>
      </Container>
    </div>
  );
}