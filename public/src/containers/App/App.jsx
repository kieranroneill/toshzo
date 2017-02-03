import { Snackbar } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

// Configuration.
import muiTheme from '../../config/theme';

// Components.
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import PageLoader from '../../components/PageLoader/PageLoader';
import ToshzoDrawer from '../../components/ToshzoDrawer/ToshzoDrawer';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class App extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.hideLoader());
    }

    onSnackBarClose() {
        this.props.dispatch(ConfigActionCreators.resetSnackBar());
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={ muiTheme }>
                <div className="full--height full--width grey lighten-2">
                    <PageLoader />
                    <ToshzoDrawer />
                    <Header />
                    <main>
                        { this.props.children }
                    </main>
                    <Footer />
                    <Snackbar
                        message={ this.props.config.snackBar.message }
                        open={ this.props.config.snackBar.isOpen }
                        autoHideDuration={ 3000 }
                        onRequestClose={ this.onSnackBarClose.bind(this) } />
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

function mapStateToProps(state) {
    return {
        config: state.config
    };
}
export default connect(mapStateToProps)(App);
export { App as AppTest }; // Export for testing.
