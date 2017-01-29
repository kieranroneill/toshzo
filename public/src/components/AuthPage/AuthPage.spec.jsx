import { RaisedButton } from 'material-ui';

// Strings.
import strings from '../../config/strings.json';

// Services.
import { MonzoService, SessionService, ToshlService } from '../../services/index';

// ActionCreators
import { ConfigActionCreators, SessionActionCreators } from '../../action-creators/index';

// Components.
import { AuthPageTest } from './AuthPage';

import { getDefaultProps, mountWithContext, shallowWithContext } from '../../test/utilities';

describe('<AuthPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();

        this.createSessionTokenStub = stub(SessionService, 'createSessionToken');
        this.getAccessTokenStub = stub(MonzoService, 'getAccessToken');
        this.getStateTokenStub = stub(MonzoService, 'getStateToken');
        this.verifyTokenStub = stub(ToshlService, 'verifyToken');
    });

    afterEach(function() {
        delete this.props;

        this.createSessionTokenStub.restore();
        this.getAccessTokenStub.restore();
        this.getStateTokenStub.restore();
        this.verifyTokenStub.restore();
    });

    describe('before component loads', function() {
        it('should set the initial state', function() {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            expect(instance.state).to.have.property('finished');
            expect(instance.state.finished).to.be.false;

            expect(instance.state).to.have.property('monzo');
            expect(instance.state.monzo).to.have.property('authorisationCode');
            expect(instance.state.monzo.authorisationCode).to.be.empty;
            expect(instance.state.monzo).to.have.property('accessToken');
            expect(instance.state.accessToken).to.be.empty;

            expect(instance.state).to.have.property('snackBarConfig');
            expect(instance.state.snackBarConfig).to.have.property('isOpen');
            expect(instance.state.snackBarConfig).to.have.property('message');
            expect(instance.state.snackBarConfig.isOpen).to.be.false;
            expect(instance.state.snackBarConfig.message).to.equal(strings.snackBarMessages.TOSHL_TOKEN_REQUIRED);

            expect(instance.state).to.have.property('stepIndex');
            expect(instance.state.stepIndex).to.equal(0);

            expect(instance.state).to.have.property('stateToken');
            expect(instance.state.stateToken).to.be.empty;

            expect(instance.state).to.have.property('toshl');
            expect(instance.state.toshl).to.have.property('personalToken');
            expect(instance.state.toshl.personalToken).to.be.empty;
        });

        it('should set the authorisation code and the state token if the URL parameters are available', function() {
            let instance;

            this.props.location.query = {
                code: 'a really long string',
                state: 'a really really long string'
            };
            this.getAccessTokenStub.resolves({ token: 'got my golden ticket' });

            instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            expect(instance.state.monzo.authorisationCode).to.equal(this.props.location.query.code);
            expect(instance.state.stateToken).to.equal(this.props.location.query.state);
        });

        it('should hide the loader before the component is mounted', function() {
            const wrapper = mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.showLoader());
        });

        it('should set the page title', function() {
            const wrapper = mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(strings.pageTitles.AUTHORISE));
        });
    });

    describe('after component loads', function() {
        it('should not attempt to get an access token if the required query parameters are missing', function() {
            mountWithContext(<AuthPageTest { ...this.props } />);

            assert.notCalled(this.getAccessTokenStub);
        });

        it('should show the correct button label for the initial state', function() {
            const wrapper = shallowWithContext(<AuthPageTest { ...this.props } />)
                .find('.auth-page__actions')
                .find(RaisedButton);

            expect(wrapper.props().label).to.equal(strings.buttonLabels.AUTHORISE_MONZO);
        });

        it('should attempt to get an access token if the required query parameters are present', function() {
            this.props.location.query = {
                state: 'a weirdly long string of randomness...or is it?',
                code: 'an authorisation code'
            };

            this.getAccessTokenStub.resolves({ token: 'got my golden ticket' });

            mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(this.getAccessTokenStub, this.props.location.query.state, this.props.location.query.code);
        });
    });

    describe('when the onNextStepClick() is invoked', function() {
        it('should attempt to authorise Monzo if we are at the first step', function() {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();
            const authoriseMonzoStub = stub(instance, 'authoriseMonzo');

            instance.onNextStepClick();

            assert.calledOnce(authoriseMonzoStub);
        });

        it('should show snack bar if we are on the Toshl step and the personal token is empty', function() {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            instance.setState({ stepIndex: 1 }); // Set to Toshl auth step.
            instance.onNextStepClick();

            assert.calledWith(
                instance.props.dispatch,
                ConfigActionCreators.openSnackBar(strings.snackBarMessages.ENTER_TOSHL_TOKEN)
            );
        });

        it('should attempt to authorise Toshl if we are at the second step', function() {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();
            const authoriseToshlStub = stub(instance, 'authoriseToshl');

            instance.setState({ stepIndex: 1, toshl: { personalToken: 'a token, yay!!!' } }); // Set to Toshl auth step and fill in the code.
            instance.onNextStepClick();

            assert.calledOnce(authoriseToshlStub);
        });

        it('should create a session token and change route', function(done) {
            const sessionToken = 'a session token, yaya!!!!';
            const monzoAccessToken = 'i am monzo...hear me scream!';
            const toshlPersonalToken = 'this just got personal';
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            this.createSessionTokenStub.resolves({ token: sessionToken });

            instance.setState({
                finished: true, // Set the stepper to finished.
                monzo: { ...instance.state.monzo, accessToken: monzoAccessToken },
                toshl: { ...instance.state.toshl, personalToken: toshlPersonalToken }
            });

            instance
                .onNextStepClick()
                .then(() => {
                    assert.calledWith(this.createSessionTokenStub, monzoAccessToken, toshlPersonalToken);
                    assert.calledWith(
                        instance.props.dispatch,
                        SessionActionCreators.setSessionToken(sessionToken)
                    );
                    assert.calledWith(instance.props.router.push, strings.routes.DASHBOARD);

                    done();
                });
        });
    });

    describe('when a user attempts to authorise Monzo', function() {
        it('should hide the loader if there is an error getting the state token', function(done) {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            this.getStateTokenStub.rejects();

            instance
                .authoriseMonzo()
                .then(() => {
                    assert.calledWith(instance.props.dispatch, ConfigActionCreators.hideLoader());

                    done();
                });
        });

        it('should redirect to the Monzo authorisation page', function(done) {
            const redirectUri = window.location.protocol + '//' +
                window.location.hostname +
                (window.location.port ? ':' + window.location.port : '') +
                '/auth';
            const stateToken = 'a valid token from the abyss';
            const clientId = 'clients...clients...clients';
            const monzoAuthUri = AuthPageTest.createMonzoAuthUri(clientId, stateToken, redirectUri);
            const locationAssignStub = stub(window.location, 'assign');
            let instance;

            this.props.references.monzo.clientId = clientId;
            this.getStateTokenStub.resolves({ token: stateToken });

            instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            instance
                .authoriseMonzo()
                .then(() => {
                    assert.calledWith(locationAssignStub, monzoAuthUri);

                    done();
                });
        });
    });

    describe('when a user attempts to authorise Toshl', function() {
        it('should fail if the personal token is invalid', function(done) {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();
            this.verifyTokenStub.rejects({ status: httpCodes.UNAUTHORIZED, errors: [errors.INVALID_TOSHL_TOKEN] });

            instance
                .authoriseToshl()
                .then(() => {
                    assert.calledWith(
                        instance.props.dispatch,
                        ConfigActionCreators.openSnackBar(errors.INVALID_TOSHL_TOKEN)
                    );
                    expect(instance.props.dispatch.lastCall.args[0]).to.deep.equal(ConfigActionCreators.hideLoader());

                    done();
                });
        });

        it('should go to the last step if the Toshl personal token is valid', function(done) {
            let instance;

            this.props.location.query = {
                code: 'a really long string',
                state: 'a really really long string'
            };
            this.getAccessTokenStub.resolves({ token: 'got my golden ticket' });
            this.verifyTokenStub.resolves();

            instance = mountWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            instance
                .authoriseToshl()
                .then(() => {
                    expect(instance.state.finished).to.be.true;
                    expect(instance.state.stepIndex).to.equal(2);
                    expect(instance.props.dispatch.lastCall.args[0]).to.deep.equal(ConfigActionCreators.hideLoader());

                    done();
                });
        });
    });
});
