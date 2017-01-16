import { Card, CardActions, CardHeader, FlatButton } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { ReferencesActions } from '../../actions/index';

class Home extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader
                    title="Without Avatar"
                    subtitle={this.props.references.monzo.clientId}
                />
                <CardActions>
                    <FlatButton
                        label="About"
                        containerElement={<Link to="/about" />}/>
                    <FlatButton
                        label="Get References"
                        onTouchTap={() => this.props.dispatch(ReferencesActions.getReferences())}/>
                </CardActions>
            </Card>
        );
    }
}

Home.propTypes = {
    references: React.PropTypes.object,
    dispatch: React.PropTypes.func.isRequired
};

export default connect(state => ({ references: state.ReferencesReducer }))(Home);
