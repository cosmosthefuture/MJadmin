// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { useDispatch } from "react-redux";
import CounterReducer from "./features/CounterSlice";
import AuthReducer from "./features/AuthSlice";
import adminReducer from "./features/admin/AdminSlice";
// Import the API service
import { agentAppApi, appApi, masterAppApi } from "./services/appApi";
import paginationReducer from "./features/PaginationSlice";

const rootReducer = combineReducers({
  // All APISlice will be already import
  [appApi.reducerPath]: appApi.reducer,
  [masterAppApi.reducerPath]: masterAppApi.reducer,
  [agentAppApi.reducerPath]: agentAppApi.reducer,
  counter: CounterReducer,
  auth: AuthReducer,
  admin: adminReducer,
  pagination: paginationReducer,
});

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // List of reducers to persist
  blacklist: [appApi.reducerPath, masterAppApi.reducerPath, agentAppApi.reducerPath], // Don't persist API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true, // process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "persist/PERSIST",
          "adminApi/executeMutation/fulfilled",
          "adminApi/executeMutation/pending",
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          "meta.arg",
          "payload.register",
          "meta.baseQueryMeta.request",
          "meta.baseQueryMeta.response",
        ],
        // Ignore these paths in the state
        ignoredPaths: ["auth.someNonSerializableField", "adminApi.mutations"],
      },
    })
      // Add the api middleware to enable caching, invalidation, polling, etc.
      .concat(appApi.middleware)
      .concat(masterAppApi.middleware)
      .concat(agentAppApi.middleware),
});

export const persistor = persistStore(store);

// Enable the RTK-Query refetchOnFocus/refetchOnReconnect features
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
