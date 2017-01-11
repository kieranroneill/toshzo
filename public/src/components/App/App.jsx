import React from 'react';
import { Link } from 'react-router';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <Link to="/about">About</Link>
        );
    }
}

export default App;
