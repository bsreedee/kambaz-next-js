'use client';

import { use } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import assignments from "../../../../Database/assignments.json";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AssignmentEditor(){
  const { cid, aid } = useParams();

  const assignment = assignments.find(a => a.course === cid && a._id === aid);


  return (
    <div id="wd-assignments-editor" className="p-3">
      <Form>
        <div className="mb-3">
          <Form.Label htmlFor="wd-name">
            <strong>Assignment Name</strong>
          </Form.Label>
          <Form.Control id="wd-name" type="text" defaultValue={assignment.title} />
        </div>

        <div className="mb-3">
          <Form.Label htmlFor="wd-description">
            <strong>Description</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            defaultValue={`${assignment.description} The assignment is available online

Submit a link to your Github.
The readme should include the following:
    •⁠  ⁠Your full name
    •⁠  ⁠Your Section
    •⁠  Your NUID
    •⁠  ⁠Links to all relevant source code repositories`}
          />
        </div>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-points" className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control id="wd-points" type="number" defaultValue={100} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-group" className="text-end">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group" defaultValue="assignments">
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
            <Form.Select id="wd-display-grade" defaultValue="percentage">
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
              <option value="letter">Letter Grade</option>
              <option value="gpa">GPA Scale</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-submission-type" className="text-end">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <Form.Select id="wd-submission-type" defaultValue="online" className="mb-3">
                <option value="online">Online</option>
                <option value="on-paper">On Paper</option>
                <option value="none">No Submission</option>
              </Form.Select>

              <div>
                <strong className="mb-2 d-block">Online Entry Options</strong>
                <Form.Check type="checkbox" id="wd-entry-text" label="Text Entry" className="mb-2" />
                <Form.Check type="checkbox" id="wd-entry-url" label="Website URL" defaultChecked className="mb-2" />
                <Form.Check type="checkbox" id="wd-entry-media" label="Media Recordings" className="mb-2" />
                <Form.Check type="checkbox" id="wd-entry-annotation" label="Student Annotation" className="mb-2" />
                <Form.Check type="checkbox" id="wd-entry-upload" label="File Uploads" />
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} className="text-end">
            Assign
          </Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <div className="mb-3">
                <Form.Label htmlFor="wd-assign-to">
                  <strong>Assign to</strong>
                </Form.Label>
                <Form.Control id="wd-assign-to" type="text" defaultValue="Everyone" />
              </div>

              <div className="mb-3">
                <Form.Label htmlFor="wd-due-date">
                  <strong>Due</strong>
                </Form.Label>
                <Form.Control id="wd-due-date" type="datetime-local" defaultValue={assignment.end}/>
              </div>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="wd-available-from">
                      <strong>Available from</strong>
                    </Form.Label>
                    <Form.Control id="wd-available-from" type="datetime-local" defaultValue={assignment.start} />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="wd-available-until">
                      <strong>Until</strong>
                    </Form.Label>
                    <Form.Control id="wd-available-until" type="datetime-local" defaultValue={assignment.end} />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />
        
        <div className="d-flex justify-content-end gap-2">
          <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary">Cancel</Button>
        </Link>
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="danger">Save</Button>
        </Link>

        </div>
      </Form>
    </div>
  );
}