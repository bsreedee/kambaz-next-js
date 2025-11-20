/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment, setAssignments } from "../Assignments/reducer";
import Link from "next/link";
import {
  Badge,
  Button,
  Container,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FaPlus, FaUserGroup } from "react-icons/fa6";
import { MdAssignment } from "react-icons/md";
import "./assignmentstyles.css";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaTrash } from "react-icons/fa";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentDeleter from "./AssignmentDeleter";
import { useEffect, useState } from "react";
import * as client from "./client";
const formatDateToMonthDayYear = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: any) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: any) => state.accountReducer
  );
  const isFaculty =
    (currentUser as any)?.role === "FACULTY"

  const fetchAssignments = async () => {
    try {
      const data = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(data));
    } catch {
    }
  };
  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);
  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );
  const handleAddAssignment = () => {
    router.push(`/Courses/${cid}/Assignments/new`);
  };
  const [show, setShow] = useState(false);
  const [aid, setAid] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = (assignmentId: string) => {
    setAid(assignmentId);
    setShow(true);
  };
  const onRemoveAssignment = async (assignmentId: string) => {
    try {
      await client.deleteAssignment(assignmentId);
    } catch {
    }
    dispatch(deleteAssignment(assignmentId));
  };
  return (
  <Container id="wd-assignments">
      <div className="d-flex align-items-center gap-2">
        <InputGroup style={{ maxWidth: "250px" }}>
          <Button variant="outline-secondary" className="btn">
            <FaSearch className="fs-5" />
          </Button>
          <Form.Control
            type="text"
            placeholder="Search..."
            id="wd-search-assignment"
            className="search-input"
          />
        </InputGroup>
        {currentUser?.role === "FACULTY" && (
          <>
        <Button variant="outline-secondary" className="custom-btn ms-auto">
          <FaUserGroup className="me-2 fs-5" />
          <FaPlus className="me-2 fs-5" />
          Group
        </Button>
        
          <Button
            variant="danger"
            className="custom-btn"
            onClick={handleAddAssignment}
          >
            <MdAssignment className="me-2 fs-5" />
            <FaPlus className="me-2 fs-5" />
            Assignment
          </Button>
        </>
        )}
      </div>
      <br />
      <ListGroup className="wd-lessons rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-assignment p-0 mb-5 fs-5 border-gray" />
        <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <strong>ASSIGNMENTS</strong>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border percentage-badge">
              40% of Total
            </span>
            {isFaculty && <AssignmentControlButtons />}
          </div>
        </div>
        {courseAssignments.map((assignment: any, index: number) => {
          const available =
            assignment.availableDate || assignment.start || assignment.open;
          const due = assignment.dueDate || assignment.end || assignment.due;
          const modulesLabel = assignment.modules && assignment.modules.length > 0
            ? assignment.modules.length > 1
              ? "Multiple Modules"
              : "Single Module"
            : "No Module";
          return (
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
                    <span className="text-danger fw-semibold">
                      {modulesLabel}
                    </span>{" "}
                    |<span className="fw-semibold"> Not available until </span>
                    {formatDateToMonthDayYear(
                      typeof available === "string"
                        ? available
                        : available?.toString()
                    )}{" "}
                    | <span className="fw-semibold">Due</span>{" "}
                    {formatDateToMonthDayYear(
                      typeof due === "string" ? due : due?.toString()
                    )}{" "}
                    | <span className="fw-semibold">
                      {assignment.points ?? 100} pts
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <AssignmentControlButtons />
                {isFaculty && (
                  <FaTrash
                    className="text-danger me-2 fs-4"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShow(assignment._id)}
                    title="Delete Assignment"
                  />
                )}
              </div>
            </ListGroupItem>
          );
        })}
      </ListGroup>
      <AssignmentDeleter
        show={show}
        handleClose={handleClose}
        dialogTitle="Delete Assignment"
        assignmentName={
          courseAssignments.find((a: any) => a._id === aid)?.title || ""
        }
        deleteAssignment={() => onRemoveAssignment(aid)}
      />
    </Container>
  );
}
