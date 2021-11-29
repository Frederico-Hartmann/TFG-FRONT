import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center" style={{ fontSize: '12px' }}>
      {'Copyright ©  '}
      {new Date().getFullYear()}
      {' - '}
      <Typography color="inherit" to="#" target="_blank" rel="noopener noreferrer">
        Frederico
      </Typography>{' '}
      {' - Todos os direitos reservados.'}
    </Typography>
  );
}
