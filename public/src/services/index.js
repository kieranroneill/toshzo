import InfoService from './InfoService';
import MonzoService from './MonzoService';
import ReferencesService from './ReferencesService';
import SessionService from './SessionService';
import ToshlService from './ToshlService';

export default function createServices(store) {
    return {
        info: new InfoService(store),
        monzo: new MonzoService(store),
        references: new ReferencesService(store),
        session: new SessionService(store),
        toshl: new ToshlService(store)
    };
}
