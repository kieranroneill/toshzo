import BaseService from './BaseService';

// Strings.
import strings from '../config/strings.json';

const route = strings.endpoints.API + strings.endpoints.MONZO;

class MonzoService {
    static getStateToken() {
        let url = route + strings.endpoints.TOKEN + strings.endpoints.STATE;

        return BaseService.httpPost(url, {});
    }

    static getAccessToken(stateToken, authorisationCode) {
        let url = route + strings.endpoints.TOKEN + strings.endpoints.ACCESS;

        url += '?token=' + stateToken;
        url += '&code=' + authorisationCode;

        return BaseService.httpPost(url, {});
    }
}

export default MonzoService;
