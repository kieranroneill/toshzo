// Components.
import { ToshzoDrawerTest } from './ToshzoDrawer';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Store.
import { ConfigState as initialConfigState } from '../../states/index';

import { getDefaultProps, shallowWithContext } from '../../../../test/react-helpers';

describe('<ToshzoDrawer />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('when setting the drawer open/close state', function() {
        it('should be set to close for the initial state', function() {
            const wrapper = shallowWithContext(<ToshzoDrawerTest { ...this.props } />);
            const instance = wrapper.instance();

            expect(instance.props.config.isDrawerOpen).to.equal(initialConfigState.isDrawerOpen);
            expect(wrapper.props().open).to.equal(initialConfigState.isDrawerOpen);
        });

        it('should be open if the state configuration is true', function() {
            let wrapper;

            this.props.config.isDrawerOpen = true;

            wrapper = shallowWithContext(<ToshzoDrawerTest { ...this.props } />);

            expect(wrapper.props().open).to.be.true;
        });
    });

    describe('when clicking the close navigation button', function() {
        it('should close the navigation drawer', function() {
            const instance = shallowWithContext(<ToshzoDrawerTest { ...this.props } />)
                .instance();

            instance.onNavigationCloseClick();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.toggleDrawer());
        });
    });
});
