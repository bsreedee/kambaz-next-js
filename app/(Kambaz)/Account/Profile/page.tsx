"use client";
import { redirect } from "next/dist/client/components/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import Link from "next/link";
import { Button, FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({});
 const dispatch = useDispatch();
 const { currentUser } = useSelector((state: RootState) => state.accountReducer);
 const fetchProfile = () => {
   if (!currentUser) return redirect("/Account/Signin");
   setProfile(currentUser);
 };
 const signout = () => {
   dispatch(setCurrentUser(null));
   redirect("/Account/Signin");
 };
 useEffect(() => {
   fetchProfile();
 }, []);

  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
       <div>
      <FormControl id="wd-username" placeholder="username" className="wd-username mb-2"
          defaultValue={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value }) }/>
      <FormControl defaultValue={profile.password} placeholder="password"
          id="wd-password" className="wd-password mb-2"
      onChange={(e) => setProfile({ ...profile, password: e.target.value }) }/>
      <FormControl defaultValue={profile.firstName} id="wd-firstname" placeholder="First Name" className="wd-firstname mb-2"
      onChange={(e) => setProfile({ ...profile, firstName: e.target.value }) }/>
      <FormControl defaultValue={profile.lastName} id="wd-lastname" placeholder="Last Name" className="wd-lastname mb-2"
      onChange={(e) => setProfile({ ...profile, lastName: e.target.value }) }/>
      <FormControl defaultValue={profile.dob} type="date" id="wd-dob" className="wd-dob mb-2" placeholder="Date of Birth"
      onChange={(e) => setProfile({ ...profile, dob: e.target.value }) }/>
      <FormControl defaultValue={profile.email} type="email" id="wd-email" placeholder="Email" className="wd-email mb-2"
      onChange={(e) => setProfile({ ...profile, email: e.target.value }) }/>
      <FormSelect defaultValue={profile.role}  id="wd-role" className="mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormSelect>
       <Button onClick={signout} className="w-100 mb-2 btn-danger" id="wd-signout-btn">
           Sign out
         </Button>
       </div>
     )}
   </div>
);}
