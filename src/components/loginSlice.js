import { createSlice } from '@reduxjs/toolkit'

export const login = createSlice({
    name: 'login',
    initialState: {
        value: 0,
    },
    reducers: {
        change: (state, action) => {
            console.log(action.payload);
            state.value = action.payload;
        }
    }
})

export const { change } = login.actions
export default login.reducer