/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";

const initialState = {
  enrollments: enrollments,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollUser: (state, { payload: { userId, courseId } }) => {
      const existingEnrollment = state.enrollments.find(
        (e: any) => e.user === userId && e.course === courseId
      );
      if (!existingEnrollment) {
        state.enrollments.push({
          _id: `${userId}_${courseId}`,
          user: userId,
          course: courseId,
          enrolledAt: new Date().toISOString(),
        } as any);
      }
    },
    unenrollUser: (state, { payload: { userId, courseId } }) => {
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === userId && e.course === courseId)
      );
    },
  },
});

export const { enrollUser, unenrollUser } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;