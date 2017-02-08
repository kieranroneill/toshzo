import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// Components.
import BasePage from '../BasePage/BasePage';

// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class DashboardPage extends BasePage {
    componentDidMount() {
        super.componentDidMount();
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
