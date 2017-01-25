import { Divider, Drawer, IconButton, MenuItem, Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui';
import { green300, grey500, white } from 'material-ui/styles/colors';
import ContentClear from 'material-ui/svg-icons/content/clear';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Strings.
import strings from '../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

const styles = {
    toolbar: {
        backgroundColor: white
    }
};

class ToshzoDrawer extends React.Component {
    constructor(props) {
        super(props);
    }

    onNavigationCloseClick() {
        this.props.dispatch(ConfigActionCreators.toggleDrawer());
    }

    render() {
        return (
            <Drawer open={ this.props.config.isDrawerOpen }>
                <Toolbar
                    style={ styles.toolbar }>
                    <ToolbarGroup
                        firstChild={ true }>
                        <ToolbarTitle style={{ paddingLeft: '1rem' }} text={ strings.APP_TITLE } />
                    </ToolbarGroup>
                    <ToolbarGroup
                        lastChild={ true }>
                        <IconButton
                            onTouchTap={ this.onNavigationCloseClick.bind(this) }>
                            <ContentClear
                                color={ grey500 }
                                hoverColor={ green300 } />
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <Divider />
                <MenuItem
                    primaryText={ strings.pageTitles.ABOUT }
                    containerElement={ <Link to={ strings.routes.ABOUT  } /> }
                    onTouchTap={ this.onNavigationCloseClick.bind(this) } />
            </Drawer>
        );
    }
}

ToshzoDrawer.propTypes = {
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

export default connect(mapStateToProps)(ToshzoDrawer);
export { ToshzoDrawer as ToshzoDrawerTest }; // Export for testing.
