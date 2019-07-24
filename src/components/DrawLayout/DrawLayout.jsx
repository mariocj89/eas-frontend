import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withRouter } from 'react-router';
import STYLES from './DrawLayout.scss';

const c = classNames.bind(STYLES);
const DrawLayout = ({ sidePanel, children, isMobile }) =>
  isMobile ? (
    <>
      {children}
      {sidePanel && <div className={c('DrawLayout__side-panel')}>{sidePanel}</div>}
    </>
  ) : (
    <div className={c('DrawLayout')}>
      <div className={c(`DrawLayout__content`)}>{children}</div>
      <div className={c('DrawLayout__side-panel')}>{sidePanel}</div>
    </div>
  );

DrawLayout.propTypes = {
  sidePanel: PropTypes.node,
  children: PropTypes.node.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

DrawLayout.defaultProps = {
  sidePanel: null,
};

const mapStateToProps = state => ({ isMobile: state.userRequest.isMobile });
export default withRouter(connect(mapStateToProps)(DrawLayout));
