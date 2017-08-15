import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grid } from 'react-bootstrap';

import SiteNav from './SiteNav';
import Intro from './pages/Intro';
import NewCrossword from './pages/NewCrossword';
import ViewCrossword from './pages/ViewCrossword';

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
              <Route exact path="/:crosswordId" component={ViewCrossword} />
            </Switch>
          </div>
        </Grid>
      </div>
    );
  }
}