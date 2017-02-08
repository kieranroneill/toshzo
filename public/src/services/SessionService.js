import Promise from 'bluebird';

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
            .then(() => this.store.dispatch(SessionActionCreators.setAuthenticationState(true)))
            .catch(error => {
                // If we have an unauthorised status, invalidate the session.
                if(error.status === 401) {
                    this.store.dispatch(SessionActionCreators.resetSessionState());
                }

                return Promise.reject(error);
            });
    }
}

export default SessionService;
