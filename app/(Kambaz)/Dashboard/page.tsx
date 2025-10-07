import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2>
      <hr />
      <div id="wd-dashboard-courses">
      <Row xs={1} md={5} className="g-4">

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS1234/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/react.png" width="100%" height={160} alt="React JS"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1234 React JS</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Full Stack Software Developer</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS5678/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/java.png" width="100%" height={160} alt="Java"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5678 Java</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Core Java Programming</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS9101/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/python.png" width="100%" height={160} alt="Python"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS9101 Python</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Python for Beginners</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS1121/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/javascript.png" width="100%" height={160} alt="JavaScript"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS1121 JavaScript</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Modern JavaScript Essentials</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS3141/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/html_css.jpeg" width="100%" height={160} alt="HTML & CSS"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS3141 HTML & CSS</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Web Design Fundamentals</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS4151/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/mongodb.png" width="100%" height={160} alt="MongoDB"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS4151 MongoDB</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>NoSQL Database Essentials</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS5161/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/sql.jpeg" width="100%" height={160} alt="SQL"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS5161 SQL</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Relational Database Management</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

        <Col className="wd-dashboard-course"  style={{ width: "300px" }}>
        <Card>
          <Link href="/Courses/CS6171/Home" className="wd-dashboard-course-link text-decoration-none text-dark">
            <CardImg variant="top" src="/images/node.png" width="100%" height={160} alt="nodejs"/>
            <CardBody>
              <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">CS6171 Node.js</CardTitle>
              <CardText className="wd-dashboard-course-title overflow-hidden" style={{ height: "100px" }}>Backend Development with Node.js</CardText>
              <Button>Go</Button>
            </CardBody>
          </Link>
        </Card>
        </Col>

      </Row>

      </div>
    </div>
  );
}


