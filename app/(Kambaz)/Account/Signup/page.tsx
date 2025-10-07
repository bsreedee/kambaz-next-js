import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
       <FormControl id="wd-username" placeholder="username" className="wd-username mb-2"/>
       <FormControl id="wd-password"  type="password" placeholder="password"  className="wd-password mb-2"/>
       <FormControl placeholder="verify password" type="password" className="wd-password-verify mb-2" /><br/>
       <Link href="/Account/Profile" id="wd-signup-btn" className="btn btn-primary w-100 mb-2">
 Sign up </Link>
      <Link  href="Signin" > Sign in </Link>
    </div>
);}
