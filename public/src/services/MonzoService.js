import BaseService from './BaseService';

const route = '/api/monzo';

class MonzoService {
    static getStateToken() {
        let url = route + '/token/state';

        return BaseService.httpPost(url, {});
    }

    static getAccessToken(stateToken, authorisationCode) {
        let url = route + '/token/access';

        url += '?token=' + stateToken;
        url += '&code=' + authorisationCode;

        return BaseService.httpPost(url, {});
    }
}

export default MonzoService;
