import * as ConfigActionCreators from './ConfigActionCreators';
import { ConfigActions } from '../actions/index';

describe('config actions', () => {
    it('should create an action to set the page title', () => {
        const pageTitle = 'I am a title!';
        const expectedAction = { type: ConfigActions.SET_PAGE_TITLE, value: pageTitle };

        expect(ConfigActionCreators.setPageTitle(pageTitle)).to.deep.equal(expectedAction);
    });

    it('should create an action to show the loader', () => {
        const expectedAction = { type: ConfigActions.SHOW_LOADER };

        expect(ConfigActionCreators.showLoader()).to.deep.equal(expectedAction);
    });

    it('should create an action to hide the loader', () => {
        const expectedAction = { type: ConfigActions.HIDE_LOADER };

        expect(ConfigActionCreators.hideLoader()).to.deep.equal(expectedAction);
    });
});
