import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// Strings.
import strings from '../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class DashboardPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.hideLoader());
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.DASHBOARD));
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
