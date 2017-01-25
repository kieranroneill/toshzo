import InfoReducer from './InfoReducer';
import { InfoActions } from '../actions/index';
import { InfoState as initialInfoState } from '../states/index';

describe('info reducers', () => {
    beforeEach(function() {
        this.initialState = initialInfoState;
    });

    afterEach(function() {
        delete this.initialState;
    });

    describe('when checking the initial state', function() {
        it('should return the initial state', function() {
            const state = InfoReducer(this.initialState, {});

            expect(state).to.deep.equal(this.initialState);
        });
    });

    describe('when setting the info', function() {
        it('should use the initial state if the references are null', function() {
            const state = InfoReducer(this.initialState, { type: InfoActions.SET_INFO, value: null });

            expect(state).to.deep.equal(this.initialState);
        });

        it('should only set the valid references', function() {
            const info = {
                description: 'I\'m in!',
                r2d2: 'hopefully I am ignored'
            };
            const state = InfoReducer(this.initialState, {
                type: InfoActions.SET_INFO,
                value: info
            });

            expect(state).to.have.property('description');
            expect(state.description).to.equal(info.description);

            expect(state).to.not.have.property('r2d2');
        });
    });
});
