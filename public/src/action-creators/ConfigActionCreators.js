import { ConfigActions } from '../actions/index';

export const hideLoader = () => ({ type: ConfigActions.HIDE_LOADER });

export const openSnackBar = value => ({ type: ConfigActions.OPEN_SNACK_BAR, value: value });

export const setPageTitle = value => ({ type: ConfigActions.SET_PAGE_TITLE, value: value });

export const showLoader = () => ({ type: ConfigActions.SHOW_LOADER });

export const toggleDrawer = () => ({ type: ConfigActions.TOGGLE_DRAWER });
