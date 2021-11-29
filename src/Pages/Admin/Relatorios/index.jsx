import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faBook } from '@fortawesome/free-solid-svg-icons'

import { getToken, logout } from '../../../Services/auth';
import api from '../../../Services/api';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../Utils/showToast';
import Button from '@material-ui/core/Button';
import Grid from '@mui/material/Grid';
import { Typography } from '@material-ui/core';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import RelatorioClientes from '../../../Components/Forms/Relatorios/RelatorioClientes'
import RelatorioAgendamentos from '../../../Components/Forms/Relatorios/RelatorioAgendamentos'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  panels: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function Home() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [formRelatorioOpen, setFormRelatorioOpen] = useState(0);

  const handleFormRelatorioChange = (idRelatorio) => {
    setFormRelatorioOpen(idRelatorio);
  }

  function handleLogout() {
    logout();
    history.push('/');
  }

  return (
    <React.Fragment>
      <div className='app'>
        <Logo />
        <Nav />
        <Main icon={faBook} title="Relatórios" subtitle="Geração de Relatórios">
          <ToastAnimated />
          <div className={classes.panels} >
            {
              (formRelatorioOpen == 0) &&
              <div style={{height: 'calc(100vh - 200px)' }}>
                <Grid container marginTop='1px' direction="column" justifyContent="center" alignItems="center">
                  <Grid item xs={12} marginBottom={2}>
                    <Typography variant="h6">
                      Opções de Relatório:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} marginBottom={2}>
                    <Button variant="outlined" onClick={() => handleFormRelatorioChange(1)}>
                      Relatório de Clientes
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={() => handleFormRelatorioChange(2)}>
                      Relatório de Agendamentos
                    </Button>
                  </Grid>
                </Grid>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
            }
            {
              (formRelatorioOpen == 1) &&
              <RelatorioClientes
                formClose={() => handleFormRelatorioChange(0)}
                handleLogout={handleLogout}
              />
            }
            {
              (formRelatorioOpen == 2) &&
              <RelatorioAgendamentos
                formClose={() => handleFormRelatorioChange(0)}
                handleLogout={handleLogout}
              />
            }
          </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}