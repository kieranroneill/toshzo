// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import BasePage from './BasePage';

import { getDefaultProps, mountWithContext } from '../../../../test/react-helpers';

describe('<BasePage />', () => {
    beforeEach(function() {
        this.props = getDefaultProps();
    });

    afterEach(function() {
        delete this.props;
    });

    describe('after component loads', function() {
        it('should hide the loader', function() {
            const wrapper = mountWithContext(<BasePage { ...this.props } />);

            assert.calledWith(wrapper.props().dispatch, ConfigActionCreators.hideLoader());
        });
    });
});
