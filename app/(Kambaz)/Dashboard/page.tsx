/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Courses/enrollmentsReducer";
import { RootState } from "../store";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/blank_image.jpg", description: "New Description"
  });
  
  if (!currentUser) {
    return (
      <div className="p-4 text-center">
        <h2>Please sign in to view your courses.</h2>
        <Link href="/Account/Signin" className="btn btn-danger mt-3">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const displayedCourses = showAllCourses 
    ? courses 
    : courses.filter((course) =>
        enrollments.some(
          (enrollment: any) =>
            enrollment.user === (currentUser as any)._id &&
            enrollment.course === course._id
        )
      );

  const isUserEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === (currentUser as any)._id &&
        enrollment.course === courseId
    );
  };

  const handleEnrollment = (courseId: string) => {
    if (isUserEnrolled(courseId)) {
      dispatch(unenrollUser({ userId: (currentUser as any)._id, courseId }));
    } else {
      dispatch(enrollUser({ userId: (currentUser as any)._id, courseId }));
    }
  };

  const canAccessCourse = (courseId: string) => {
    return isFaculty || isUserEnrolled(courseId);
  };

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <Button 
          variant="primary"
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="ms-3"
        >
          {showAllCourses ? "Show My Courses" : "Show All Courses"}
        </Button>
      </div>
      <hr />
      
      {isFaculty && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end"
        id="wd-add-new-course-click"
        onClick={() => {
          const newCourse = {
            ...course,
            _id: uuidv4()
          };
          
          dispatch(addNewCourse(newCourse));
          
          dispatch(enrollUser({ 
            userId: (currentUser as any)._id, 
            courseId: newCourse._id 
          }));
        }} style={{backgroundColor: "green"}} > 
          Add 
        </button>
            <button className="btn btn-warning float-end me-2"
                    onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
              Update 
            </button>
          </h5>
          <br />
          <FormControl value={course.name} className="mb-2" 
            onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
          <FormControl as="textarea" value={course.description} rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value }) }/>
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "My Courses"} ({displayedCourses.length})
      </h2>
      <hr />
      
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course) => {
            const enrolled = isUserEnrolled(course._id);
            const canAccess = canAccessCourse(course._id);
            
            return (
              <Col className="wd-dashboard-course" style={{ width: "300px" }} key={course._id}>
                <Card>
                  {canAccess ? (
                    <Link href={`/Courses/${course._id}/Home`} 
                          className="wd-dashboard-course-link text-decoration-none text-dark">
                      <CardImg variant="top" src={`/images/${course.image}`} width="100%" height={160} alt={course.name}/>
                      <CardBody className="card-body">
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
                        <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>
                          {course.description}
                        </CardText>
                        <Button variant="primary"> Go </Button>
                        
                        {!isFaculty && (
                          <Button 
                            variant={enrolled ? "danger" : "success"}
                            className="float-end"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEnrollment(course._id);
                            }}
                          >
                            {enrolled ? "Unenroll" : "Enroll"}
                          </Button>
                        )}
                        
                        {isFaculty && (
                          <>
                            <button id="wd-edit-course-click"
                              onClick={(event) => {
                                event.preventDefault();
                                setCourse(course);
                              }}
                              className="btn btn-warning me-2 float-end" style={{marginLeft: "5px"}}>
                              Edit
                            </button>
                            <button onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }} className="btn btn-danger float-end"
                            id="wd-delete-course-click" style={{marginLeft: "5px"}}>
                              Delete
                            </button>
                          </>
                        )}
                      </CardBody>
                    </Link>
                  ) : (
                    // Course card for non-enrolled students when showing all courses
                    <div className="wd-dashboard-course-link text-decoration-none text-dark">
                      <CardImg variant="top" src={`/images/${course.image}`} width="100%" height={160} alt={course.name}/>
                      <CardBody className="card-body">
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
                        <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>
                          {course.description}
                        </CardText>
                        <Button 
                          variant="success"
                          onClick={() => handleEnrollment(course._id)}
                        >
                          Enroll
                        </Button>
                      </CardBody>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}