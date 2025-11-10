/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Button, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";

const toLocalInput = (value?: string) => {
  if (!value) return "";
  return value.includes("T")
    ? value.slice(0, 16)
    : new Date(value).toISOString().slice(0, 16);
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams() as { cid: string; aid: string };
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector((s: RootState) => s.assignmentsReducer);
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);

  const isNew = aid === "new";
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const existing = useMemo(
    () => assignments.find((a: any) => a.course === cid && a._id === aid),
    [assignments, cid, aid]
  );

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    points: existing?.points ?? 100,
    dueDate: existing?.end ?? "",
    availableFrom: existing?.start ?? "",
    availableUntil: existing?.end ?? "",
    assignmentGroup: "assignments",
    displayGradeAs: "percentage",
    submissionType: "online",
    assignTo: "Everyone",
    onlineEntryOptions: {
      textEntry: false,
      websiteUrl: true,
      mediaRecordings: false,
      studentAnnotation: false,
      fileUploads: false,
    },
  });

  const handleSave = () => {
    if (!isFaculty) return; // Students cannot save
    
    if (isNew) {
      dispatch(
        addAssignment({
          title: form.title,
          description: form.description,
          course: cid,
          start: form.availableFrom,
          end: form.dueDate,
          points: form.points,
        } as any)
      );
    } else if (existing) {
      dispatch(
        updateAssignment({
          ...existing,
          title: form.title,
          description: form.description,
          start: form.availableFrom,
          end: form.dueDate,
          points: form.points,
        } as any)
      );
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => router.push(`/Courses/${cid}/Assignments`);

  if (!isNew && !existing) {
    return (
      <div className="mb-3 p-3">
        <h3>Assignment not found</h3>
        <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary">
          Back to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
       
        <div className="mb-3">
          <Form.Label htmlFor="wd-name"><strong>Assignment Name</strong></Form.Label>
          <Form.Control
            id="wd-name"
            type="text"
            value={form.title}
            onChange={(e) => isFaculty && setForm({ ...form, title: e.target.value })}
            readOnly={!isFaculty}
          />
        </div>

        <div className="mb-3">
          <Form.Label htmlFor="wd-description"><strong>Description</strong></Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            value={form.description}
            onChange={(e) => isFaculty && setForm({ ...form, description: e.target.value })}
            readOnly={!isFaculty}
          />
        </div>

      
        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-group" className="text-end">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              id="wd-group"
              value={form.assignmentGroup}
              onChange={(e) => isFaculty && setForm({ ...form, assignmentGroup: e.target.value })}
              disabled={!isFaculty}
            >
              <option value="assignments">ASSIGNMENTS</option>
              <option value="quizzes">QUIZZES</option>
              <option value="exams">EXAMS</option>
              <option value="projects">PROJECTS</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-display-grade" className="text-end">
            Display Grade as
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              id="wd-display-grade"
              value={form.displayGradeAs}
              onChange={(e) => isFaculty && setForm({ ...form, displayGradeAs: e.target.value })}
              disabled={!isFaculty}
            >
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
              <option value="letter">Letter Grade</option>
              <option value="gpa">GPA Scale</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-points" className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              id="wd-points"
              type="number"
              value={form.points}
              onChange={(e) => isFaculty && setForm({ ...form, points: parseInt(e.target.value) || 0 })}
              readOnly={!isFaculty}
            />
          </Col>
        </Row>
       
        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-submission-type" className="text-end">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <Form.Select
                id="wd-submission-type"
                value={form.submissionType}
                onChange={(e) => isFaculty && setForm({ ...form, submissionType: e.target.value })}
                className="mb-3"
                disabled={!isFaculty}
              >
                <option value="online">Online</option>
                <option value="on-paper">On Paper</option>
                <option value="none">No Submission</option>
              </Form.Select>

              <div>
                <strong className="mb-2 d-block">Online Entry Options</strong>
                {[
                  ["textEntry", "Text Entry"],
                  ["websiteUrl", "Website URL"],
                  ["mediaRecordings", "Media Recordings"],
                  ["studentAnnotation", "Student Annotation"],
                  ["fileUploads", "File Uploads"],
                ].map(([key, label]) => (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    id={`wd-entry-${key}`}
                    label={label}
                    checked={(form.onlineEntryOptions as any)[key]}
                    onChange={(e) => isFaculty && setForm({
                      ...form,
                      onlineEntryOptions: {
                        ...form.onlineEntryOptions,
                        [key]: e.target.checked,
                      },
                    })}
                    className="mb-2"
                    disabled={!isFaculty}
                  />
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">Assign</Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <Form.Label htmlFor="wd-assign-to"><strong>Assign to</strong></Form.Label>
                <Form.Control
                  id="wd-assign-to"
                  type="text"
                  value={form.assignTo}
                  onChange={(e) => isFaculty && setForm({ ...form, assignTo: e.target.value })}
                  readOnly={!isFaculty}
                />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="wd-due-date"><strong>Due</strong></Form.Label>
                <Form.Control
                  id="wd-due-date"
                  type="datetime-local"
                  value={toLocalInput(form.dueDate)}
                  onChange={(e) => isFaculty && setForm({ ...form, dueDate: e.target.value })}
                  readOnly={!isFaculty}
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="wd-available-from"><strong>Available from</strong></Form.Label>
                    <Form.Control
                      id="wd-available-from"
                      type="datetime-local"
                      value={toLocalInput(form.availableFrom)}
                      onChange={(e) => isFaculty && setForm({ ...form, availableFrom: e.target.value })}
                      readOnly={!isFaculty}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="wd-available-until"><strong>Until</strong></Form.Label>
                    <Form.Control
                      id="wd-available-until"
                      type="datetime-local"
                      value={toLocalInput(form.availableUntil)}
                      onChange={(e) => isFaculty && setForm({ ...form, availableUntil: e.target.value })}
                      readOnly={!isFaculty}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            {isFaculty ? "Cancel" : "Back"}
          </Button>
          {isFaculty && (
            <Button variant="danger" onClick={handleSave}>Save</Button>
          )}
        </div>
      </Form>
    </div>
  );
}