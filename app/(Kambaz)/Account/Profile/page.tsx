import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl defaultValue="alice" id="wd-username" placeholder="username" className="wd-username mb-2"/>
      <FormControl defaultValue="123" id="wd-password" placeholder="123" className="wd-password mb-2"/>
      <FormControl defaultValue="Alice" id="wd-firstname" placeholder="First Name" className="wd-firstname mb-2"/>
      <FormControl defaultValue="Wonderland" id="wd-lastname" placeholder="Last Name" className="wd-lastname mb-2"/>
      <FormControl defaultValue="2000-01-01" type="date" id="wd-dob" className="wd-dob mb-2"/>
      <FormControl defaultValue="alice@wonderland.com" type="email" id="wd-email" className="wd-email mb-2"/>
      <FormSelect defaultValue="USER" id="wd-role" className="mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormSelect>
       <Link id="wd-signout-btn" href="Signin" className="btn btn-danger w-100 mb-2">
            Sign out</Link>
    </div>
);}

