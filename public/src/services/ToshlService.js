import BaseService from './BaseService';

const route = '/api/toshl';

class ToshlService {

    static verifyToken(personalToken) {
        let url = route + '/token';

        url += '?token=' + personalToken;

        return BaseService.httpGet(url);
    }
}

export default ToshlService;
