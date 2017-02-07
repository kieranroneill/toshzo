// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AccountsPageTest } from './AccountsPage';

import { getDefaultProps, mountWithContext } from '../../../../test/react-helpers';

describe('<AccountsPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('before component loads', function() {
        it('should set the page title', function() {
            const wrapper = mountWithContext(<AccountsPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(strings.pageTitles.ACCOUNTS));
        });
    });
});
