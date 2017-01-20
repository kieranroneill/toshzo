import * as ReferencesActionCreators from './ReferencesActionCreators';
import { ReferencesActions } from '../actions/index';

describe('reference actions', () => {
    it('should create an action to set the references', () => {
        const references = {
            monzo: {
                clientId: 'Imma super duper ID!!!!'
            }
        };
        const expectedAction = { type: ReferencesActions.SET_REFERENCES, value: references };

        expect(ReferencesActionCreators.setReferences(references)).to.deep.equal(expectedAction);
    });
});
