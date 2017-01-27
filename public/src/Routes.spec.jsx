import { Route } from 'react-router';

import Routes, { isAuthorised, onAppEnter, onAuthEnter } from './Routes';

// Strings.
import strings from './config/strings.json';

// Components.
import AboutPage from './components/AboutPage/AboutPage';
import App from './components/App/App';
import AuthPage from './components/AuthPage/AuthPage';
import DashboardPage from './components/DashboardPage/DashboardPage';
import ErrorPage from './components/ErrorPage/ErrorPage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import TeapotPage from './components/TeapotPage/TeapotPage';

// ActionCreators.
import { InfoActionCreators, ReferencesActionCreators } from './action-creators/index';

// Services.
import { InfoService, SessionService, ReferencesService } from './services/index';

// States.
import { InfoState as initialInfoState, ReferencesState as initialReferencesState } from './states/index';

import { getDefaultPropsWithStore, shallowWithContext } from './test/utilities';

/**
 * Gets a map that links a route to it's corresponding component.
 * @param wrapper a mounted route.
 * @return a map that maps a route to a component.
 */
const getRouteMap = wrapper => {
    return wrapper
        .find(Route)
        .reduce((map, route) => {
            const props = route.props();

            map[props.path] = props;

            return map;
        }, {});
};
const mockNextState = {
    location: {
        action: 'POP',
        hash: '',
        key: 'aKey',
        pathname: '/' + strings.routes.DASHBOARD, // Default route.
        query: {},
        search: '',
        state: undefined
    },
    params: {},
    routes: []
};

describe('<Routes />', () => {
    beforeEach(function () {
        this.props = getDefaultPropsWithStore();
        this.mockNextState = mockNextState;
        this.wrapper = shallowWithContext(<Routes { ...this.props }/>);

        this.dispatchSpy = spy(this.props.store, 'dispatch');
        this.getInfoStub = stub(InfoService, 'getInfo');
        this.getReferencesStub = stub(ReferencesService, 'getReferences');
        this.replaceStub = stub();
        this.verifySessionTokenStub = stub(SessionService, 'verifySessionToken');
    });

    afterEach(function () {
        delete this.props;
        delete this.mockNextState;
        delete this.wrapper;

        this.dispatchSpy.restore();
        this.getInfoStub.restore();
        this.getReferencesStub.restore();
        this.verifySessionTokenStub.restore();
    });

    describe('when rendering routes', function() {
        it('should render the correct routes', function() {
            const pathMap = getRouteMap(this.wrapper);

            expect(pathMap['/'].component).to.equal(App);
            expect(pathMap[strings.routes.ABOUT].component).to.equal(AboutPage);
            expect(pathMap[strings.routes.AUTH].component).to.equal(AuthPage);
            expect(pathMap[strings.routes.DASHBOARD].component).to.equal(DashboardPage);
            expect(pathMap[strings.routes.ERROR].component).to.equal(ErrorPage);
            expect(pathMap['*'].component).to.equal(NotFoundPage);
            expect(pathMap[strings.routes.TEAPOT].component).to.equal(TeapotPage);
        });
    });

    describe('when entering the base route', function() {
        it('should redirect to the error page if there is an error getting the server information', function(done) {
            const references = initialReferencesState;

            this.getInfoStub.rejects();
            this.getReferencesStub.resolves(references);

            onAppEnter(this.props, this.mockNextState, this.replaceStub, () => {
                assert.calledWith(this.replaceStub, '/' + strings.routes.ERROR);

                done();
            });
        });

        it('should redirect to the error page if there is an error getting the references', function(done) {
            const info = initialInfoState;

            this.getInfoStub.resolves(info);
            this.getReferencesStub.rejects();

            onAppEnter(this.props, this.mockNextState, this.replaceStub, () => {
                assert.calledWith(this.replaceStub, '/' + strings.routes.ERROR);

                done();
            });
        });

        it('should get the server information & references and update state', function(done) {
            const info = initialInfoState;
            const references = initialReferencesState;

            this.getInfoStub.resolves(info);
            this.getReferencesStub.resolves(references);

            onAppEnter(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;
                assert.called(this.getInfoStub);
                assert.called(this.getReferencesStub);
                assert.calledWith(this.dispatchSpy, InfoActionCreators.setInfo(info));
                assert.calledWith(this.dispatchSpy, ReferencesActionCreators.setReferences(references));

                done();
            });
        });
    });

    describe('when entering the auth page', function() {
        it('should redirect to the dashboard if the user has a valid session token', function(done) {
            const sessionToken = 'Thank the Lord [Gabe], I am a valid token!';

            this.props.config.sessionToken = sessionToken;

            this.verifySessionTokenStub.resolves();

            onAuthEnter(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;

                assert.calledWith(this.replaceStub, '/' + strings.routes.DASHBOARD);

                done();
            });
        });

        it('should continue to the auth page if the session token is null', function(done) {
            this.props.config.sessionToken = null;

            onAuthEnter(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;

                assert.notCalled(this.verifySessionTokenStub);
                assert.notCalled(this.replaceStub);

                done();
            });
        });

        it('should continue to the auth page if the session token is invalid', function(done) {
            const sessionToken = 'I am invalid and won\'t get you anywhere';

            this.props.config.sessionToken = sessionToken;

            this.verifySessionTokenStub.rejects();

            onAuthEnter(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;

                assert.calledWith(this.verifySessionTokenStub, sessionToken);
                assert.notCalled(this.replaceStub);

                done();
            });
        });
    });

    describe('when routing to an authorised route', function() {
        it('should redirect to the auth page if there is not session token', function(done) {
            this.props.config.sessionToken = null;

            isAuthorised(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;

                assert.notCalled(this.verifySessionTokenStub);
                assert.calledWith(this.replaceStub, '/' + strings.routes.AUTH);

                done();
            });
        });

        it('should redirect to the auth page if the session token is invalid', function(done) {
            const sessionToken = 'I am invalid and won\'t get you anywhere';

            this.props.config.sessionToken = sessionToken;

            this.verifySessionTokenStub.rejects();

            isAuthorised(this.props, this.mockNextState, this.replaceStub, () => {
                assert.calledWith(this.verifySessionTokenStub, sessionToken);
                assert.calledWith(this.replaceStub, '/' + strings.routes.AUTH);

                done();
            });
        });

        it('should continue on if the session token is valid', function(done) {
            const sessionToken = 'Thank the Lord [Gabe], I am a valid token!';

            this.props.config.sessionToken = sessionToken;

            this.verifySessionTokenStub.resolves();

            isAuthorised(this.props, this.mockNextState, this.replaceStub, error => {
                expect(error).to.be.null;

                assert.calledWith(this.verifySessionTokenStub, sessionToken);
                assert.notCalled(this.replaceStub);

                done();
            });
        });
    });
});
