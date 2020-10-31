import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Join from './components/Join/Join'
import Game from './components/Game/Game'
import Footer from './components/footer/Footer'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

const App = () => (
    <Router>
        <ScrollToTop>
         <Switch>
            <Route path="/" exact component={Join} />
            <Route path="/join" component={Join} />
            <Route path="/game" component={Game} />
        </Switch>   
        </ScrollToTop>
         
        <Footer />
    </Router>

)

export default App