import { ConfigActionCreators } from '../../action-creators/index';

import { createProps, createStore, getContext } from '../../test/utilities';

import AuthPage from './AuthPage';

describe('<AuthPage />', () => {
    const store = createStore();
    let wrapper;

    beforeEach(function() {
        this.storeDispatchSpy = spy(store, 'dispatch');
    });

    afterEach(function() {
        this.storeDispatchSpy.restore();
    });

    describe('before component loads', function() {
        it('should hide the loader before the component is mounted', function() {
            wrapper = mount(<AuthPage store={ store } { ...createProps() } />, getContext());

            assert.calledWith(this.storeDispatchSpy, ConfigActionCreators.showLoader());
        });

        it('should set the page title', function() {
            const expectedPageTitle = 'Authorise';

            wrapper = mount(<AuthPage store={ store } { ...createProps() } />, getContext());

            assert.calledWith(this.storeDispatchSpy, ConfigActionCreators.setPageTitle(expectedPageTitle));
        });
    });
});
