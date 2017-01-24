// Services.
import { ReferencesService } from '../../services/index';

// ActionCreators
import { ConfigActionCreators } from '../../action-creators/index';

// Components.
import { AppTest } from './App';

import { getDefaultPropsWithStore, shallowWithContext } from '../../test/utilities';

describe('<App />', () => {
    beforeEach(function () {
        this.props = getDefaultPropsWithStore();

        this.getReferencesStub = stub(ReferencesService, 'getReferences');
    });

    afterEach(function () {
        delete this.props;

        this.getReferencesStub.restore();
    });

    describe('before component loads', function() {
        it('should show the loader', function() {
            let instance;

            this.getReferencesStub.resolves();

            instance = shallowWithContext(<AppTest { ...this.props } />)
                .instance();

            assert.calledWith(instance.props.dispatch, ConfigActionCreators.showLoader());
        });

        it('should get the references', function() {
            this.getReferencesStub.resolves();

            shallowWithContext(<AppTest { ...this.props } />);

            assert.calledOnce(this.getReferencesStub);
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
