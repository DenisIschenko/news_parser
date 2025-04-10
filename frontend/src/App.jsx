import React from "react";
import {Route, Routes} from 'react-router-dom'
import FeedList from './pages/FeedList'

function App() {
    return (
        <Routes>
            <Route path="/" element={<FeedList/>}/>
        </Routes>
    )
}

export default App