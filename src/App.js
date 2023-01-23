import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Join from './components/Join/Join'
import Game from './components/Game/Game'
import Footer from './components/footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

// Main app component
const App = () => (
    <Router>
        <ScrollToTop />
        <div class="alert alert-info text-center" role="alert">
            <h1 class="alert-heading">Update</h1>
            <p class="lead">Unfortunately, due to server hosting costs, Picto backend server has been shutdown.</p>
            <p class="lead">Until a cheaper option is found, without the backend server running, Picto is not playable.</p>
            <p class="lead">Source code is available on <a href="https://github.com/Panda4817/Multiplayer-Pictionary-Frontend" class="alert-link">GitHub</a> if you wish to run it yourself.</p>
            <p class="lead">Sorry for the inconvenience.</p>
        </div>
        <Route path="/" exact component={Join} />
        <Route path="/join" component={Join} />
        <Route path="/game" component={Game} />
        <Footer />
    </Router>

)

export default App