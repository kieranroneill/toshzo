import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class AboutPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('About'));
    }

    render() {
        return (
            <Link to="auth">Auth</Link>
        );
    }
}

AboutPage.propTypes = {
    dispatch: React.PropTypes.func
};

export default connect()(AboutPage);
