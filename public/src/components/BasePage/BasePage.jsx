import React from 'react';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class BasePage extends React.Component {
    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.hideLoader());
    }
}

BasePage.propTypes = {
    dispatch: React.PropTypes.func
};

export default BasePage;
