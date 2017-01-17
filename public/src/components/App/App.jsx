import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

import PageLoader from '../PageLoader/PageLoader';

import { LoaderActions } from '../../actions/index';

class App extends React.Component {
    componentDidMount() {
        this.props.dispatch(LoaderActions.hideLoader());
    }

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
    dispatch: React.PropTypes.func,
    loader: React.PropTypes.bool
};

export default connect(state => ({
    loader: state.loader
}))(App);
