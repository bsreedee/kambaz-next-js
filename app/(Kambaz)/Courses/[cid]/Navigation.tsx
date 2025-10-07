"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/Courses/1234/Home", id: "wd-course-home-link", label: "Home" },
    { href: "/Courses/1234/Modules", id: "wd-course-modules-link", label: "Modules" },
    { href: "/Courses/1234/Piazza", id: "wd-course-piazza-link", label: "Piazza" },
    { href: "/Courses/1234/Zoom", id: "wd-course-zoom-link", label: "Zoom" },
    { href: "/Courses/1234/Assignments", id: "wd-course-assignments-link", label: "Assignments" },
    { href: "/Courses/1234/Quizzes", id: "wd-course-quizzes-link", label: "Quizzes" },
    { href: "/Courses/1234/Grades", id: "wd-course-grades-link", label: "Grades" },
    { href: "/Courses/1234/People", id: "wd-course-people-link", label: "People" },
  ];

  const getIsActive = (linkHref: string) => {
    if (!links.some(link => link.href === pathname)) {
      return linkHref === "/Courses/1234/Home";
    }
    return pathname === linkHref;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          id={link.id}
          className={`list-group-item border-0 ${
            getIsActive(link.href) ? "active text-black" : "text-danger"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

