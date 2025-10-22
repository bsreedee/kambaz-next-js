/* eslint-disable @next/next/no-img-element */
"use client";

import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { VscAccount } from "react-icons/vsc";
// import { TfiDashboard } from "react-icons/tfi";
// import { GiBookshelf } from "react-icons/gi";
// import { MdCalendarMonth, MdComputer } from "react-icons/md";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { AiOutlineDashboard } from "react-icons/ai";

export default function KambazNavigation() {
    const pathname = usePathname();
    const links = [
      { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard },
      { label: "Courses",   path: "/Dashboard", icon: LiaBookSolid },
      { label: "Calendar",  path: "/Calendar",  icon: IoCalendarOutline },
      { label: "Inbox",     path: "/Inbox",     icon: FaInbox },
      { label: "Labs",      path: "/Labs",             icon: LiaCogSolid },
    ];

  // const links = [
  //   // { path: "/Account", id: "wd-account-link", label: "Account", icon: <VscAccount /> },
  //   { path: "/Dashboard", id: "wd-dashboard-link", label: "Dashboard", icon: AiOutlineDashboard },
  //   { path: "/Dashboard", id: "wd-courses-link", label: "Courses", icon: LiaBookSolid },
  //   { path: "/Calendar", id: "wd-calendar-link", label: "Calendar", icon: IoCalendarOutline },
  //   { path: "/Inbox", id: "wd-inbox-link", label: "Inbox", icon: FaInbox },
  //   { path: "/Labs", id: "wd-labs-link", label: "Labs", icon: LiaCogSolid },
  // ];

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 120 }}
      id="wd-kambaz-navigation"
    >
      <ListGroupItem
        action className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>
       <ListGroupItem as={Link} href="/Account"
        className={`text-center border-0 bg-black
            ${pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"}`}>
        <FaRegCircleUser
          className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
        <br />
        Account
      </ListGroupItem>
      {links.map((link) => (
        <ListGroupItem key={link.label} as={Link} href={link.path}
          className={`bg-black text-center border-0
              ${pathname.includes(link.label) ? "text-danger bg-white" : "text-white bg-black"}`}>
          {link.icon({ className: "fs-1 text-danger"})}
          <br />
          {link.label}
        </ListGroupItem>
      ))}

    </ListGroup>
  );
}
{/* {links.map((link) => {
        let bgColor = "bg-black";
        let textColor = "text-white";
        let iconColor = "text-danger";

        if (link.id === "wd-account-link") {
          iconColor = "text-white";
        } else if (link.id === "wd-dashboard-link") {
          bgColor = "bg-white";
          textColor = "text-danger";
          iconColor = "text-danger";
        }

        return (
          <ListGroupItem
            key={link.id}
            className={`border-0 text-center ${bgColor}`}
          >
            <Link
              href={link.path}
              id={link.id}
              className="text-decoration-none d-block"
            >
              <div className={`fs-1 ${iconColor}`}>{link.icon}</div>
              <div className={textColor}>{link.label}</div>
            </Link>
          </ListGroupItem>
        );
      })} */}