import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Join from './components/Join/Join'
import Game from './components/Game/Game'
import Footer from './components/footer/Footer'

const App = () => (
    <Router>
        <Route path="https://picto.netlify.app/" exact component={Join} />
        <Route path="https://picto.netlify.app/join" component={Join} />
        <Route path="https://picto.netlify.app/game" component={Game} />
        <Footer />
    </Router>

)

export default App