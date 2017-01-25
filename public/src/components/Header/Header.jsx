import { AppBar, IconButton } from 'material-ui';
import { green300, white } from 'material-ui/styles/colors';
import React from 'react';
import { connect } from 'react-redux';

import './Header.scss';

// Strings.
import strings from '../../config/strings.json';

// Components.
import GitHubSvgIcon from '../GitHubSvgIcon/GitHubSvgIcon';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

const styles = {
    button: {
        width: 48,
        height: 48
    },
    iconRight: {
        width: 24,
        height: 24
    }
};

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    getIconElementRight() {
        return (
            <IconButton
                href={ this.props.info.source }
                target="_blank"
                tooltip={ strings.tooltipMessages.FREE_AS_IN_SPEECH }
                tooltipPosition="bottom-left"
                style={ styles.button }
                iconStyle={ styles.iconRight }>
                <GitHubSvgIcon color={ white } hoverColor={ green300 } viewBox="0 0 16 16"  />
            </IconButton>
        );
    }

    onNavigationOpenClick() {
        this.props.dispatch(ConfigActionCreators.toggleDrawer());
    }

    render() {
        return (
            <header>
                <AppBar
                    title={ this.props.config.pageTitle }
                    iconElementRight={ this.getIconElementRight() }
                    onLeftIconButtonTouchTap={ this.onNavigationOpenClick.bind(this) } />

            </header>
        );
    }
}

Header.propTypes = {
    config: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    info: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        config: state.config,
        info: state.info
    };
}

export default connect(mapStateToProps)(Header);
export { Header as HeaderTest }; // Export for testing.
