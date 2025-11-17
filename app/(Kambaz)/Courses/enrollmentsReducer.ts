import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: { enrollments: any[] } = {
  enrollments: [],
};
const enrollmentsSlice = createSlice({
    name: 'enrollments',
    initialState,
    reducers: {
        setEnrollments: (state, { payload: enrollments }) => {
            state.enrollments = enrollments;
        },
        addEnrollment: (state, {payload: enrollment}) => {
            state.enrollments = [...state.enrollments, enrollment];
        },
        removeEnrollment: (state, {payload: enrollment}) => {
            state.enrollments = state.enrollments.filter(e => e._id !== enrollment._id);
        }
    }
});
export const { setEnrollments, addEnrollment, removeEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;