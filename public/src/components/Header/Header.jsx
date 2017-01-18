import { AppBar } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './Header.scss';

class Header extends React.Component {
    render() {
        return (
            <header>
                <AppBar
                    title={ this.props.config.pageTitle } />

            </header>
        );
    }
}

Header.propTypes = {
    config: React.PropTypes.object
};

export default connect(state => ({
    config: state.config
}))(Header);
