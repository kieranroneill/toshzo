import { ConfigActionCreators } from '../../action-creators/index';

import { createStore, getContext } from '../../test/utilities';

import AuthPage from './AuthPage';

import { MonzoService, ToshlService } from '../../services/index';

describe('<AuthPage />', () => {
    const store = createStore();
    const props = {
        location: {
            query: {}
        }
    };

    beforeEach(function() {
        this.getAccessTokenStub = stub(MonzoService, 'getAccessToken');
        this.storeDispatchSpy = spy(store, 'dispatch');
    });

    afterEach(function() {
        this.getAccessTokenStub.restore();
        this.storeDispatchSpy.restore();
    });

    describe('before component loads', function() {
        it('should hide the loader before the component is mounted', function() {
            mount(<AuthPage store={ store } { ...props } />, getContext());

            assert.calledWith(this.storeDispatchSpy, ConfigActionCreators.showLoader());
        });

        it('should set the page title', function() {
            const expectedPageTitle = 'Authorise';

            mount(<AuthPage store={ store } { ...props } />, getContext());

            assert.calledWith(this.storeDispatchSpy, ConfigActionCreators.setPageTitle(expectedPageTitle));
        });
    });

    describe('after component loads', function() {
        it('should not attempt to get an access token if the required query parameters are missing', function() {
            mount(<AuthPage store={ store } { ...props } />, getContext());

            assert.notCalled(this.getAccessTokenStub);
        });

        it('should attempt to get an access token if the required query parameters are present', function() {
            props.location.query = {
                state: 'a weirdly long string of randomness...or is it?',
                code: 'an authorisation code'
            };

            this.getAccessTokenStub.resolves();

            mount(<AuthPage store={ store } { ...props } />, getContext());

            assert.calledWith(this.getAccessTokenStub, props.location.query.state, props.location.query.code);
        });
    });
});
