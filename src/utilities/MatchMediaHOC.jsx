/*
  // SOURCE: https://github.com/viruschidai/react-match-media
  // USAGE:

  import React from 'react';
  import ReactDOM from 'react-dom';
  import { MatchMediaHOC } from 'utilities';

  const ComponentForBigScreen = MatchMediaHOC(SomeComponent, '(min-width: 800px)');
  const ComponentForSmallScreen = MatchMediaHOC(SomeComponent, '(max-width: 500px)');

  ReactDOM.render(
    <div className="example">
      <SomeElementAlwaysRendered />
      <ComponentForBigScreen />
      <ComponentForSmallScreen />
    </div>,
    document.getElementById('root')
  )

*/

// COMPONENT
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class MatchMedia extends Component {

  constructor(props) {
    super(props);
    this.state = {show: false};
    this.mql = null;
    this.onMatch = (mql) => this._onMatch(mql);
  }

  componentDidMount() {
    if ( !window.matchMedia ) return;
    this.mql = window.matchMedia(this.props.mediaQuery);
    this.mql.addListener(this.onMatch);
    this.onMatch(this.mql);
  }

  componentWillUnmount() {
    this.mql && this.mql.removeListener(this.onMatch);
  }

  _onMatch(mql) {
    const show = !!mql.matches;
    this.setState({show});
  }

  render() {
    if (!this.props.children || !isClient() || !this.state.show) return false;

    return(
      <div className="match-media">
        {this.props.children}
      </div>
    );
  }
}

MatchMedia.propTypes = {
  mediaQuery: PropTypes.string.isRequired
};

function isClient() {
  return typeof window !== 'undefined';
}