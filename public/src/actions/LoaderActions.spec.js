import * as LoaderActions from './LoaderActions';

describe('loader actions', () => {
    it('should create an action to show the loader', () => {
        const expectedAction = { type: LoaderActions.SHOW_LOADER };

        expect(LoaderActions.showLoader()).to.eql(expectedAction);
    });

    it('should create an action to hide the loader', () => {
        const expectedAction = { type: LoaderActions.HIDE_LOADER };

        expect(LoaderActions.hideLoader()).to.eql(expectedAction);
    });
});
