import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class DashboardPage extends React.Component {
    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('Dashboard'));
    }

    render() {
        return (
            <Card>
                <div>Dashboardery</div>
            </Card>
        );
    }
}

DashboardPage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(DashboardPage);
export { DashboardPage as DashboardPageTest }; // Export for testing.
