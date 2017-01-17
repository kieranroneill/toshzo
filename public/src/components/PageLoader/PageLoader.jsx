import { CircularProgress } from 'material-ui';
import React from 'react';

import './PageLoader.scss';

class PageLoader extends React.Component {
    render() {
        return (
            <div className="page-loader__outer white">
                <div className="page-loader__inner">
                    <CircularProgress size={60} />
                </div>
            </div>
        );
    }
}

export default PageLoader;
