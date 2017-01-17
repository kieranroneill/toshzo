import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

// Configuration.
import muiTheme from '../../config/theme';

// Components.
import PageLoader from '../PageLoader/PageLoader';

// Actions.
import { LoaderActions } from '../../actions/index';

class App extends React.Component {
    componentDidMount() {
        this.props.dispatch(LoaderActions.hideLoader());
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={ muiTheme }>
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
