import { IconButton } from 'material-ui';
import { green300 } from 'material-ui/styles/colors';
import React from 'react';

import './Footer.scss';

// Components.
import GitHubSvgIcon from '../GitHubSvgIcon/GitHubSvgIcon';

const styles = {
    button: {
        width: 48,
        height: 48,
        padding: 0
    },
    icon: {
        width: 48,
        height: 48
    }
};

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div className="footer__container">
                    <div className="footer__item">Made with &hearts; by Kieran O'Neill</div>
                    <div className="footer__item">
                        <IconButton
                            href="https://github.com/kieranroneill/toshzo"
                            target="_blank"
                            tooltip="Free as in speech!"
                            tooltipPosition="bottom-center"
                            style={ styles.button }
                            iconStyle={ styles.icon }>
                            <GitHubSvgIcon hoverColor={ green300 } viewBox="0 0 16 16" />
                        </IconButton>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
