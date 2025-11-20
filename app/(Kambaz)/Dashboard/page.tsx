/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";
import * as client from "../Courses/client";
import { addNewCourse, deleteCourse, updateCourse, setCourses,} from "../Courses/reducer";
import {setEnrollments, addEnrollment, removeEnrollment,} from "../Courses/enrollmentsReducer";
import { redirect } from "next/navigation";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Container, FormControl, Row } from "react-bootstrap";

export default function Dashboard() {
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/blankimage.jpg",
    description: "New Description",
  });
  
  const fetchCourses = async () => {
    try {
      const courses = await client.findMyCourses();
      dispatch(setCourses(courses));
      const enrollments = await client.findEnrollmentsForUser(currentUser._id);
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  if (!currentUser) {
    redirect("/Account/Signin");
  }
  const studentView = currentUser.role === "STUDENT";
  const facultyView = currentUser.role === "FACULTY";

  const [showEnrollments, setShowEnrollments] = useState(false);

  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };
  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(
      setCourses(courses.filter((course: any) => course._id !== courseId))
    );
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c: any) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        })
      )
    );
  };

  const onShowEnrollments = async () => {
    setShowEnrollments(!showEnrollments);
    if (!showEnrollments) {
      const allcourses = await client.fetchAllCourses();
      dispatch(setCourses(allcourses));
    } else {
      const mycourses = await client.findMyCourses();
      dispatch(setCourses(mycourses));
    }
  };

  const onAddEnrollment = async (courseId: string) => {
    try {
      console.log("Enrolling user:", currentUser._id, "in course:", courseId);
      
      const newEnrollment = await client.enrollInCourse(
        currentUser._id,
        courseId
      );
      
      console.log("Enrollment response:", newEnrollment);
      
      // Refresh enrollments to get the complete updated list
      const updatedEnrollments = await client.findEnrollmentsForUser(currentUser._id);
      dispatch(setEnrollments(updatedEnrollments));
      
      console.log("Updated enrollments:", updatedEnrollments);
      
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const onRemoveEnrollment = async (enrollmentId: string) => {
    try {
      console.log("Unenrolling with ID:", enrollmentId);
      
      const status = await client.unenrollFromCourse(enrollmentId);
      
      // Refresh enrollments to get the complete updated list
      const updatedEnrollments = await client.findEnrollmentsForUser(currentUser._id);
      dispatch(setEnrollments(updatedEnrollments));
      
      console.log("Unenroll response:", status);
      console.log("Updated enrollments after unenroll:", updatedEnrollments);
      
    } catch (error) {
      console.error("Error unenrolling:", error);
    }
  };

  // Helper function to check enrollment status
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        String(enrollment.user) === String(currentUser._id) &&
        String(enrollment.course) === String(courseId)
    );
  };

  return (
    <Container id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {!studentView && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-success float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
        {studentView && (
          <Button
            variant="primary"
            className="float-end"
            style={{ marginTop: "-4px" }}
            onClick={onShowEnrollments}
          >
            {showEnrollments ? "My Courses" : "Enrollments"}
          </Button>
        )}
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course: any) => (
            <Col
              className="wd-dashboard-course"
              key={course._id}
              style={{ width: "300px" }}
            >
              <Link
                href={`/Courses/${course._id}/Home`}
                className="wd-dashboard-course-link text-decoration-none text-dark"
                onClick={(e) => {
                  if (studentView && !isEnrolled(course._id)) {
                    e.preventDefault();
                  }
                }}
                style={{ textDecoration: 'none' }}
              >
                <Card className="h-100">
                  <CardImg
                    src={course.image}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body d-flex flex-column">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden flex-grow-1"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>
                    
                    {/* Action Buttons - Moved outside the main Link to prevent navigation on button clicks */}
                    <div className="mt-auto">
                      {!showEnrollments && isEnrolled(course._id) && (
                        <Button variant="success" className="w-100">Go</Button>
                      )}
                      
                      {showEnrollments && !isEnrolled(course._id) && (
                        <Button
                          variant="success"
                          className="w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddEnrollment(course._id);
                          }}
                        >
                          Enroll
                        </Button>
                      )}
                      
                      {showEnrollments && isEnrolled(course._id) && (
                        <Button
                          variant="danger"
                          className="w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const enrollment = enrollments.find(
                              (enrollment: any) =>
                                String(enrollment.user) === String(currentUser._id) &&
                                String(enrollment.course) === String(course._id)
                            );
                            if (enrollment) {
                              onRemoveEnrollment(enrollment._id);
                            }
                          }}
                        >
                          Unenroll
                        </Button>
                      )}
                      
                      {facultyView && (
                        <div className="d-flex gap-2 mt-2">
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              onDeleteCourse(course._id);
                            }}
                            className="btn btn-danger flex-fill"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              setCourse(course);
                            }}
                            className="btn btn-warning flex-fill"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}