"use client";

import { useState } from "react";
import { FaInbox } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { TfiDashboard } from "react-icons/tfi";
import { GiBookshelf } from "react-icons/gi";
import { MdCalendarMonth, MdComputer } from "react-icons/md";

export default function KambazNavigation() {
  const [activeId, setActiveId] = useState("wd-account-link");

  const links = [
    { href: "/Account", id: "wd-account-link", label: "Account", icon: <VscAccount /> },
    { href: "/Dashboard", id: "wd-dashboard-link", label: "Dashboard", icon: <TfiDashboard /> },
    { href: "/Dashboard", id: "wd-courses-link", label: "Courses", icon: <GiBookshelf /> },
    { href: "/Calendar", id: "wd-calendar-link", label: "Calendar", icon: <MdCalendarMonth /> },
    { href: "/Inbox", id: "wd-inbox-link", label: "Inbox", icon: <FaInbox /> },
    { href: "/Labs", id: "wd-labs-link", label: "Labs", icon: <MdComputer /> },
  ];

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 120 }}
     
      id="wd-kambaz-navigation">
      <ListGroupItem className="bg-black border-0 text-center" as="a" target="_blank"
        href="https://www.northeastern.edu/" id="wd-neu-link">
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>

      {links.map((link) => {
        const isActive = activeId === link.id;

        const isAccount = link.id === "wd-account-link";
        const bgColor = isActive ? "bg-white" : "bg-black";
        const textColor = isActive
          ? isAccount
            ? "text-danger"
            : "text-danger"
          : isAccount
            ? "text-white"
            : "text-danger";

        return (
          <ListGroupItem
            key={link.id}
            className={`border-0 text-center ${bgColor}`}
            onClick={() => setActiveId(link.id)}
          >
            <Link
              href={link.href}
              id={link.id}
              className={`text-decoration-none d-block ${textColor}`}
            >
              <div className="fs-1">{link.icon}</div>
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
