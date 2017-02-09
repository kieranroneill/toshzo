// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Containers.
import { CategoriesPageTest } from './CategoriesPage';

import { getDefaultProps, mountWithContext } from '../../../../test/react-helpers';

describe('<CategoriesPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('before component loads', function() {
        it('should set the page title', function() {
            const wrapper = mountWithContext(<CategoriesPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(strings.pageTitles.CATEGORIES));
        });
    });
});
