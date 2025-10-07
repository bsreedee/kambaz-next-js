import Link from "next/link";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus, FaUserGroup } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import './assignmentstyles.css';
import { BsGripVertical } from "react-icons/bs";
import AssignmentControlButtons from "./AssignmentControlButtons";

export default function Assignments() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2">
      <Form.Control type="text"  placeholder="Search..." id="wd-search-assignment" className="search-input" style={{ maxWidth: "250px"}}/>
      <Button variant="outline-secondary" className="custom-btn ms-auto" // Key change: ms-auto pushes this and subsequent items to the right
       ><FaUserGroup className="me-2 fs-5" />  <FaPlus className="me-2 fs-5" />  Group
      </Button>
      <Button variant="danger" className="custom-btn">
        <MdAssignment className="me-2 fs-5" />  <FaPlus className="me-2 fs-5" /> Assignment
      </Button>
</div> <br/>
      
      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroupItem className="wd-assignment p-0 mb-5 fs-5 border-gray"></ListGroupItem> 
        <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <strong>ASSIGNMENTS</strong>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border percentage-badge">40% of Total</span>
            <AssignmentControlButtons />
          </div>
        </div>

        <ListGroup className="wd-lessons rounded-0" id="wd-assignment-list">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
              <div className="d-flex">
              <BsGripVertical className="me-3 fs-3 text-secondary" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div>
              <Link href="/Courses/1234/Assignments/123"
                className="wd-assignment-link text-black text-decoration-none fw-semibold"> A1 - ENV + HTML </Link>
                <div className="text-muted small">
                  <span className="text-danger fw-semibold">Multiple Modules</span> |
                  <span className="fw-semibold"> Not available until </span> May 6 at 12:00am | 
                  <span className="fw-semibold"> Due</span> May 13 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <AssignmentControlButtons />
          </ListGroupItem>

          <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
              <div className="d-flex">
              <BsGripVertical className="me-3 fs-3 text-secondary" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div>
              <Link href="/Courses/1234/Assignments/234" 
                className="wd-assignment-link text-black text-decoration-none fw-semibold"> A2 - CSS + BOOTSTRAP </Link>
                <div className="text-muted small">
                  <span className="text-danger fw-semibold">Multiple Modules</span> |
                  <span className="fw-semibold"> Not available until </span> May 18 at 12:00am | 
                  <span className="fw-semibold"> Due</span> May 29 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <AssignmentControlButtons />
          </ListGroupItem>

          <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between">
              <div className="d-flex">
              <BsGripVertical className="me-3 fs-3 text-secondary" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div>
              <Link href="/Courses/1234/Assignments/234" 
                className="wd-assignment-link text-black text-decoration-none fw-semibold"> A3 - JAVASCRIPT + REACT </Link>
                <div className="text-muted small">
                  <span className="text-danger fw-semibold">Multiple Modules</span> |
                  <span className="fw-semibold"> Not available until </span> May 30 at 12:00am | 
                  <span className="fw-semibold"> Due</span> June 9 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <AssignmentControlButtons />
          </ListGroupItem>        
          </ListGroup>
        
      </ListGroup>
    </div>
  );
}
