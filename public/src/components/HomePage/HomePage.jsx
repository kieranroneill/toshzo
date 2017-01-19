import { Card, CardHeader } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class HomePage extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('Home'));
    }

    render() {
        return (
            <Card>
                <CardHeader
                    title="Without Avatar"
                    subtitle="Wazzzzup"
                />
            </Card>
        );
    }
}

HomePage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(HomePage);
