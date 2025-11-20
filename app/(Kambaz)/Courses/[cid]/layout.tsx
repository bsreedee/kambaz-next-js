"use client";
import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";


export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
 const { courses } = useSelector((state: RootState) => state.coursesReducer);

 const [isNavigationVisible, setIsNavigationVisible] = useState(true);

 const toggleNavigation = () => {
  setIsNavigationVisible(!isNavigationVisible);
};


 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const course = courses.find((course: any) => course._id === cid);

  return (
    <div id="wd-courses">
      <h2 className="text-danger"> 
        <FaAlignJustify className="me-4 fs-4 mb-1" onClick={() => toggleNavigation()} style={{ cursor: "pointer" }}/>
        {cid}
        </h2> <hr />
  <div className="d-flex">
    <div className={isNavigationVisible ? "d-none d-md-block" : "d-none"}>
      <CourseNavigation />
    </div>
    <div className="flex-fill">
      {children}
    </div></div>
</div>

  );
}