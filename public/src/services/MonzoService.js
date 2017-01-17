import BaseService from './BaseService';

const route = '/api/monzo';

class MonzoService {
    static auth(authorisationCode) {
        let url = route + '/auth';

        url += '?authorisationCode=' + authorisationCode;

        return BaseService.httpGet(url);
    }
}

export default MonzoService;
