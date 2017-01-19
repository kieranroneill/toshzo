import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { purple500, purple700, green500, green700 } from 'material-ui/styles/colors';

/**
 * Implements the main theme for use in Material UI.
 */
export default getMuiTheme({
    palette: {
        primary1Color: purple500,
        primary2Color: purple700,
        accent1Color: green500,
        accent2Color: green700,
        pickerHeaderColor: purple500
    }
});
