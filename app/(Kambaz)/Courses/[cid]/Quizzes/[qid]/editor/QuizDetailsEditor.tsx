/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

interface QuizDetailsEditorProps {
  quiz: any;
  onSave: (quiz: any) => void;
  onSaveAndPublish: (quiz: any) => void;
  onCancel: () => void;
}

const toLocalInput = (value?: string) => {
  if (!value) return "";
  return value.includes("T")
    ? value.slice(0, 16)
    : new Date(value).toISOString().slice(0, 16);
};

export default function QuizDetailsEditor({
  quiz,
  onSave,
  onSaveAndPublish,
  onCancel,
}: QuizDetailsEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quizType: "Graded Quiz",
    assignmentGroup: "QUIZZES",
    shuffleAnswers: false,
    timeLimit: 20,
    hasTimeLimit: false,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "Immediately",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableDate: "",
    untilDate: "",
  });

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || "",
        description: quiz.description || "",
        quizType: quiz.quizType || "Graded Quiz",
        assignmentGroup: quiz.assignmentGroup || "QUIZZES",
        shuffleAnswers: quiz.shuffleAnswers || false,
        timeLimit: quiz.timeLimit || 20,
        hasTimeLimit: (quiz.timeLimit && quiz.timeLimit > 0) || false,
        multipleAttempts: quiz.multipleAttempts || false,
        howManyAttempts: quiz.howManyAttempts || 1,
        showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
        accessCode: quiz.accessCode || "",
        oneQuestionAtATime: quiz.oneQuestionAtATime !== undefined ? quiz.oneQuestionAtATime : true,
        webcamRequired: quiz.webcamRequired || false,
        lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
        dueDate: toLocalInput(quiz.dueDate),
        availableDate: toLocalInput(quiz.availableDate),
        untilDate: toLocalInput(quiz.untilDate),
      });
    }
  }, [quiz]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({ ...quiz, ...formData, timeLimit: formData.hasTimeLimit ? formData.timeLimit : 0 });
  };

  const handleSaveAndPublish = () => {
    onSaveAndPublish({ ...quiz, ...formData, timeLimit: formData.hasTimeLimit ? formData.timeLimit : 0 });
  };

  return (
    <div className="quiz-details-editor">
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Unnamed Quiz"
          style={{ fontSize: "16px" }}
        />
      </Form.Group>

      {/* Quiz Instructions - Simple Textarea (since WYSIWYG needs special setup) */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Quiz Instructions:</Form.Label>
        <div className="border rounded" style={{ minHeight: "200px", backgroundColor: "#fafafa", padding: "10px" }}>
          <Form.Control
            as="textarea"
            rows={6}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter quiz instructions..."
            style={{ border: "none", backgroundColor: "transparent", resize: "none" }}
          />
          <div className="text-end mt-2">
            <small className="text-muted">0 words</small>
          </div>
        </div>
      </Form.Group>

      {/* Quiz Type */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Quiz Type</Form.Label>
        <Form.Select
          value={formData.quizType}
          onChange={(e) => handleChange("quizType", e.target.value)}
        >
          <option value="Graded Quiz">Graded Quiz</option>
          <option value="Practice Quiz">Practice Quiz</option>
          <option value="Graded Survey">Graded Survey</option>
          <option value="Ungraded Survey">Ungraded Survey</option>
        </Form.Select>
      </Form.Group>

      {/* Assignment Group */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Assignment Group</Form.Label>
        <Form.Select
          value={formData.assignmentGroup}
          onChange={(e) => handleChange("assignmentGroup", e.target.value)}
        >
          <option value="QUIZZES">QUIZZES</option>
          <option value="EXAMS">EXAMS</option>
          <option value="ASSIGNMENTS">ASSIGNMENTS</option>
          <option value="PROJECT">PROJECT</option>
        </Form.Select>
      </Form.Group>

      {/* Options Section */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">Options</h6>
        
        {/* Shuffle Answers */}
        <Form.Check 
          type="checkbox"
          id="shuffleAnswers"
          label="Shuffle Answers"
          checked={formData.shuffleAnswers}
          onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
          className="mb-2"
        />

        {/* Time Limit */}
        <div className="mb-2">
          <Form.Check 
            type="checkbox"
            id="hasTimeLimit"
            label="Time Limit"
            checked={formData.hasTimeLimit}
            onChange={(e) => handleChange("hasTimeLimit", e.target.checked)}
          />
          {formData.hasTimeLimit && (
            <div className="d-flex align-items-center mt-2 ms-4">
              <Form.Control
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleChange("timeLimit", parseInt(e.target.value) || 0)}
                min="1"
                style={{ width: "80px" }}
                className="me-2"
              />
              <span>Minutes</span>
            </div>
          )}
        </div>

        {/* Multiple Attempts */}
        <div className="mb-2">
          <Form.Check 
            type="checkbox"
            id="multipleAttempts"
            label="Allow Multiple Attempts"
            checked={formData.multipleAttempts}
            onChange={(e) => handleChange("multipleAttempts", e.target.checked)}
          />
        </div>
      </div>

      {/* Assign Section */}
      <div className="border rounded p-3 mb-4" style={{ backgroundColor: "#f9f9f9" }}>
        <h6 className="fw-semibold mb-3">Assign</h6>
        
        {/* Assign to */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Assign to</Form.Label>
          <div className="border rounded p-2 bg-white">
            <span className="badge bg-secondary">Everyone ✕</span>
          </div>
        </Form.Group>

        {/* Due Date */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Due</Form.Label>
          <Form.Control
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </Form.Group>

        {/* Available From and Until */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="fw-semibold">Available from</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.availableDate}
              onChange={(e) => handleChange("availableDate", e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Form.Label className="fw-semibold">Until</Form.Label>
            <Form.Control
              type="datetime-local"
              value={formData.untilDate}
              onChange={(e) => handleChange("untilDate", e.target.value)}
            />
          </Col>
        </Row>

        <div className="text-center mt-3">
          <Button variant="link" className="text-decoration-none">
            + Add
          </Button>
        </div>
      </div>

      {/* Action Buttons - Canvas Style */}
      <div className="d-flex justify-content-end gap-2 pt-3 border-top">
        <Button 
          variant="light" 
          onClick={onCancel}
          className="px-4"
          style={{ border: "1px solid #ccc" }}
        >
          Cancel
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
          className="px-4"
        >
          Save
        </Button>
      </div>
    </div>
  );
}