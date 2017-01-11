import React from 'react';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <main>
                {this.props.children}

            </main>
        );
    }
}

export default App;
