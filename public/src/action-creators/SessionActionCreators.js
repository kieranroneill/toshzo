import { SessionActions } from '../actions/index';

export const resetSessionState = () => ({ type: SessionActions.RESET_SESSION_STATE });

export const setAuthenticationState = value => ({ type: SessionActions.SET_AUTHENTICATION_STATE, value: value });

export const setSessionToken = value => ({ type: SessionActions.SET_SESSION_TOKEN, value: value });
