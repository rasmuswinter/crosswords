import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HTML extends Component {
  render() {
    const { assets } = this.props;

    // assets.main can either be just the main js, or an array of the main js plus a hot-update
    const jsPath = '/static/' + (Array.isArray(assets.main) ? assets.main[0] : assets.main);

    return (
      <html>
      <head>
        <title>Crosswords!</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="shortcut icon" href="/img/favicon.ico" />
      </head>
      <body>
        <div id="root" />
        <script src={jsPath}/>
      </body>
      </html>
    );
  }
}

HTML.propTypes = {
  assets: PropTypes.object
};
