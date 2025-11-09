/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { RootState } from "../store";
import * as db from "../Database";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = db;
  const dispatch = useDispatch();

  
  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
  // const addNewCourse = () => {
  //   const newCourse = { ...course, _id: uuidv4() };
  //   setCourses([...courses, newCourse ]);
  // };
  // const deleteCourse = (courseId: string) => {
  //   setCourses(courses.filter((course) => course._id !== courseId));
  // };
  // const updateCourse = () => {setCourses(
  //     courses.map((c) => {if (c._id === course._id) {return course;} else {return c;}}));};



  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h5>New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={() => dispatch(addNewCourse(course))} style={{backgroundColor: "green"}} > Add </button>

           <button className="btn btn-warning float-end me-2"
                onClick={() => dispatch(updateCourse(course))} id="wd-update-course-click">
          Update </button>

      </h5><br />
      <FormControl value={course.name} className="mb-2" 
      onChange={(e) => setCourse({ ...course, name: e.target.value }) }/>
      <FormControl as="textarea" value={course.description} rows={3}
      onChange={(e) => setCourse({ ...course, description: e.target.value }) }/>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({
        courses.filter((course) =>
          enrollments.some(
            (enrollment) =>
              enrollment.user === (currentUser as any)._id &&
              enrollment.course === course._id
          )
        ).length
      })</h2>
      <hr />
      <div id="wd-dashboard-courses">
      <Row xs={1} md={5} className="g-4">
        {courses
          .filter((course) =>
            enrollments.some(
              (enrollment) =>
                enrollment.user === (currentUser as any)._id &&
                enrollment.course === course._id
            ))
          .map((course) => (
        <Col className="wd-dashboard-course"  style={{ width: "300px" }} key={course._id}>
        <Card>
          <Link href={`/Courses/${course._id}/Home`} 
          className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src={`/images/${course.image}`} width="100%" height={160} alt="React JS"/>
            <CardBody className="card-body">
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>{course.description}</CardText>
              <Button variant="primary"> Go </Button>
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

            </CardBody>
          </Link>
        </Card>
        </Col>
        ))}
      </Row>

      </div>
    </div>
  );
}



        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS5678/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/java.png" width="100%" height={160} alt="Java"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 Java</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Core Java Programming</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS9101/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/python.png" width="100%" height={160} alt="Python"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS9101 Python</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Python for Beginners</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS1121/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/javascript.png" width="100%" height={160} alt="JavaScript"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1121 JavaScript</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Modern JavaScript Essentials</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS3141/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/html_css.jpeg" width="100%" height={160} alt="HTML & CSS"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3141 HTML & CSS</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Web Design Fundamentals</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS4151/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/mongodb.png" width="100%" height={160} alt="MongoDB"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS4151 MongoDB</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>NoSQL Database Essentials</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS5161/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/sql.jpeg" width="100%" height={160} alt="SQL"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5161 SQL</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Relational Database Management</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>

        // <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        // <Card>
        //   <Link href="/Courses/CS6171/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
        //     <CardImg variant="top" src="/images/node.png" width="100%" height={160} alt="nodejs"/>
        //     <CardBody>
        //       <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS6171 Node.js</CardTitle>
        //       <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Backend Development with Node.js</CardText>
        //       <Button>Go</Button>
        //     </CardBody>
        //   </Link>
        // </Card>
        // </Col>
        