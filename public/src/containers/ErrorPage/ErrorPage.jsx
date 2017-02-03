import React from 'react';

import './ErrorPage.scss';

// Strings.
import strings from '../../../../config/strings.json';

class ErrorPage extends React.Component {
    render() {
        return (
            <div className="error-page__container">
                <div className="error-page__caption">
                    <h2>{ strings.errorPage.CAPTION }</h2>
                </div>
                <div className="error-page__background">
                    <img src="/assets/images/nyan_cat.gif" alt="Nyan cat." />
                </div>
            </div>
        );
    }
}

export default ErrorPage;
