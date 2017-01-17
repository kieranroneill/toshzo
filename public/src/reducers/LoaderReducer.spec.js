import LoaderReducer from './LoaderReducer';
import { LoaderActions } from '../actions/index';
import initialState from '../config/state';

describe('loader reducers', () => {
    it('should return the initial state', () => {
        const state = LoaderReducer(initialState.loader, {});

        expect(state).to.eql(initialState.loader);
    });

    it('should return false when the loader is hidden', () => {
        const state = LoaderReducer(null, { type: LoaderActions.HIDE_LOADER });

        expect(state).to.be.false;
    });

    it('should return true when the loader is shown', () => {
        const state = LoaderReducer(null, { type: LoaderActions.SHOW_LOADER });

        expect(state).to.be.true;
    });
});
