"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function CourseNavigation() {
  const pathname = usePathname();
  const courseId = pathname.split("/")[2];
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    
    <ListGroup
      className="wd list-group fs-5 rounded-0"
      style={{ width: 180 }}
      id="wd-course-navigation"
    >
      {links.map((label) => (
        <ListGroupItem key={label} as={Link}
        href={`/Courses/${courseId}/${label}`}
        className={`list-group-item border-0 ${
          pathname.includes(label) ? "active text-black" : "text-danger"
          }`}
          >
        {label}
        </ListGroupItem>
        ))}
      </ListGroup>
  );
}