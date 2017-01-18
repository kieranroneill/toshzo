import ConfigReducer from './ConfigReducer';
import { ConfigActions } from '../actions/index';
import { ConfigState } from '../states/index';

describe('config reducers', () => {
    it('should return the initial state', () => {
        const state = ConfigReducer(ConfigState, {});

        expect(state).to.equal(ConfigState);
    });

    describe('when setting the page title', () => {
        it('should use the default state if the page title is null', () => {
            const state = ConfigReducer(ConfigState, { type: ConfigActions.SET_PAGE_TITLE, value: null });

            expect(state.pageTitle).to.equal(ConfigState.pageTitle);
        });

        it('should use the default state if the page title is a number', () => {
            const state = ConfigReducer(ConfigState, { type: ConfigActions.SET_PAGE_TITLE, value: 42 });

            expect(state.pageTitle).to.equal(ConfigState.pageTitle);
        });

        it('should use the default state if the page title is an empty string', () => {
            const state = ConfigReducer(ConfigState, { type: ConfigActions.SET_PAGE_TITLE, value: '' });

            expect(state.pageTitle).to.equal(ConfigState.pageTitle);
        });

        it('should change the page title to the specified string', () => {
            const pageTitle = 'It began with a spark';
            const state = ConfigReducer(ConfigState, { type: ConfigActions.SET_PAGE_TITLE, value: pageTitle });

            expect(state.pageTitle).to.equal(pageTitle);
        });
    });

    describe('when actioning the page loader', () => {
        it('should return false when the loader is hidden', () => {
            const state = ConfigReducer(ConfigState, { type: ConfigActions.HIDE_LOADER });

            expect(state.isLoading).to.be.false;
        });

        it('should return true when the loader is shown', () => {
            const state = ConfigReducer(ConfigState, { type: ConfigActions.SHOW_LOADER });

            expect(state.isLoading).to.be.true;
        });
    });
});
