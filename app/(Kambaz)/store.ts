import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
const store = configureStore({
 reducer: { coursesReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;