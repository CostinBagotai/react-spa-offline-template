import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface IAppSlice {
    loaded: boolean,
}

const initialState: IAppSlice = {
    loaded: false,
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoaded: (state, action: PayloadAction<boolean>) => {
            state.loaded = true;
            return state;
        },
    },
})

export const getLoaded = (state: RootState) => state.app.loaded;
export const getAll = (state: RootState) => state.app;

export const {
    setAppLoaded,

} = appSlice.actions;

export default appSlice.reducer;