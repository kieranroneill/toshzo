import { Card, FlatButton, RaisedButton, Step, Stepper, StepLabel } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';

import './AuthPage.scss';

// ActionCreators.
import { ConfigActionCreators } from '../../action-creators/index';

const authMonzoContent = (
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
const authToshlContent = (
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
    </div>
);
const finishedContent = (
    <div className="auth-page__content">
        <p>
            That's it folks!
        </p>
        <p>
            We now have the necessary permissions to read your Monzo transactions and add them to Toshl.
        </p>
        <p>
            Click "Finish" to customise how your expenses are added to Toshl.
        </p>
    </div>
);

class AuthPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            stepIndex: 0
        };
    }

    componentDidMount() {
        this.props.dispatch(ConfigActionCreators.setPageTitle('Authorise'));
    }

    getButtonLabel() {
        switch (this.state.stepIndex) {
            case 0:
                return 'Authorise Monzo';
            case 1:
                return 'Authorise Toshl';
            case 2:
                return 'Finished';
            default:
                return 'Start Over';
        }
    }

    getStepContent() {
        switch (this.state.stepIndex) {
            case 0:
                return authMonzoContent;
            case 1:
                return authToshlContent;
            case 2:
                return finishedContent;
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    onNextStep() {
        const { stepIndex } = this.state;

        if(this.state.finished) {
            return;
        }

        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2
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
                        <Step>
                            <StepLabel>That's all folks!</StepLabel>
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
    dispatch: React.PropTypes.func
};

export default connect()(AuthPage);
