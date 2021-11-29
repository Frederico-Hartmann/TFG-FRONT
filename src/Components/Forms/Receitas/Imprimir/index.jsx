import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../../Services/api';
import { getToken } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../Utils/showToast';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Autocomplete from '@mui/material/Autocomplete';

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
}));

export default function FormImprimirReceita(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [dentistas, setDentistas] = useState([]);
  const [idDentista, setIdDentista] = useState(0);
  const [nomeDentista, setNomeDentista] = useState('');
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    listarDentistas();
  }, []);

  async function listarDentistas() {
    handleOpen();
    try {
      const getDentistas = await api.get('/dentistas/true', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setDentistas(getDentistas.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Atenção',
            text: 'Sua sessão expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            props.handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function handleImprimir(e) {
    e.preventDefault();
    handleOpen();

    const data = {
      idReceita: props.idReceita,
      idDentista: idDentista,
      observacao: observacao
    };
    try {
      const getPDF = await api.post('/relatorioreceita', data, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = getPDF.data;
      downloadLink.download = props.descricaoReceita;
      downloadLink.click();
      handleClose();
      props.listarReceitas();
      props.formClose();
    }
    catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Atenção',
            text: 'Sua sessão expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            props.handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              {`Imprimir receita "${props.descricaoReceita}"`}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleImprimir}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <Autocomplete
                  id='dentistas'
                  options={dentistas}
                  getOptionLabel={(option) => option.nome}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => { if (value) setIdDentista(value.id) }}
                  size="small"
                  required
                  inputValue={nomeDentista}
                  onInputChange={(event, input) => { setNomeDentista(input) }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label='Dentista'
                      variant="filled"
                      required
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="observacao"
                  label="Observação"
                  variant="filled"
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                  multiline
                  rows={5}
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="outlined" className="btn-login btn-form">
                  Imprimir
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button className="btn-login btn-form" variant="outlined" onClick={props.formClose}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}