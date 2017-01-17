import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

import PageLoader from '../PageLoader/PageLoader';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <main>
                    { this.props.loader ? <PageLoader /> : null }
                    { this.props.children }
                </main>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.node,
    loader: React.PropTypes.bool,
};

export default connect(state => ({
    loader: state.loader
}))(App);
