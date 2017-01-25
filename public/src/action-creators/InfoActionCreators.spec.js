import * as InfoActionCreators from './InfoActionCreators';
import { InfoActions } from '../actions/index';

describe('info actions', () => {
    it('should create an action to set the info', () => {
        const info = {
            author: 'I am made by the best!!!',
            description: 'I am an amzing application',
            version: '0.0.0'
        };
        const expectedAction = { type: InfoActions.SET_INFO, value: info };

        expect(InfoActionCreators.setInfo(info)).to.deep.equal(expectedAction);
    });
});
