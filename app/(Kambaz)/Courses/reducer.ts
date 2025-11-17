/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  courses: courses,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addNewCourse: (state, { payload: course }) => {
      const id = course && course._id ? course._id : uuidv4();
      const newCourse = {
        ...course,
        _id: id,
        image: course?.image || "/blank_image.jpg",
      };
      state.courses = [...state.courses, newCourse] as any;
    },
    deleteCourse: (state, { payload: course }) => {
      state.courses = state.courses.filter((c: any) => c._id !== course._id);
    },
    updateCourse: (state, { payload: updatedCourse }) => {
      state.courses = state.courses.map((course: any) =>
        course._id === updatedCourse._id ? updatedCourse : course
      );
    },
    setCourses: (state, { payload: courses }) => {
     state.courses = courses;
   },
  },
});

export const { addNewCourse, deleteCourse, updateCourse, setCourses } = coursesSlice.actions;
export default coursesSlice.reducer;
