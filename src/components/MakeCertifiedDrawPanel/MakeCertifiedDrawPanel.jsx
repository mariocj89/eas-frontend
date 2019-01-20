import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import PublicModeButton from '../PublicModeButton/PublicModeButton.jsx';

const MakeCertifiedDrawPanel = ({ children, buttonLabel }) => (
  <Card>
    <CardContent>
      <Typography variant="body2" component="p">
        {children}
      </Typography>
    </CardContent>
    <CardActions>
      <PublicModeButton label={buttonLabel} />
    </CardActions>
  </Card>
);

MakeCertifiedDrawPanel.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MakeCertifiedDrawPanel;
