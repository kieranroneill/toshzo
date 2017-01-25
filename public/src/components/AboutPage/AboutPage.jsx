import { Card } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

// Strings.
import strings from '../../config/strings.json';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class AboutPage extends React.Component {
    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.ABOUT));
    }

    render() {
        return (
            <Card>
                <div className="container">

                </div>
            </Card>
        );
    }
}

AboutPage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(AboutPage);
export { AboutPage as AboutPageTest }; // Export for testing.
