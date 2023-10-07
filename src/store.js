import { configureStore } from '@reduxjs/toolkit'
import login from './components/loginSlice'

export default configureStore({
    reducer: {
        login: login,
    },
})

