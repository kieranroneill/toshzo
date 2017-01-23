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
const iconElementRight = (
    <IconButton
        href={ strings.links.GITHUB_SOURCE }
        target="_blank"
        tooltip={ strings.tooltipMessages.FREE_AS_IN_SPEECH }
        tooltipPosition="bottom-left"
        style={ styles.button }
        iconStyle={ styles.iconRight }>
        <GitHubSvgIcon color={ white } hoverColor={ green300 } viewBox="0 0 16 16"  />
    </IconButton>
);

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
                    iconElementRight={ iconElementRight }
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
