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
import { Autocomplete } from '@mui/material';

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

export default function FormAdicionarClienteTratamento(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [dataTratamentos, setDataTratamentos] = useState([]);
  const [idTratamento, setIdTratamento] = useState([]);
  const [descricaoTratamento, setDescricaoTratamento] = useState([]);

  const [dataInicio, setDataInicio] = useState('');

  useEffect(() => {
    listarTratamentos();
  }, []);

  async function listarTratamentos() {
    handleOpen();
    try {
      const getTratamentos = await api.get('/tratamentos', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setDataTratamentos(getTratamentos.data);
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

  async function handleRegister(e) {
    e.preventDefault();

    const data = {
      dataInicio: dataInicio,
      idTratamento: idTratamento,
      idCliente: props.idCliente
    };
    handleOpen();
    try {
      const callBackPost = await api.post('/clientetratamento', data, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            limparCampos();
            props.listarClienteTratamento();
            props.formClose();
          });
        }
        if (callBackPost.data.cadastrado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            limparCampos();
            props.listarClienteTratamento();
            props.formClose();
          });
        }
      }
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

  function limparCampos() {
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              {`Registrar tratamento para o cliente "${props.nomeCliente}"`}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={6}>
                <Autocomplete
                  id='tratamentos'
                  options={dataTratamentos}
                  getOptionLabel={(option) => option.descricao}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => { if (value) setIdTratamento(value.id) }}
                  size="small"
                  required
                  inputValue={descricaoTratamento}
                  onInputChange={(event, input) => { setDescricaoTratamento(input) }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label='Tratamento'
                      variant="filled"
                    />
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="date"
                  label="Data"
                  type="date"
                  value={dataInicio}
                  required
                  onChange={e => setDataInicio(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" variant="outlined" className="btn-login btn-form">
                  Salvar
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