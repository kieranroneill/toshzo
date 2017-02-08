// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AboutPageTest } from './AboutPage';

import { getDefaultProps, mountWithContext } from '../../../../test/react-helpers';

describe('<AboutPage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('before component loads', function() {
        it('should set the page title', function() {
            const wrapper = mountWithContext(<AboutPageTest { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.setPageTitle(strings.pageTitles.ABOUT));
        });
    });
});
