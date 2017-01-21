import _ from 'underscore';
import { Card, RaisedButton, Step, Stepper, StepLabel, TextField } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './AuthPage.scss';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

// Services.
import { MonzoService, ToshlService } from '../../services/index';

class AuthPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            monzoAuthorisationCode: this.props.location.query.code,
            snackBarConfig: {
                isOpen: false,
                message: 'Toshl token required'
            },
            stepIndex: 0,
            stateToken: this.props.location.query.state,
            toshlPersonalToken: ''
        };
    }

    authoriseMonzo() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        return MonzoService
            .getStateToken()
            .then(result => {
                const redirectUri = location.protocol + '//' +
                    location.hostname +
                    (location.port ? ':' + location.port : '') +
                    '/auth';
                let url = 'https://auth.getmondo.co.uk/?';

                url += 'client_id=' + this.props.references.monzo.clientId;
                url += '&redirect_uri=' + encodeURI(redirectUri);
                url += '&response_type=code';
                url += '&state=' + result.token;

                // Navigate to Monzo for authorisation.
                window.location.href = url;
            })
            .catch(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
    }

    authoriseToshl() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        return ToshlService
            .verifyToken(this.state.toshlPersonalToken)
            .then(() => this.incrementStep())
            .catch(error => this.props.dispatch(ConfigActionCreators.openSnackBar(error.errors[0]))) // Show the first error.
            .finally(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
    }

    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('Authorise'));

        // Handle a Monzo redirection.
        if(this.state.monzoAuthorisationCode && this.state.stateToken) {
            MonzoService
                .getAccessToken(this.state.stateToken, this.state.monzoAuthorisationCode)
                .then(() => this.setState({ stepIndex: 1, finished: false })) // Go to the Toshl page.
                .catch(error => this.props.dispatch(ConfigActionCreators.openSnackBar(error.errors[0]))) // Show the first error.
                .finally(() => this.props.dispatch(ConfigActionCreators.hideLoader()));
        }
        else {
            this.props.dispatch(ConfigActionCreators.hideLoader());
        }
    }

    componentWillMount() {
        this.props.dispatch(ConfigActionCreators.showLoader());
    }

    getButtonLabel() {
        switch (this.state.stepIndex) {
            case 0:
                return 'Authorise Monzo';
            case 1:
                return 'Authorise Toshl';
            default:
                return 'Finished';
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
                            value={ this.state.toshlPersonalToken }
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
        this.setState({
            toshlPersonalToken: event.target.value,
        });
    }

    onNextStepClick() {
        if(this.state.finished) {
            return this.props.router.push('about');
        }


        if(this.state.stepIndex === 1) {
            // If the Toshl personal token is empty, let them know!
            if(_.isEmpty(this.state.toshlPersonalToken)) {
                return this.props.dispatch(ConfigActionCreators.openSnackBar('Please enter your personal Toshl token'));
            }

            // Attempt to authorise Toshl.
            return this.authoriseToshl();
        }

        // If we are attempting to authorise Monzo.
        if(this.state.stepIndex === 0) {
            return this.authoriseMonzo();
        }

        this.props.dispatch(ConfigActionCreators.openSnackBar('Hmm... Somthing fishy is going on'));
    }

    render() {
        return (
            <Card>
                <div className="auth-page__container">
                    <h2>Welcome to Toshzo!</h2>
                    <Stepper activeStep={ this.state.stepIndex }>
                        <Step>
                            <StepLabel>Authorise Monzo</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Authorise Toshl</StepLabel>
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
