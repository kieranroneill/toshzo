import { IconButton } from 'material-ui';
import { green300 } from 'material-ui/styles/colors';
import React from 'react';

import './Footer.scss';

// Strings.
import strings from '../../config/strings.json';

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
                            href={ strings.links.GITHUB_SOURCE }
                            target="_blank"
                            tooltip={ strings.tooltipMessages.FREE_AS_IN_SPEECH }
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
