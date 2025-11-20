/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useRouter } from "next/navigation";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import * as client from "../../../client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PeopleTable() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentCourse } = useSelector(
    (state: any) => state.accountReducer
  );

  const fetchUsersAndEnrollments = async () => {
    try {
      setLoading(true);
      
      // Fetch all users and enrollments for the course
      const [allUsers, courseEnrollments] = await Promise.all([
        client.findAllUsers(),
        client.findEnrollmentsForCourse(cid as string)
      ]);

      // Filter users who are enrolled in this course
      const enrolled = allUsers.filter((usr: any) =>
        courseEnrollments.some(
          (enrollment: any) =>
            String(enrollment.user) === String(usr._id) && enrollment.course === cid
        )
      );

      setEnrolledUsers(enrolled);
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
      setEnrolledUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cid) {
      fetchUsersAndEnrollments();
    }
  }, [cid]);

  if (loading) {
    return <div>Loading enrolled users...</div>;
  }

  return (
    <div id="wd-people-table">
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>User Name</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {enrolledUsers.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName} </span>
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-username">{user.username}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {enrolledUsers.length === 0 && !loading && (
        <div className="text-center p-3">No enrolled users found for this course.</div>
      )}
    </div>
  );
}