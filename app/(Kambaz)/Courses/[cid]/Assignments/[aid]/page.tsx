/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";
import * as client from "../client";

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
  const viewMode = !isFaculty;

  const existingAssignment = assignments.find((a: any) => a._id === aid && a.course === cid);

  const [assignmentState, setAssignmentState] = useState({
    _id: isNew ? `A${Date.now()}` : aid,
    title: "",
    description: "",
    course: cid,
    points: 100,
    start: "",
    end: "",
    availableUntil: "",
    modules: [] as string[]
  });

  useEffect(() => {
    if (existingAssignment && !isNew) {
      setAssignmentState({
        _id: existingAssignment._id,
        title: existingAssignment.title || "",
        description: existingAssignment.description || "",
        course: existingAssignment.course,
        points: existingAssignment.points || 100,
        start: existingAssignment.start || "",
        end: existingAssignment.end || "",
        availableUntil: existingAssignment.availableUntil || "",
        modules: existingAssignment.modules || []
      });
    }
  }, [existingAssignment, isNew, cid]);

  const handleInputChange = (field: string, value: any) => {
    setAssignmentState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedModules = selectedOptions.map(option => option.value);
    setAssignmentState(prev => ({
      ...prev,
      modules: selectedModules
    }));
  };

  const onCreateAssignment = async () => {
    try {
      const newAssignment = await client.createAssignmentForCourse(cid, assignmentState);
      dispatch(addAssignment(newAssignment));
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  };

  const onUpdateAssignment = async () => {
    try {
      const updatedAssignment = await client.updateAssignment(assignmentState);
      dispatch(updateAssignment(updatedAssignment));
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isNew && !existingAssignment) {
    return (
      <Container className="mb-3 p-3">
        <h3>Assignment not found</h3>
        <Link href={`/Courses/${cid}/Assignments`} className="btn btn-secondary">
          Back to Assignments
        </Link>
      </Container>
    );
  }

  return (
    <Container id="wd-assignments-editor" className="p-3">
      <Form>
        <div className="mb-3">
          <Form.Label htmlFor="wd-name"><strong>Assignment Name</strong></Form.Label>
          <Form.Control
            id="wd-name"
            type="text"
            value={assignmentState.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            readOnly={viewMode}
            placeholder="Enter assignment name"
          />
        </div>

        <div className="mb-3">
          <Form.Label htmlFor="wd-description"><strong>Description</strong></Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            value={assignmentState.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            readOnly={viewMode}
            placeholder="Enter assignment description"
          />
        </div>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-points" className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              id="wd-points"
              type="number"
              value={assignmentState.points}
              onChange={(e) => handleInputChange("points", parseInt(e.target.value) || 0)}
              readOnly={viewMode}
            />
          </Col>
        </Row>

        {!viewMode && (
          <Row className="mb-3">
            <Form.Label column sm={3} htmlFor="wd-modules" className="text-end">
              Modules
            </Form.Label>
            <Col sm={9}>
              <Form.Select
                id="wd-modules"
                multiple
                value={assignmentState.modules}
                onChange={handleModuleChange}
                style={{ height: 'auto' }}
              >
                <option value="M1">Module 1</option>
                <option value="M2">Module 2</option>
                <option value="M3">Module 3</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl (or Cmd on Mac) to select multiple modules
              </Form.Text>
              {assignmentState.modules.length > 0 && (
                <div className="mt-2">
                  <small>
                    <strong>Selected modules:</strong> {assignmentState.modules.join(", ")}
                  </small>
                </div>
              )}
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">Availability</Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <Form.Label htmlFor="wd-start"><strong>Start</strong></Form.Label>
                <Form.Control
                  id="wd-start"
                  type="datetime-local"
                  value={toLocalInput(assignmentState.start)}
                  onChange={(e) => handleInputChange("start", e.target.value)}
                  readOnly={viewMode}
                />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="wd-end"><strong>End</strong></Form.Label>
                <Form.Control
                  id="wd-end"
                  type="datetime-local"
                  value={toLocalInput(assignmentState.end)}
                  onChange={(e) => handleInputChange("end", e.target.value)}
                  readOnly={viewMode}
                />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="wd-available-until"><strong>Available Until</strong></Form.Label>
                <Form.Control
                  id="wd-available-until"
                  type="datetime-local"
                  value={toLocalInput(assignmentState.availableUntil)}
                  onChange={(e) => handleInputChange("availableUntil", e.target.value)}
                  readOnly={viewMode}
                />
              </div>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel}>
            {viewMode ? "Back" : "Cancel"}
          </Button>
          {!viewMode && (
            <Button 
              variant="danger" 
              onClick={isNew ? onCreateAssignment : onUpdateAssignment}
              disabled={!assignmentState.title.trim()}
            >
              {isNew ? "Create" : "Save"}
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
}