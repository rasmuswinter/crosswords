import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import SiteNav from './SiteNav';
import Intro from './pages/Intro';
import NewCrossword from './pages/NewCrossword';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <SiteNav/>

        <Grid fluid={true}>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Intro} />
              <Route exact path="/new" component={NewCrossword} />
            </Switch>
          </div>
        </Grid>
      </div>
    );
  }
}