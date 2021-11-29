import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { logout } from '../../../../Services/auth';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    color: '#004725'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

export default function FormSelecionarTipoAgendamento(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
  }, []);

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              Selecione um tipo de Agendamento
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <Button className={classes.button} variant="outlined" onClick={() => props.formChange(1)}>
            Consulta
          </Button>
          <Button className={classes.button} variant="outlined" onClick={() => props.formChange(2)}>
            Compromisso
          </Button>
          <Button className={classes.button} variant="outlined" onClick={() => props.formChange(0)}>
            Cancelar
          </Button>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}