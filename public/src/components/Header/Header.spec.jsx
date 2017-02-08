import { AppBar } from 'material-ui';

// Strings.
import strings from '../../../../config/strings.json';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { HeaderTest } from './Header';

import { getDefaultProps, shallowWithContext } from '../../../../test/react-helpers';

describe('<Header />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('when setting the page title', function() {
        it('should have the initial title', function() {
            const wrapper = shallowWithContext(<HeaderTest { ...this.props } />);

            expect(wrapper.find(AppBar).props().title).to.equal(strings.APP_TITLE);
        });

        it('should set the page title based on the updated state', function() {
            let wrapper;

            // Set the page title.
            this.props.config.pageTitle = strings.pageTitles.ABOUT;

            wrapper = shallowWithContext(<HeaderTest { ...this.props } />);

            expect(wrapper.find(AppBar).props().title).to.equal(strings.pageTitles.ABOUT);
        });
    });

    describe('when clicking the left navigation icon', function() {
        it('should open the navigation drawer', function() {
            const instance = shallowWithContext(<HeaderTest { ...this.props } />)
                .instance();

            instance.onNavigationOpenClick();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.toggleDrawer());
        });
    });
});
