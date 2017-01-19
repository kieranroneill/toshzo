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
        <p>
            You will be redirected to Monzo.
        </p>
        <FlatButton
            label="Authorise Monzo"
            secondary={ true } />
    </div>

);
const authToshlContent = (
    <p>
        Ad group status is different than the statuses for campaigns, ads, and keywords, though the
        statuses can affect each other. Ad groups are contained within a campaign, and each campaign can
        have one or more ad groups. Within each ad group are ads, keywords, and bids.
    </p>
);
const finishedContent = (
    <p>
        Finnished!!!
    </p>
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
                    <div className="auth-page__content__container">
                        { this.getStepContent() }
                    </div>
                    <div className="auth-page__actions">
                        <RaisedButton
                            label={ (this.state.stepIndex === 2 ? 'Finish' : 'Next') }
                            primary={ true }
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
