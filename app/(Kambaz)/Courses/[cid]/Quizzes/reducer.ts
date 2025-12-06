import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quizzes: any[];
}

const initialState: QuizState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setQuizzes(state, action: PayloadAction<any[]>) {
      state.quizzes = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addQuiz(state, action: PayloadAction<any>) {
      state.quizzes.push(action.payload);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateQuiz(state, action: PayloadAction<any>) {
      state.quizzes = state.quizzes.map((quiz) =>
        quiz._id === action.payload._id ? action.payload : quiz
      );
    },
    deleteQuiz(state, action: PayloadAction<{ _id: string }>) {
      state.quizzes = state.quizzes.filter(
        (quiz) => quiz._id !== action.payload._id
      );
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;

export default quizzesSlice.reducer;
