import { Snackbar } from 'material-ui';
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
import { ConfigActionCreators, ReferencesActionCreators } from '../../action-creators/index';

// Services.
import { ReferencesService } from '../../services/index';

class App extends React.Component {
    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        // Get the references.
        ReferencesService
            .getReferences()
            .then(result => this.props.dispatch(ReferencesActionCreators.setReferences(result)))
            .finally(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
    }

    onSnackBarClose() {
        this.props.dispatch(ConfigActionCreators.resetSnackBar());
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
