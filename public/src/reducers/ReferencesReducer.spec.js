import ReferencesReducer from './ReferencesReducer';
import { ReferencesActions } from '../actions/index';
import { ReferencesState as initialReferencesState } from '../states/index';

describe('references reducers', () => {
    beforeEach(function() {
        this.initialState = initialReferencesState;
    });

    afterEach(function() {
        delete this.initialState;
    });

    describe('when checking the initial state', function() {
        it('should return the initial state', function() {
            const state = ReferencesReducer(this.initialState, {});

            expect(state).to.deep.equal(this.initialState);
        });
    });

    describe('when setting the references', function() {
        it('should use the initial state if the references are null', function() {
            const state = ReferencesReducer(this.initialState, { type: ReferencesActions.SET_REFERENCES, value: null });

            expect(state).to.deep.equal(this.initialState);
        });

        it('should only set the valid references', function() {
            const references = {
                monzo: {
                    clientId: 'cooooool!!'
                },
                unknown: 'hopefully I am ignored'
            };
            const state = ReferencesReducer(this.initialState, {
                type: ReferencesActions.SET_REFERENCES,
                value: references
            });

            expect(state).to.have.property('monzo');
            expect(state.monzo).to.deep.equal(references.monzo);
            expect(state).to.not.have.property('unknown');
        });
    });
});
