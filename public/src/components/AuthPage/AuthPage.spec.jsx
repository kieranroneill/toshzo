import { mountTestComponent } from '../../test/utilities';

import AuthPage from './AuthPage';

describe('<AuthPage />', () => {
    describe('before component loads', function() {
        it('should have the initial state', function() {
            const wrapper = mountTestComponent(AuthPage, '/auth');
            const props = wrapper.props();
            const state = wrapper.state();

            expect(wrapper.state()).to.have.property('finished');
            expect(wrapper.state().finished).to.be.false;
        });
    });
});
