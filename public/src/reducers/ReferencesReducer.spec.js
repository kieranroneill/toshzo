import ReferencesReducer from './ReferencesReducer';
import { ReferencesActions } from '../actions/index';
import initialState from './state';

describe('references reducers', () => {
    it('should return the initial state', () => {
        const state = ReferencesReducer(initialState.references, {});

        expect(state).to.eql(initialState.references);
    });

    it('should return expected state', () => {
        const references = {
            monzo: {
                clientId: 'yo, this monzo-iness!'
            }
        };
        const state = ReferencesReducer(references, { type: ReferencesActions.GET_REFERENCES_SUCCESS, references });

        expect(state).to.eql(references);
    });
});
