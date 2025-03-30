import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { coursApi } from "@/features/api/courseApi";

export const appStore = configureStore({
    reducer: rootReducer,  // Ensure rootReducer is correctly used
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(authApi.middleware, coursApi.middleware) // Fix middleware order
});
