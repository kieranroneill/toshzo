import BaseService from './BaseService';

const route = '/api/monzo';

class MonzoService {
    static auth(authorisationCode) {
        let url = route + '/auth';

        url += '?authorisationCode=' + authorisationCode;

        return BaseService.httpGet(url);
    }

    static getToken() {
        let url = route + '/token';

        return BaseService.httpPost(url, {});
    }

    static verifyToken(stateToken, accessToken) {
        let url = route + '/token';

        url += '?stateToken=' + stateToken;
        url += '&accessToken=' + accessToken;

        return BaseService.httpGet(url);
    }
}

export default MonzoService;
