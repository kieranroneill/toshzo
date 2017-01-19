import ConfigReducer from './ConfigReducer';
import { ConfigActions } from '../actions/index';
import { ConfigState as initialConfigState } from '../states/index';

describe('config reducers', () => {
    beforeEach(function() {
        this.initialState = initialConfigState;
    });

    it('should return the initial state', function() {
        const state = ConfigReducer(this.initialState, {});

        expect(state).to.equal(this.initialState);
    });

    describe('when setting the page title', function() {
        it('should use the default state if the page title is null', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.SET_PAGE_TITLE, value: null });

            expect(state.pageTitle).to.equal(this.initialState.pageTitle);
        });

        it('should use the default state if the page title is a number', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.SET_PAGE_TITLE, value: 42 });

            expect(state.pageTitle).to.equal(this.initialState.pageTitle);
        });

        it('should use the default state if the page title is an empty string', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.SET_PAGE_TITLE, value: '' });

            expect(state.pageTitle).to.equal(this.initialState.pageTitle);
        });

        it('should change the page title to the specified string', function() {
            const pageTitle = 'It began with a spark';
            const state = ConfigReducer(this.initialState, { type: ConfigActions.SET_PAGE_TITLE, value: pageTitle });

            expect(state.pageTitle).to.equal(pageTitle);
        });
    });

    describe('when actioning the page loader', function() {
        it('should return false when the loader is hidden', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.HIDE_LOADER });

            expect(state.isLoading).to.be.false;
        });

        it('should return true when the loader is shown', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.SHOW_LOADER });

            expect(state.isLoading).to.be.true;
        });
    });

    describe('when the drawer is open/closed', function() {
        it('should open the drawer if it is closed', function() {
            let state;

            this.initialState.isDrawerOpen = false;

            state = ConfigReducer(this.initialState, { type: ConfigActions.TOGGLE_DRAWER });

            expect(state.isDrawerOpen).to.be.true;
        });

        it('should close the drawer if it is open', function() {
            let state;

            this.initialState.isDrawerOpen = true;

            state = ConfigReducer(this.initialState, { type: ConfigActions.TOGGLE_DRAWER });

            expect(state.isDrawerOpen).to.be.false;
        });
    });

    describe('when setting the snack bar', function() {
        it('should not open the snack bar if the message is null', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.OPEN_SNACK_BAR, value: null });

            expect(state.snackBar.isOpen).to.be.false;
        });

        it('should not open the snack bar if the message is an empty string', function() {
            const state = ConfigReducer(this.initialState, { type: ConfigActions.OPEN_SNACK_BAR, value: '' });

            expect(state.snackBar.isOpen).to.be.false;
        });

        it('should open the snack bar with the required message', function() {
            const message = 'Open sesame!';
            const state = ConfigReducer(this.initialState, { type: ConfigActions.OPEN_SNACK_BAR, value: message });

            expect(state.snackBar.isOpen).to.be.true;
            expect(state.snackBar.message).to.equal(message);
        });
    });
});
