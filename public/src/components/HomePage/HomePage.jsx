import { Card, CardActions, CardHeader, FlatButton } from 'material-ui';
import React from 'react';
import { Link } from 'react-router';

class HomePage extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader
                    title="Without Avatar"
                    subtitle="Wazzzzup"
                />
                <CardActions>
                    <FlatButton
                        label="About"
                        containerElement={<Link to="/about" />}/>
                </CardActions>
            </Card>
        );
    }
}

HomePage.propTypes = {
    dispatch: React.PropTypes.func
};

export default HomePage;
