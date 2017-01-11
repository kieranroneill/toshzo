import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
    render() {
        return (
            <Link to="about">Go to About</Link>
        );
    }
}

export default Home;
