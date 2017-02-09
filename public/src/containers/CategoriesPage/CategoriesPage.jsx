import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// Components.
import BasePage from '../BasePage/BasePage';

// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class CategoriesPage extends BasePage {
    componentDidMount() {
        super.componentDidMount();
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.CATEGORIES));
    }

    render() {
        return (
            <Card>
                <div>Category</div>
            </Card>
        );
    }
}

CategoriesPage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(CategoriesPage);
export { CategoriesPage as CategoriesPageTest }; // Export for testing.
