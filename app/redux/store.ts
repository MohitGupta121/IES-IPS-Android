import { configureStore } from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import commonReducer from "./common/reducer";
import staffReducer from "./staff/reducer";
import studentReducer from "./student/reducer";


const rootReducer = combineReducers({
    common : commonReducer,
    staff : staffReducer,
    student : studentReducer,
})


const store = configureStore({
    reducer : rootReducer,
})

export type RootState = ReturnType< typeof store.getState >

export default store;