import React from 'react';

import './NotFoundPage.scss';

class NotFoundPage extends React.Component {
    render() {
        return (
            <div className="not-found-page__container full--height full--width">
                <div className="not-found-page__image">
                    <img src="/assets/images/not_found.png" alt="Don't poke the deep ones!!" />
                </div>
            </div>
        );
    }
}

export default NotFoundPage;
