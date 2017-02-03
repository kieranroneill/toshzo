import _ from 'underscore';
import { Card, RaisedButton, Step, Stepper, StepLabel, TextField } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './AuthPage.scss';

// Strings.
import strings from '../../../../config/strings.json';

// Components.
import BasePage from '../BasePage/BasePage';

// ActionCreators.
import { ConfigActionCreators, SessionActionCreators } from '../../action-creators/index';

// Services.
import { MonzoService, SessionService, ToshlService } from '../../services/index';

class AuthPage extends BasePage {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            monzo: {
                authorisationCode: this.props.location.query.code,
                accessToken: null
            },
            snackBarConfig: {
                isOpen: false,
                message: strings.snackBarMessages.TOSHL_TOKEN_REQUIRED
            },
            stepIndex: 0,
            stateToken: this.props.location.query.state,
            toshl: {
                personalToken: ''
            }
        };
    }

    authoriseMonzo() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        return MonzoService
            .getStateToken()
            .bind(this)
            .then(result => {
                const monzoAuthUri = AuthPage.createMonzoAuthUri(
                    this.props.references.monzo.clientId,
                    result.token,
                    MonzoService.createMonzoRedirectUri()
                );

                // Navigate to Monzo for authorisation.
                window.location.assign(monzoAuthUri);
            })
            .catch(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
    }

    authoriseToshl() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        return ToshlService
            .verifyToken(this.state.toshl.personalToken)
            .bind(this)
            .then(() => this.incrementStep())
            .catch(error => this.props.dispatch(ConfigActionCreators.openSnackBar(error.errors[0]))) // Show the first error.
            .finally(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
    }

    componentDidMount() {
        // Handle a Monzo redirection.
        if(this.state.monzo.authorisationCode && this.state.stateToken) {
            MonzoService
                .getAccessToken(this.state.stateToken, this.state.monzo.authorisationCode)
                .bind(this)
                .then(result => this.setState({
                    monzo: { ...this.state.monzo, accessToken: result.token },
                    stepIndex: 1, // Go to the Toshl page.
                    finished: false
                }))
                .catch(error => this.props.dispatch(ConfigActionCreators.openSnackBar(error.errors[0]))) // Show the first error.
                .finally(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
        }
        else {
            this.props.dispatch(ConfigActionCreators.hideLoader());
        }
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle(strings.pageTitles.AUTHORISE));
        this.props.dispatch(ConfigActionCreators.showLoader());
    }

    static createMonzoAuthUri(clientId, stateToken, redirectUri) {
        let url = 'https://auth.getmondo.co.uk/?';

        url += 'client_id=' + clientId;
        url += '&redirect_uri=' + encodeURI(redirectUri);
        url += '&response_type=code';
        url += '&state=' + stateToken;

        return url;
    }

    getButtonLabel() {
        switch (this.state.stepIndex) {
            case 0:
                return strings.buttonLabels.AUTHORISE_MONZO;
            case 1:
                return strings.buttonLabels.AUTHORISE_TOSHL;
            default:
                return strings.buttonLabels.FINISHED;
        }
    }

    getStepContent() {
        switch (this.state.stepIndex) {
            case 0:
                return (
                    <div className="auth-page__content">
                        <p>
                            Firstly, we need to authorise your Monzo account to allow us access to read your transactions.
                        </p>
                        <div className="auth-page__content__image">
                            <img src="assets/images/monzo_logo.png" alt="Monzo logo" />
                        </div>
                        <p>
                            You will be redirected to Monzo and asked to authorise Toshzo.
                        </p>
                    </div>

                );
            case 1:
                return (
                    <div className="auth-page__content">
                        <p>
                            Now that we have authorised Monzo, we need your permission to add your expenses to Toshl.
                        </p>
                        <div className="auth-page__content__image">
                            <img src="assets/images/toshl_logo.png" alt="Toshl logo" />
                        </div>
                        <p>
                            You will be redirected to Toshl and asked to authorise Toshzo.
                        </p>
                        <TextField
                            value={ this.state.toshl.personalToken }
                            hintText="Enter your personal Toshl token"
                            onChange={ this.onToshlTokenChange.bind(this) } />
                    </div>
                );
            default:
                return (
                    <div className="auth-page__content">
                        <p>
                            That's it folks!
                        </p>
                        <p>
                            We now have the necessary permissions to read your Monzo transactions and add them to Toshl.
                        </p>
                        <p>
                            Click "Finished" to customise how your expenses are added to Toshl.
                        </p>
                    </div>
                );
        }
    }

    incrementStep() {
        const { stepIndex } = this.state;

        this.setState({
            stepIndex: (stepIndex + 1),
            finished: (stepIndex >= 1)
        });
    }

    onToshlTokenChange(event) {
        this.setState({ toshl: { ...this.state.toshl, personalToken: event.target.value } });
    }

    onNextStepClick() {
        if(this.state.finished) {
            this.props.dispatch(ConfigActionCreators.showLoader());

            return SessionService
                .createSessionToken(this.state.monzo.accessToken, this.state.toshl.personalToken)
                .then(result => {
                    this.props.dispatch(SessionActionCreators.setSessionToken(result.token));
                    this.props.router.push(strings.routes.DASHBOARD);
                })
                .catch(error => {
                    this.props.dispatch(ConfigActionCreators.hideLoader());
                    this.props.dispatch(ConfigActionCreators.openSnackBar(error.errors[0]));
                });
        }

        if(this.state.stepIndex === 1) {
            // If the Toshl personal token is empty, let them know!
            if(_.isEmpty(this.state.toshl.personalToken)) {
                return this.props.dispatch(ConfigActionCreators.openSnackBar(strings.snackBarMessages.ENTER_TOSHL_TOKEN));
            }

            // Attempt to authorise Toshl.
            return this.authoriseToshl();
        }

        // If we are attempting to authorise Monzo.
        if(this.state.stepIndex === 0) {
            return this.authoriseMonzo();
        }

        this.props.dispatch(ConfigActionCreators.openSnackBar(strings.snackBarMessages.SOMETHING_IS_WRONG));
    }

    render() {
        return (
            <Card>
                <div className="auth-page__container container">
                    <h2>Welcome to Toshzo!</h2>
                    <Stepper activeStep={ this.state.stepIndex }>
                        <Step>
                            <StepLabel>{ strings.labels.AUTHORISE_MONZO }</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>{ strings.labels.AUTHORISE_TOSHL }</StepLabel>
                        </Step>
                    </Stepper>
                    { this.getStepContent() }
                    <div className="auth-page__actions">
                        <RaisedButton
                            label={ this.getButtonLabel() }
                            secondary={ true }
                            onTouchTap={ this.onNextStepClick.bind(this) } />
                    </div>
                </div>
            </Card>
        );
    }
}

AuthPage.propTypes = {
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    references: React.PropTypes.object,
    router: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        references: state.references
    };
}

export default connect(mapStateToProps)(AuthPage);
export { AuthPage as AuthPageTest }; // Export for testing.
