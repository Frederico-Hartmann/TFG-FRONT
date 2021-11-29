import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Container from '@material-ui/core/Container';
import api from '../../../../Services/api';
import { getToken } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../Utils/showToast';
import { integerMask } from '../../../../Utils/mask';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

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

export default function FormEditarDentistas(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [nome, setNome] = useState('');
  const [CRO, setCRO] = useState('');
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    buscarDentista();
  }, []);

  async function handleEdit(e) {
    e.preventDefault();
    let erros = semErros();

    if (erros.length > 0) {
      let msg = '';
      erros.map(elt => (
        msg += elt
      )
      );
      showMessage('error', msg);
    }
    else {
      const data = {
        nome: nome.trim(),
        CRO: (CRO.trim() != '') ? CRO.trim() : null,
        ativo: ativo,
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/dentistas/${props.idDentista}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarDentistas();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarDentistas();
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
  }

  async function buscarDentista() {
    handleOpen();
    try {
      const getDentistaById = await api.get(`/dentistas/${props.idDentista}/false`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      let dados = getDentistaById.data[0];
      setNome(dados.nome);
      setCRO(dados.cro);
      setAtivo(dados.ativo);
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

  function limparCampos() {
    setNome('');
  }

  function semErros() {
    let erros = [];
    return erros;
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              Edição de Dentista
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={8}>
                <TextField
                  id="nome"
                  label="Nome"
                  variant="filled"
                  value={nome}
                  required
                  onChange={e => setNome(e.target.value)}
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="cro"
                  label="CRO"
                  variant="filled"
                  value={CRO}
                  onChange={e => setCRO(integerMask(e.target.value))}
                  inputProps={{
                    maxLength: 10,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={ativo}
                      onChange={e => setAtivo(e.target.checked)}
                      label="Parent"
                      labelPlacement="top"
                    />}
                  label="Ativo"
                  labelPlacement="end"
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