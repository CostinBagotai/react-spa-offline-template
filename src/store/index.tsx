//@ts-ignore
//@ts-nocheck

import { configureStore } from '@reduxjs/toolkit';
import appSlice from './slice/app';

const isDev = process.env.NODE_ENV == 'development';

export const store = configureStore({
    reducer: {
        app: appSlice,
    },
    devTools: isDev ? true : false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;