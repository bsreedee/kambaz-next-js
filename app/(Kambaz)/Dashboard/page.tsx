import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2>
      <hr />
      <div id="wd-dashboard-courses">

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS1234" className="wd-dashboard-course-link">
            <Image src="/images/react.png" width={200} height={150} alt="React JS"/>
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">Full Stack Software Developer</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5678" className="wd-dashboard-course-link">
            <Image src="/images/java.png" width={200} height={150} alt="Java"/>
            <div>
              <h5>CS5678 Java</h5>
              <p className="wd-dashboard-course-title">Core Java Programming</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS9101" className="wd-dashboard-course-link">
            <Image src="/images/python.png" width={200} height={150} alt="Python"/>
            <div>
              <h5>CS9101 Python</h5>
              <p className="wd-dashboard-course-title">Python for Beginners</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS1121" className="wd-dashboard-course-link">
            <Image src="/images/javascript.png" width={200} height={150} alt="JavaScript"/>
            <div>
              <h5>CS1121 JavaScript</h5>
              <p className="wd-dashboard-course-title">Modern JavaScript Essentials</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS3141" className="wd-dashboard-course-link">
            <Image src="/images/html css.jpeg" width={200} height={150} alt="HTML & CSS"/>
            <div>
              <h5>CS3141 HTML & CSS</h5>
              <p className="wd-dashboard-course-title">Web Design Fundamentals</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS4151" className="wd-dashboard-course-link">
            <Image src="/images/mongodb.png" width={200} height={150} alt="MongoDB"/>
            <div>
              <h5>CS4151 MongoDB</h5>
              <p className="wd-dashboard-course-title">NoSQL Database Essentials</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS5161" className="wd-dashboard-course-link">
            <Image src="/images/sql.jpeg" width={200} height={150} alt="SQL"/>
            <div>
              <h5>CS5161 SQL</h5>
              <p className="wd-dashboard-course-title">Relational Database Management</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        <div className="wd-dashboard-course">
          <Link href="/Courses/CS6171" className="wd-dashboard-course-link">
            <Image src="/images/node.png" width={200} height={150} alt="Node.js"/>
            <div>
              <h5>CS6171 Node.js</h5>
              <p className="wd-dashboard-course-title">Backend Development with Node.js</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}


