import { Card } from 'material-ui';
import { grey500 } from 'material-ui/styles/colors';
import ActionTrendingFlat from 'material-ui/svg-icons/action/trending-flat';
import React from 'react';
import { connect } from 'react-redux';

import './AboutPage.scss';

// Strings.
import strings from '../../../../config/strings.json';

// Components.
import BasePage from '../BasePage/BasePage';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

class AboutPage extends BasePage {
    componentDidMount() {
        super.componentDidMount();
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.ABOUT));
    }

    render() {
        return (
            <Card>
                <div className="about-page__container container">
                    <h2>{ strings.APP_TITLE }</h2>
                    <p>{ this.props.info.description }</p>
                    <p>Special thanks and a high five to both teams at Monzo and Toshl for bringing great products!</p>
                    <div className="about-page__affiliates">
                        <div className="about-page__affiliates-item about-page__affiliates-item--width-4">
                            <a href={ strings.links.MONZO } target="_blank">
                                <div className="about-page__affiliates__image">
                                    <img src="assets/images/monzo_logo.png" alt="Monzo logo" />
                                </div>
                                <p>Monzo</p>
                            </a>
                        </div>
                        <div className="about-page__affiliates__item about-page__affiliates__item--width-2">
                            <ActionTrendingFlat
                                color={ grey500 }
                                style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className="about-page__affiliates__item about-page__affiliates__item--width-4">
                            <a href={ strings.links.TOSHL } target="_blank">
                                <div className="about-page__affiliates__image">
                                    <img src="assets/images/toshl_logo.png" alt="Tohsl logo" />
                                </div>
                                <p>Toshl</p>
                            </a>
                        </div>
                    </div>
                    <p>{ 'v' + this.props.info.version }</p>
                </div>
            </Card>
        );
    }
}

AboutPage.propTypes = {
    dispatch: React.PropTypes.func,
    info: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        info: state.info
    };
}

export default connect(mapStateToProps)(AboutPage);
export { AboutPage as AboutPageTest }; // Export for testing.
