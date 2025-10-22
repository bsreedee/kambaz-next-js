"use client"
import { useParams } from "next/navigation";
import assignments from "../../../Database/assignments.json";
import Link from "next/link";
import { Button, Form, InputGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus, FaUserGroup } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import './assignmentstyles.css';
import { BsGripVertical } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import AssignmentControlButtons from "./AssignmentControlButtons";

export default function Assignments() {
  const { cid } = useParams();
  //const courseAssignments = assignments.filter(a => a.course === cid);
  return (
    <div>
      <div className="d-flex align-items-center gap-2">

      <InputGroup style={{ maxWidth: "250px" }}>
        <Button variant="outline-secondary" className="btn"> <FaSearch className="fs-5" /> </Button>
        <Form.Control type="text" placeholder="Search..." id="wd-search-assignment" className="search-input"/>
      </InputGroup>
      
      <Button variant="outline-secondary" className="custom-btn ms-auto" 
       ><FaUserGroup className="me-2 fs-5" />  <FaPlus className="me-2 fs-5" />  Group
      </Button>
      <Button variant="danger" className="custom-btn">
        <MdAssignment className="me-2 fs-5" />  <FaPlus className="me-2 fs-5" /> Assignment
      </Button>
</div> <br/>

            <ListGroup className="wd-lessons rounded-0" id="wd-assignment-list">
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
              {assignments
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((assignment: any) => assignment.course === cid)
                .map((assignment, index) => (
                  <ListGroupItem 
                  className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between"
                    key={assignment._id}>
                      <div className="d-flex">
              <BsGripVertical className="me-3 fs-3 text-secondary" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div>
                <Link href={`/Courses/${cid}/Assignments/${assignment._id}`}
                className="wd-assignment-link text-black text-decoration-none fw-semibold"> {`A${index + 1} - ${assignment.title}`} 
                </Link>
                    <div className="text-muted small">
                      <span className="text-danger fw-semibold">Multiple Modules</span> |
                      <span className="fw-semibold"> Not available until </span> {assignment.start.replace('T', ' ')} | 
                      <span className="fw-semibold"> Due</span> {assignment.end.replace('T', ' ')} | 100 pts
                    </div>
                    </div>
                    </div>
                    <AssignmentControlButtons/>
                  </ListGroupItem>
                ))}
            </ListGroup>
            </div>
  );
}
