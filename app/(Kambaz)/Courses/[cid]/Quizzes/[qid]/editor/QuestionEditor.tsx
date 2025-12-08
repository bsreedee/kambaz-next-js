/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaTrash, FaCheck } from "react-icons/fa";

interface QuestionEditorProps {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
  onDelete,
}: QuestionEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "multiple-choice",
    points: 4,
    question: "",
    choices: [] as any[],
    correctAnswer: null as boolean | null,
    blanks: [] as string[],
  });

  useEffect(() => {
    setFormData({
      title: question.title || "Question",
      type: question.type || "multiple-choice",
      points: question.points || 4,
      question: question.question || "",
      choices: question.choices || [
        { text: "", correct: false },
        { text: "", correct: false },
        { text: "", correct: false },
      ],
      correctAnswer: question.correctAnswer !== undefined ? question.correctAnswer : true,
      blanks: question.blanks || [""],
    });
  }, [question]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (newType: string) => {
    const resetData: any = {
      title: formData.title,
      type: newType,
      points: formData.points,
      question: formData.question,
    };

    switch (newType) {
      case "multiple-choice":
        resetData.choices = [
          { text: "", correct: false },
          { text: "", correct: false },
          { text: "", correct: false },
        ];
        break;
      case "true-false":
        resetData.correctAnswer = true;
        break;
      case "fill-in-blank":
        resetData.blanks = [""];
        break;
    }

    setFormData(resetData);
  };

  // Multiple Choice handlers
  const handleAddChoice = () => {
    setFormData((prev) => ({
      ...prev,
      choices: [...prev.choices, { text: "", correct: false }],
    }));
  };

  const handleRemoveChoice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }));
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) =>
        i === index ? { ...choice, text } : choice
      ),
    }));
  };

  const handleCorrectChoiceChange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) =>
        i === index ? { ...choice, correct: true } : { ...choice, correct: false }
      ),
    }));
  };

  // Fill in the blank handlers
  const handleAddBlank = () => {
    setFormData((prev) => ({
      ...prev,
      blanks: [...prev.blanks, ""],
    }));
  };

  const handleRemoveBlank = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      blanks: prev.blanks.filter((_, i) => i !== index),
    }));
  };

  const handleBlankChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      blanks: prev.blanks.map((blank, i) => (i === index ? value : blank)),
    }));
  };

  const handleSubmit = () => {
  const payload: any = { ...formData };

  // For multiple choice, store the correct choice text in `correctAnswer`
  if (payload.type === "multiple-choice") {
    const correctChoice = payload.choices.find((c: any) => c.correct);
    payload.correctAnswer = correctChoice ? (correctChoice.text || "") : null;
  }

  // For fill-in-blank, use first blank as `correctAnswer` for simple grading
  if (payload.type === "fill-in-blank" && Array.isArray(payload.blanks)) {
    payload.correctAnswer = payload.blanks[0] || "";
  }

  onSave(payload);
};


  return (
    <div className="border rounded p-4 bg-white mb-3" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      {/* Question Header */}
      <div className="row mb-3">
        <div className="col-md-5">
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Question Title"
          />
        </div>
        <div className="col-md-4">
          <Form.Select
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="fill-in-blank">Fill in the Blank</option>
          </Form.Select>
        </div>
        <div className="col-md-3">
          <div className="d-flex align-items-center">
            <span className="me-2">pts:</span>
            <Form.Control
              type="number"
              value={formData.points}
              onChange={(e) => handleChange("points", parseInt(e.target.value) || 0)}
              min="0"
              style={{ width: "70px" }}
            />
          </div>
        </div>
      </div>

      {/* Instruction Text */}
      <p className="text-muted small mb-3">
        {formData.type === "multiple-choice" &&
          "Enter your question and multiple answers, then select the one correct answer."}
        {formData.type === "true-false" &&
          "Enter your question text, then select if True or False is the correct answer."}
        {formData.type === "fill-in-blank" &&
          "Enter your question text, then define all possible correct answers for the blank. Students will see the question followed by a small text box to type their answer."}
      </p>

      {/* Question Text */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Question:</Form.Label>
        <div className="border rounded" style={{ backgroundColor: "#fafafa" }}>
          <div className="p-2 border-bottom bg-light" style={{ fontSize: "12px" }}>
            <span className="me-3">Edit</span>
            <span className="me-3">View</span>
            <span className="me-3">Insert</span>
            <span className="me-3">Format</span>
            <span className="me-3">Tools</span>
            <span className="me-3">Table</span>
          </div>
          <div className="p-2 border-bottom bg-light d-flex align-items-center gap-2" style={{ fontSize: "12px" }}>
            <select className="form-select form-select-sm" style={{ width: "auto" }}>
              <option>12pt</option>
            </select>
            <select className="form-select form-select-sm" style={{ width: "auto" }}>
              <option>Paragraph</option>
            </select>
            <button className="btn btn-sm">
              <strong>B</strong>
            </button>
            <button className="btn btn-sm">
              <em>I</em>
            </button>
            <button className="btn btn-sm">
              <u>U</u>
            </button>
            <span>⋮</span>
          </div>
          <Form.Control
            as="textarea"
            rows={4}
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder="Enter your question"
            style={{ border: "none", resize: "none" }}
            className="p-3"
          />
        </div>
      </Form.Group>

      {/* MULTIPLE CHOICE */}
      {formData.type === "multiple-choice" && (
        <div className="mb-4">
          <Form.Label className="fw-semibold">Answers:</Form.Label>
          {formData.choices.map((choice, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex align-items-start gap-2">
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => handleCorrectChoiceChange(index)}
                    style={{ textDecoration: "none" }}
                  >
                    {choice.correct ? (
                      <FaCheck className="text-success" style={{ fontSize: "20px" }} />
                    ) : (
                      <span style={{ color: "#ccc", fontSize: "20px" }}>○</span>
                    )}
                  </button>
                </div>
                <div className="flex-grow-1">
                  <div className="small text-muted mb-1">
                    {choice.correct ? "Correct Answer" : "Possible Answer"}
                  </div>
                  <Form.Control
                    type="text"
                    value={choice.text}
                    onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                  />
                </div>
                <div className="d-flex gap-2 mt-4">
                  {formData.choices.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-link text-secondary p-0"
                      onClick={() => handleRemoveChoice(index)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={handleAddChoice}
              className="text-danger text-decoration-none"
            >
              + Add Another Answer
            </Button>
          </div>
        </div>
      )}

      {/* TRUE/FALSE */}
      {formData.type === "true-false" && (
        <div className="mb-4">
          <Form.Label className="fw-semibold">Answers:</Form.Label>
          <div className="mb-2 d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => handleChange("correctAnswer", true)}
              style={{ textDecoration: "none" }}
            >
              {formData.correctAnswer === true ? (
                <FaCheck className="text-success" style={{ fontSize: "20px" }} />
              ) : (
                <span style={{ color: "#ccc", fontSize: "20px" }}>○</span>
              )}
            </button>
            <span className="fw-semibold">True</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => handleChange("correctAnswer", false)}
              style={{ textDecoration: "none" }}
            >
              {formData.correctAnswer === false ? (
                <FaCheck className="text-success" style={{ fontSize: "20px" }} />
              ) : (
                <span style={{ color: "#ccc", fontSize: "20px" }}>○</span>
              )}
            </button>
            <span className="fw-semibold">False</span>
          </div>
        </div>
      )}

      {/* FILL IN THE BLANK */}
      {formData.type === "fill-in-blank" && (
        <div className="mb-4">
          <Form.Label className="fw-semibold">Answers:</Form.Label>
          <p className="text-muted small">
            Students will see the question followed by a small text box to type their answer.
          </p>
          {formData.blanks.map((blank, index) => (
            <div key={index} className="mb-2 d-flex align-items-center gap-2">
              <div className="small text-muted" style={{ width: "120px" }}>
                Possible Answer:
              </div>
              <Form.Control
                type="text"
                value={blank}
                onChange={(e) => handleBlankChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                style={{ maxWidth: "300px" }}
              />
              {formData.blanks.length > 1 && (
                <button
                  type="button"
                  className="btn btn-link text-secondary p-0"
                  onClick={() => handleRemoveBlank(index)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={handleAddBlank}
              className="text-danger text-decoration-none"
            >
              + Add Another Answer
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex justify-content-between pt-3 border-top">
        <div className="d-flex gap-2">
          <Button 
            variant="light" 
            onClick={onCancel}
            style={{ border: "1px solid #ccc" }}
          >
            Cancel
          </Button>
        </div>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
        >
          Update Question
        </Button>
      </div>
    </div>
  );
}