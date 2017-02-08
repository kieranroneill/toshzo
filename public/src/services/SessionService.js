import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

// ActionCreators.
import { SessionActionCreators } from '../action-creators/index';

const route = strings.endpoints.API + strings.endpoints.SESSION;

class SessionService extends BaseService {
    constructor(store) {
        super(store);
    }

    createSessionToken(monzoToken, toshlToken) {
        return this.httpPost(route, { monzoToken: monzoToken, toshlToken: toshlToken });
    }

    verifySessionToken(token) {
        const url = route + '?token=' + token;

        return this.httpGet(url)
            .then(() => this.store.dispatch(SessionActionCreators.setAuthenticationState(true)));
    }
}

export default SessionService;
