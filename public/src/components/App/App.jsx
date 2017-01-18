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
import { LoaderActionCreators } from '../../action-creators/index';

class App extends React.Component {
    componentDidMount() {
        this.props.dispatch(LoaderActionCreators.hideLoader());
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={ muiTheme }>
                <div className="page grey lighten-2">
                    { this.props.config.isLoading ? <PageLoader /> : null }
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
    config: React.PropTypes.object,
    dispatch: React.PropTypes.func
};

export default connect(state => ({
    config: state.config
}))(App);
