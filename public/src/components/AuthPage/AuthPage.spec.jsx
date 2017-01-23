import { RaisedButton } from 'material-ui';

// Services.
import { MonzoService } from '../../services/index';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AuthPageTest } from './AuthPage';

import { getContext, getDefaultProps } from '../../test/utilities';

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
        it('should hide the loader before the component is mounted', function() {
            const wrapper = mount(<AuthPageTest { ...this.props } />, getContext());

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.showLoader());
        });

        it('should set the page title', function() {
            const expectedPageTitle = 'Authorise';
            const wrapper = mount(<AuthPageTest { ...this.props } />, getContext());

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(expectedPageTitle));
        });
    });

    describe('after component loads', function() {
        it('should not attempt to get an access token if the required query parameters are missing', function() {
            mount(<AuthPageTest { ...this.props } />, getContext());

            assert.notCalled(this.getAccessTokenStub);
        });

        it('should attempt to get an access token if the required query parameters are present', function() {
            this.props.location.query = {
                state: 'a weirdly long string of randomness...or is it?',
                code: 'an authorisation code'
            };

            this.getAccessTokenStub.resolves();

            mount(<AuthPageTest { ...this.props } />, getContext());

            assert.calledWith(this.getAccessTokenStub, this.props.location.query.state, this.props.location.query.code);
        });
    });

    describe('when a user attempts to authorise Monzo', function() {
        it('should trigger the onNextStepClick() action', function() {
            const wrapper = shallow(<AuthPageTest { ...this.props } />, getContext());
            const nextButtonWrapper = wrapper
                .find('.auth-page__actions')
                .find(RaisedButton);
            const onTouchTapSpy = spy(nextButtonWrapper.node.props, 'onTouchTap');

            nextButtonWrapper.simulate('touchTap');

            assert.calledOnce(onTouchTapSpy);
        });
    });
});
