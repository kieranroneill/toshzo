import React from 'react';

import './TeapotPage.scss';

// Strings.
import strings from '../../../../config/strings.json';

class TeapotPage extends React.Component {
    render() {
        return (
            <div className="teapot-page__outer">
                <div className="teapot-page__inner">
                    <h2 className="teapot-page__caption">{ strings.teapotPage.CAPTION }</h2>
                    <div className="teapot-page__image">
                        <img src="/assets/images/teapot.png" alt="Illustration of the Hatter by John Tenniel" />
                    </div>
                </div>
            </div>
        );
    }
}

export default TeapotPage;
