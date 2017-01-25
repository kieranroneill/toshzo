// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AppTest } from './App';

import { getDefaultPropsWithStore, shallowWithContext } from '../../test/utilities';

describe('<App />', () => {
    beforeEach(function () {
        this.props = getDefaultPropsWithStore();
    });

    afterEach(function () {
        delete this.props;
    });

    describe('after component loads', function() {
        it('should hide the loader', function() {
            const instance = shallowWithContext(<AppTest { ...this.props } />)
                .instance();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.hideLoader());
        });
    });

    describe('when the snack bar closes', function() {
        it('should reset the state of the snack bar on close', function() {
            let instance;

            this.getReferencesStub.resolves();

            instance = shallowWithContext(<AppTest { ...this.props } />)
                .instance();

            instance.onSnackBarClose();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.resetSnackBar());
        });
    });
});
