import { Card, CardActions, CardHeader, FlatButton } from 'material-ui';
import React from 'react';
import { Link } from 'react-router';

class Home extends React.Component {
    render() {
        return (
            <Card>
                <CardHeader
                    title="Without Avatar"
                    subtitle="Subtitle"
                />
                <CardActions>
                    <FlatButton
                        containerElement={<Link to="/about" />}
                        linkButton={true}
                        label="About"/>
                </CardActions>
            </Card>
        );
    }
}

export default Home;
