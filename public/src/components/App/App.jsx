import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

// Configuration.
import muiTheme from '../../config/theme';

// Components.
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
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
                <div className="page grey lighten-3">
                    { this.props.loader ? <PageLoader /> : null }
                    <Header />
                    <main>
                        { this.props.children }
                    </main>
                    <Footer />
                </div>
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
