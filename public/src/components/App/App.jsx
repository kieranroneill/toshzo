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
import ToshzoDrawer from '../ToshzoDrawer/ToshzoDrawer';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class App extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.hideLoader());
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.showLoader());
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={ muiTheme }>
                <div className="page grey lighten-2">
                    <PageLoader />
                    <ToshzoDrawer />
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
    dispatch: React.PropTypes.func
};

export default connect()(App);
