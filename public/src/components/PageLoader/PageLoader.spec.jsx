// Components.
import { PageLoaderTest } from './PageLoader';

// Store.
import { ConfigState as initialConfigState } from '../../states/index';

import { getDefaultProps, mountWithContext } from '../../test/utilities';

describe('<PageLoader />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    it('should be visible for the initial store state', function() {
        const wrapper = mountWithContext(<PageLoaderTest { ...this.props } />);

        expect(wrapper.props().config.isLoading).to.equal(initialConfigState.isLoading);
        expect(wrapper.hasClass('hidden')).to.be.true;
        expect(wrapper.hasClass('show')).to.be.false;
    });

    it('should be hidden when the loading state is true', function() {
        let wrapper;

        // Set the state to loading.
        this.props.config.isLoading = true;

        wrapper = mountWithContext(<PageLoaderTest { ...this.props } />);

        expect(wrapper.hasClass('hidden')).to.be.false;
        expect(wrapper.hasClass('show')).to.be.true;
    });
});
