import BaseService from './BaseService';

// Strings.
import strings from '../../../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.MONZO;

class MonzoService extends BaseService {
    createMonzoRedirectUri() {
        return window.location.protocol + '//' +
            window.location.hostname +
            (window.location.port ? ':' + window.location.port : '') +
            '/' + strings.routes.AUTH;
    }

    getAccessToken(stateToken, authorisationCode) {
        const url = route + strings.endpoints.TOKEN + strings.endpoints.ACCESS;
        const body = {
            code: authorisationCode,
            redirectUri: MonzoService.createMonzoRedirectUri(),
            token: stateToken
        };

        return this.httpPost(url, body);
    }

    getAccounts() {
        const url = route + strings.endpoints.ACCOUNTS;

        return this.httpGet(url);
    }

    getStateToken() {
        let url = route + strings.endpoints.TOKEN + strings.endpoints.STATE;

        return this.httpPost(url, {});
    }
}

export default new MonzoService();
