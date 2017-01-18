import { Divider, Drawer, IconButton, Toolbar, ToolbarGroup } from 'material-ui';
import { green300, grey500, white } from 'material-ui/styles/colors';
import ContentClear from 'material-ui/svg-icons/content/clear';
import React from 'react';
import { connect } from 'react-redux';

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
                        firstChild={ true }/>
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
            </Drawer>
        );
    }
}

ToshzoDrawer.propTypes = {
    config: React.PropTypes.object,
    dispatch: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        config: state.config
    };
}

export default connect(mapStateToProps)(ToshzoDrawer);
