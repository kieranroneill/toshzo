// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AppTest } from './App';

// Helpers.
import { getDefaultProps, shallowWithContext } from '../../../../test/react-helpers';

describe('<App />', () => {
    beforeEach(function () {
        this.props = getDefaultProps();
    });

    afterEach(function () {
        delete this.props;
    });

    describe('when the snack bar closes', function() {
        it('should reset the state of the snack bar on close', function() {
            const instance = shallowWithContext(<AppTest { ...this.props } />)
                .instance();

            instance.onSnackBarClose();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.resetSnackBar());
        });
    });
});
