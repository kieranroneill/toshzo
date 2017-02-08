import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// Components.
import BasePage from '../BasePage/BasePage';

// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class AccountsPage extends BasePage {
    componentDidMount() {
        super.componentDidMount();
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.ACCOUNTS));
    }

    render() {
        return (
            <Card>
                <div>Dashboardery</div>
            </Card>
        );
    }
}

AccountsPage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(AccountsPage);
export { AccountsPage as AccountsPageTest }; // Export for testing.
