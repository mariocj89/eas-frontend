import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames/bind';

import STYLES from './DrawCard.scss';

const c = classNames.bind(STYLES);

const ExternalLink = ({ children, ...rest }) => <a {...rest}>{children}</a>;

ExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
};

const DrawCard = ({ to, externalHref, icon, children }) => {
  const LinkComponent = to ? Link : ExternalLink;
  return (
    <LinkComponent className={c('DrawCard__link')} to={to} href={externalHref}>
      <div className={c('DrawCard')}>
        <img className={c('DrawCard__icon')} src={icon} alt={children} />
        <Typography className={c('DrawCard__title')}>{children}</Typography>
      </div>
    </LinkComponent>
  );
};

DrawCard.propTypes = {
  children: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  externalHref: PropTypes.string,
  to: PropTypes.string,
};

DrawCard.defaultProps = {
  externalHref: undefined,
  to: undefined,
};
export default DrawCard;
