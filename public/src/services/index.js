import InfoService from './InfoService';
import MonzoService from './MonzoService';
import ReferencesService from './ReferencesService';
import SessionService from './SessionService';
import ToshlService from './ToshlService';

export default function createServices(store) {
    return {
        InfoService: new InfoService(store),
        MonzoService: new MonzoService(store),
        ReferencesService: new ReferencesService(store),
        SessionService: new SessionService(store),
        ToshlService: new ToshlService(store)
    };
}
