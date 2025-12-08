/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaTrash, FaCheck, FaCheckSquare } from "react-icons/fa";

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
    correctAnswer: null as any,
    blanks: [] as string[],
    allowMultipleAnswers: false,
  });

  useEffect(() => {
    // Parse correctAnswer to handle both single and multiple answers
    const correctAnswer = question.correctAnswer;
    const allowMultipleAnswers = Array.isArray(correctAnswer) || question.allowMultipleAnswers || false;
    
    // Parse choices with correct status
    let choices = [];
    if (question.choices && question.choices.length > 0) {
      if (typeof question.choices[0] === 'string') {
        // Convert string choices to objects
        choices = question.choices.map((text: string) => ({
          text,
          correct: allowMultipleAnswers 
            ? (Array.isArray(correctAnswer) ? correctAnswer.includes(text) : correctAnswer === text)
            : (correctAnswer === text)
        }));
      } else {
        choices = question.choices;
      }
    }

    setFormData({
      title: question.title || "Question",
      type: question.type || "multiple-choice",
      points: question.points || 4,
      question: question.question || "",
      choices: choices.length > 0
        ? choices
        : [
            { text: "", correct: true },
            { text: "", correct: false },
            { text: "", correct: false },
          ],
      correctAnswer: correctAnswer !== undefined ? correctAnswer : null,
      blanks: question.blanks && question.blanks.length > 0 ? question.blanks : [""],
      allowMultipleAnswers: allowMultipleAnswers,
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
      allowMultipleAnswers: false, // Reset for non-multiple choice
    };

    switch (newType) {
      case "multiple-choice":
        resetData.choices = [
          { text: "", correct: true },
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
    if (formData.allowMultipleAnswers) {
      // Toggle this choice's correctness
      setFormData((prev) => ({
        ...prev,
        choices: prev.choices.map((choice, i) =>
          i === index ? { ...choice, correct: !choice.correct } : choice
        ),
      }));
    } else {
      // Single answer mode - set only this one as correct
      setFormData((prev) => ({
        ...prev,
        choices: prev.choices.map((choice, i) =>
          i === index ? { ...choice, correct: true } : { ...choice, correct: false }
        ),
      }));
    }
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

    // For multiple choice
    if (payload.type === "multiple-choice") {
      if (payload.allowMultipleAnswers) {
        // Store array of correct answers
        const correctChoices = payload.choices
          .filter((c: any) => c.correct)
          .map((c: any) => c.text || "");
        payload.correctAnswer = correctChoices;
      } else {
        // Single correct answer
        const correctChoice = payload.choices.find((c: any) => c.correct);
        payload.correctAnswer = correctChoice ? (correctChoice.text || "") : null;
      }
    }

    // For fill-in-blank
    if (payload.type === "fill-in-blank") {
      payload.correctAnswer = payload.blanks;
    }

    onSave(payload);
  };

  return (
    <div className="border rounded p-4 bg-white mb-3" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      {/* Question Header */}
      <div className="row mb-3">
        <div className="col-md-4">
          <Form.Control
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Question Title"
          />
        </div>
        <div className="col-md-5">
          <Form.Select
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="fill-in-blank">Fill in the Blanks</option>
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
          "Enter your question and multiple answers, then select the one correct answer (or multiple if enabled)."}
        {formData.type === "true-false" &&
          "Enter your question text, then select if True or False is the correct answer."}
        {formData.type === "fill-in-blank" &&
          "Enter your question with blanks marked with numbers to answer the question"}
      </p>

      {/* Question Text */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Question:</Form.Label>
        <div className="border rounded" style={{ backgroundColor: "#fafafa" }}>
          <Form.Control
            as="textarea"
            rows={4}
            value={formData.question}
            onChange={(e) => handleChange("question", e.target.value)}
            placeholder={
              formData.type === "fill-in-blank"
                ? 'Example: "The ___1___ is the largest planet, and ___2___ is the smallest."'
                : "Enter your question"
            }
            style={{ border: "none", resize: "none" }}
            className="p-3"
          />
        </div>
      </Form.Group>

      {/* MULTIPLE CHOICE */}
      {formData.type === "multiple-choice" && (
        <div className="mb-4">
          <div className="mb-3">
            <Form.Check
              type="checkbox"
              id="allowMultipleAnswers"
              label="Allow multiple correct answers"
              checked={formData.allowMultipleAnswers}
              onChange={(e) => handleChange("allowMultipleAnswers", e.target.checked)}
            />
          </div>
          
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
                    {formData.allowMultipleAnswers ? (
                      choice.correct ? (
                        <FaCheckSquare className="text-success" style={{ fontSize: "20px" }} />
                      ) : (
                        <span style={{ color: "#ccc", fontSize: "20px" }}>□</span>
                      )
                    ) : (
                      choice.correct ? (
                        <FaCheck className="text-success" style={{ fontSize: "20px" }} />
                      ) : (
                        <span style={{ color: "#ccc", fontSize: "20px" }}>○</span>
                      )
                    )}
                  </button>
                </div>
                <div className="flex-grow-1">
                  <div className="small text-muted mb-1">
                    {choice.correct ? "Correct Answer" : "Possible Answer"}
                    {formData.allowMultipleAnswers && choice.correct && " (Multiple allowed)"}
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

      {/* FILL IN THE BLANKS */}
      {formData.type === "fill-in-blank" && (
        <div className="mb-4">
          {/* <Alert variant="info" className="mb-3">
            <strong>Partial Grading:</strong> Students earn points for each correct blank. 
            For {formData.blanks.length} blank{formData.blanks.length > 1 ? 's' : ''} worth {formData.points} total points, 
            each blank is worth <strong>{(formData.points / Math.max(1, formData.blanks.length)).toFixed(2)} points</strong>.
          </Alert> */}
          
          <Form.Label className="fw-semibold">Correct Answers for Each Blank:</Form.Label>
          <p className="text-muted small">
            Define the correct answer for blanks. Answers are case-insensitive.
          </p>
          {formData.blanks.map((blank, index) => (
            <div key={index} className="mb-3 border rounded p-3 bg-light">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fw-semibold">Blank {index + 1}</span>
                {formData.blanks.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-link text-secondary p-0 ms-auto"
                    onClick={() => handleRemoveBlank(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <Form.Control
                type="text"
                value={blank}
                onChange={(e) => handleBlankChange(index, e.target.value)}
                placeholder={`Correct answer for blank [${index + 1}]`}
              />
              <Form.Text className="text-muted">
                Worth {(formData.points / Math.max(1, formData.blanks.length)).toFixed(2)} points
              </Form.Text>
            </div>
          ))}
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={handleAddBlank}
              className="text-danger text-decoration-none"
            >
              + Add Another Blank
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
          <Button 
            variant="outline-danger" 
            onClick={onDelete}
          >
            Delete Question
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