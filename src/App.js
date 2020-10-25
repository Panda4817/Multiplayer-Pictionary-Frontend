import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Join from './components/Join/Join'
import Game from './components/Game/Game'
import Footer from './components/footer/Footer'

const App = () => (
    <Router>
        <Route path="/" exact component={Join} />
        <Route path="/join" component={Join} />
        <Route path="/game" component={Game} />
        <Footer />
    </Router>

)

export default App