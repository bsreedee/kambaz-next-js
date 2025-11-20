import { createSlice } from "@reduxjs/toolkit";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initialState: { assignments: any[] } = {
    assignments: [],
};
const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments(state, action) {
            state.assignments = action.payload;
        },
        addAssignment(state, action) {
            state.assignments.push(action.payload);
        },
        updateAssignment(state, action) {
            const index = state.assignments.findIndex(
                (assignment) => assignment._id === action.payload._id
            );
            if (index !== -1) {
                state.assignments[index] = action.payload;
            }
        },
        deleteAssignment(state, action) {
            state.assignments = state.assignments.filter(
                (assignment) => assignment._id !== action.payload._id
            );
        },
    },
});

export const {
    setAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;