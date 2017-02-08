import { IconButton } from 'material-ui';
import { green300 } from 'material-ui/styles/colors';
import React from 'react';
import { connect } from 'react-redux';

import './Footer.scss';

// Strings.
import strings from '../../../../config/strings.json';

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
                    <div className="footer__item">Made with &hearts; by { this.props.info.author }</div>
                    <div className="footer__item">
                        <IconButton
                            href={ this.props.info.source }
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

Footer.propTypes = {
    info: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        info: state.info
    };
}

export default connect(mapStateToProps)(Footer);
export { Footer as FooterTest }; // Export for testing.
