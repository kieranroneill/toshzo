// Strings.
import strings from '../../config/strings.json';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { DashboardPageTest } from './DashboardPage';

import { getDefaultProps, mountWithContext } from '../../test/utilities';

describe('<DashboardPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('before component loads', function() {
        it('should set the page title', function() {
            const wrapper = mountWithContext(<DashboardPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(strings.pageTitles.DASHBOARD));
        });
    });

    describe('after component loads', function() {
        it('should hide the loader', function() {
            const wrapper = mountWithContext(<DashboardPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.hideLoader());
        });
    });
});
