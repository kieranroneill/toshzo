import { AppBar } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './Header.scss';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    onNavigationOpenClick() {
        this.props.dispatch(ConfigActionCreators.toggleDrawer());
    }

    render() {
        return (
            <header>
                <AppBar
                    title={ this.props.config.pageTitle }
                    onLeftIconButtonTouchTap={ this.onNavigationOpenClick.bind(this) } />

            </header>
        );
    }
}

Header.propTypes = {
    config: React.PropTypes.object,
    dispatch: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        config: state.config
    };
}

export default connect(mapStateToProps)(Header);
