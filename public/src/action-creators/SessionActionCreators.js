import { SessionActions } from '../actions/index';

export const setSessionToken = value => ({ type: SessionActions.SET_SESSION_TOKEN, value: value });
