import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <main>
                <MuiThemeProvider>
                    {this.props.children}
                </MuiThemeProvider>

            </main>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node
};

export default App;
