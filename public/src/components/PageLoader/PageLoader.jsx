import { CircularProgress } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './PageLoader.scss';

class PageLoader extends React.Component {
    render() {
        return (
            <div className={'page-loader__outer white ' + (this.props.config.isLoading ? 'show' : 'hidden')}>
                <div className="page-loader__inner">
                    <CircularProgress size={60} />
                </div>
            </div>
        );
    }
}

PageLoader.propTypes = {
    config: React.PropTypes.object,
};

function mapStateToProps(state) {
    return {
        config: state.config
    };
}

export default connect(mapStateToProps)(PageLoader);
