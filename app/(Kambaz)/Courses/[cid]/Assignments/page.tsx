/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "../Assignments/reducer";
import Link from "next/link";
import { Button, Form, InputGroup, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus, FaUserGroup } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import './assignmentstyles.css';
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaTrash } from "react-icons/fa";
import AssignmentControlButtons from "./AssignmentControlButtons";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const isFaculty = (currentUser as any)?.role === "FACULTY" || (currentUser as any)?.role === "TA" || (currentUser as any)?.role === "ADMIN";

  const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);

  const handleAddAssignment = () => {
    router.push(`/Courses/${cid}/Assignments/new`);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2">
        <InputGroup style={{ maxWidth: "250px" }}>
          <Button variant="outline-secondary" className="btn"> 
            <FaSearch className="fs-5" /> 
          </Button>
          <Form.Control type="text" placeholder="Search..." id="wd-search-assignment" className="search-input"/>
        </InputGroup>
        
        <Button variant="outline-secondary" className="custom-btn ms-auto">
          <FaUserGroup className="me-2 fs-5" />  
          <FaPlus className="me-2 fs-5" />  
          Group
        </Button>
        
        {isFaculty && (
          <Button variant="danger" className="custom-btn" onClick={handleAddAssignment}>
            <MdAssignment className="me-2 fs-5" />  
            <FaPlus className="me-2 fs-5" /> 
            Assignment
          </Button>
        )}
      </div> 
      
      <br/>

      <ListGroup className="wd-lessons rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-assignment p-0 mb-5 fs-5 border-gray"></ListGroupItem>
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <strong>ASSIGNMENTS</strong>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark border percentage-badge">40% of Total</span>
              {isFaculty && <AssignmentControlButtons />}
            </div>
          </div>
        
        
        {courseAssignments.map((assignment, index) => (
          <ListGroupItem 
            className="wd-lesson p-3 ps-1 d-flex align-items-start justify-content-between"
            key={assignment._id}
          >
            <div className="d-flex">
              <BsGripVertical className="me-3 fs-3 text-secondary" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div>
                <Link 
                  href={`/Courses/${cid}/Assignments/${assignment._id}`}
                  className="wd-assignment-link text-black text-decoration-none fw-semibold"
                > 
                  {`A${index + 1} - ${assignment.title}`} 
                </Link>
                <div className="text-muted small">
                  <span className="text-danger fw-semibold">Multiple Modules</span> |
                  <span className="fw-semibold"> Not available until </span> {assignment.start.replace('T', ' ')} | 
                  <span className="fw-semibold"> Due</span> {assignment.end.replace('T', ' ')} | 
                  <span className="fw-semibold"> {assignment.points || 100} pts</span>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <AssignmentControlButtons/>
              {isFaculty && (
                <>
                  <FaTrash 
                    className="text-danger me-2 fs-4" 
                    style={{cursor: "pointer"}}
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    title="Delete Assignment"
                  />
                </>
              )}
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}