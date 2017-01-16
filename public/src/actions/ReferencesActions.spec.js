import * as ReferencesActions from './ReferencesActions';

const mockStore = configureMockStore([ thunk ]);

describe('references actions', () => {
    const store = mockStore();

    beforeEach(function() {
        this.axiosGetStub = stub(axios, 'get');
    });

    afterEach(function() {
        this.axiosGetStub.restore();
    });

    it('should create an action to get the references', function(done) {
        const references = {
            monzo: {
                clientId: 'yo, this monzo-iness!'
            }
        };
        const expectedAction = [
            {
                type: ReferencesActions.GET_REFERENCES_SUCCESS,
                references
            }
        ];

        // Stub the HTTP request.
        this.axiosGetStub.resolves({ data: references });

        store
            .dispatch(ReferencesActions.getReferences())
            .then(() => {
                expect(store.getActions()).to.eql(expectedAction);

                done();
            });
    });
});
