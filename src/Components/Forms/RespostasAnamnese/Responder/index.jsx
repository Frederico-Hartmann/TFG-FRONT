import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import api from '../../../../Services/api';
import { getToken } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../Utils/showToast';

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

export default function FormResponderAnamnese(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
  }, []);

  async function handleResponder(e) {
    e.preventDefault();

    if (props.idResposta) {
      if (props.textoResposta.trim().length > 0) { //Put
        const data = {
          resposta: props.textoResposta.trim(),
        };
        handleOpen();
        try {
          const callBackPost = await api.put(`/respostas/${props.idResposta}`, data, {
            headers: {
              Authorization: "Bearer " + getToken()
            }
          });
          if (callBackPost) {
            if (callBackPost.data.error) {
              swalRegisterError(callBackPost, "OK").then((willSuccess) => {
                handleClose();
                limparCampos();
                props.listarRespostasAnamnese();
                props.formClose();
              });
            }
            if (callBackPost.data.cadastrado) {
              swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
                handleClose();
                limparCampos();
                props.listarRespostasAnamnese();
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
      else { //Delete
        handleOpen();
        try {
          const callBackPost = await api.delete(`/respostas/${props.idResposta}`, {
            headers: {
              Authorization: "Bearer " + getToken()
            }
          });
          if (callBackPost) {
            if (callBackPost.data.error) {
              swalRegisterError(callBackPost, "OK").then((willSuccess) => {
                handleClose();
                props.listarRespostasAnamnese();
                props.formClose();
              });
            }
            if (callBackPost.data.deletado) {
              swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
                handleClose();
                props.listarRespostasAnamnese();
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
    else {
      if (props.textoResposta.trim().length > 0) { //Post
        const data = {
          resposta: props.textoResposta.trim(),
          idPergunta: props.idPergunta,
          idCliente: props.idCliente
        };
        handleOpen();
        try {
          const callBackPost = await api.post('/respostas', data, {
            headers: {
              Authorization: "Bearer " + getToken()
            }
          });
          if (callBackPost) {
            if (callBackPost.data.error) {
              swalRegisterError(callBackPost, "OK").then((willSuccess) => {
                handleClose(); 
                props.listarRespostasAnamnese();
                props.formClose();
              });
            }
            if (callBackPost.data.cadastrado) {
              swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
                handleClose();
                props.listarRespostasAnamnese();
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
      else { //Nada
        props.listarRespostasAnamnese();
        props.formClose();
      }
    }
  }

  function limparCampos() {
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
              Responder Pergunta da anamnese:
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleResponder}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <div>
                  <Typography variant="body1" component="div" >
                    {props.textoPergunta}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="resposta"
                  label="Resposta"
                  variant="filled"
                  value={props.textoResposta}
                  onChange={e => props.setTextoResposta(e.target.value)}
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