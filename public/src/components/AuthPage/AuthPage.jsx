import _ from 'underscore';
import { Card, RaisedButton, Step, Stepper, StepLabel, TextField } from 'material-ui';
;import React from 'react';
import { connect } from 'react-redux';

import './AuthPage.scss';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

// Services.
import { MonzoService } from '../../services/index';

class AuthPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            monzoCode: this.props.location.query.code,
            snackBarConfig: {
                isOpen: false,
                message: 'Toshl token required'
            },
            stepIndex: 0,
            superSecret: this.props.location.query.state,
            toshlToken: ''
        };
    }

    authoriseMonzo() {
        this.props.dispatch(ConfigActionCreators.showLoader());

        return MonzoService
            .getToken()
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

    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('Authorise'));

        if(this.state.monzoCode && this.state.superSecret) {
            // TODO: verify secret is correct.
            this.setState({ stepIndex: 1 });
            this.props.dispatch(ConfigActionCreators.hideLoader());
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
                            value={ this.state.toshlToken }
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

    onToshlTokenChange(event) {
        this.setState({
            toshlToken: event.target.value,
        });
    }

    onNextStep() {
        const { stepIndex, finished, toshlToken } = this.state;

        if(finished) {
            return this.props.router.push('about');
        }

        // If the Toshl personal token is empty, let them know!
        if(stepIndex === 1 && _.isEmpty(toshlToken)) {
            return this.props.dispatch(ConfigActionCreators.openSnackBar('Please enter your personal Toshl token'));
        }

        // If we are attempting to authorise Monzo.
        if(stepIndex === 0) {
            return this.authoriseMonzo();
        }

        this.setState({
            stepIndex: (stepIndex + 1),
            finished: (stepIndex >= 1)
        });
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
                            onTouchTap={ this.onNextStep.bind(this) } />
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
