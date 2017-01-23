import { RaisedButton } from 'material-ui';

// Services.
import { MonzoService } from '../../services/index';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AuthPageTest } from './AuthPage';

import { getDefaultProps, mountWithContext, shallowWithContext } from '../../test/utilities';

describe('<AuthPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();

        this.getAccessTokenStub = stub(MonzoService, 'getAccessToken');
    });

    afterEach(function() {
        delete this.props;

        this.getAccessTokenStub.restore();
    });

    describe('before component loads', function() {
        it('should set the initial state', function() {
            const instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            expect(instance.state).to.have.property('finished');
            expect(instance.state.finished).to.be.false;

            expect(instance.state).to.have.property('monzoAuthorisationCode');
            expect(instance.state.monzoAuthorisationCode).to.be.undefined;

            expect(instance.state).to.have.property('snackBarConfig');
            expect(instance.state.snackBarConfig).to.have.property('isOpen');
            expect(instance.state.snackBarConfig).to.have.property('message');
            expect(instance.state.snackBarConfig.isOpen).to.be.false;
            expect(instance.state.snackBarConfig.message).to.equal('Toshl token required');

            expect(instance.state).to.have.property('stepIndex');
            expect(instance.state.stepIndex).to.equal(0);

            expect(instance.state).to.have.property('stateToken');
            expect(instance.state.stateToken).to.be.undefined;

            expect(instance.state).to.have.property('toshlPersonalToken');
            expect(instance.state.toshlPersonalToken).to.be.empty;
        });

        it('should set the authorisation code and the state token if the URL parameters are available', function() {
            let instance;

            this.props.location.query = {
                code: 'a really long string',
                state: 'a really really long string'
            };
            this.getAccessTokenStub.resolves();

            instance = shallowWithContext(<AuthPageTest { ...this.props } />)
                .instance();

            expect(instance.state.monzoAuthorisationCode).to.equal(this.props.location.query.code);
            expect(instance.state.stateToken).to.equal(this.props.location.query.state);
        });

        it('should hide the loader before the component is mounted', function() {
            const wrapper = mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.showLoader());
        });

        it('should set the page title', function() {
            const expectedPageTitle = 'Authorise';
            const wrapper = mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(expectedPageTitle));
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

            expect(wrapper.props().label).to.equal('Authorise Monzo');
        });

        it('should attempt to get an access token if the required query parameters are present', function() {
            this.props.location.query = {
                state: 'a weirdly long string of randomness...or is it?',
                code: 'an authorisation code'
            };

            this.getAccessTokenStub.resolves();

            mountWithContext(<AuthPageTest { ...this.props } />);

            assert.calledWith(this.getAccessTokenStub, this.props.location.query.state, this.props.location.query.code);
        });
    });

    describe('when a user attempts to authorise Monzo', function() {
        // it('should have', function() {
        //     const wrapper = shallowWithContext(<AuthPageTest { ...this.props } />);
        //     const nextButtonWrapper = wrapper
        //         .find('.auth-page__actions')
        //         .find(RaisedButton);
        //     const props = nextButtonWrapper.props();
        //     //const onTouchTapSpy = spy(props, 'onTouchTap');
        //
        //     nextButtonWrapper.simulate('touchTap');
        //
        //     assert.calledOnce(onTouchTapSpy);
        // });
    });
});
