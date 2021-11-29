import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Typography from '@material-ui/core/Typography';
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
 
export default function FormEditarPergunta(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [idPergunta, setIdPergunta] = useState('');
  const [pergunta, setPergunta] = useState('');

  useEffect(() => {
    buscarPergunta();  
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
        pergunta: pergunta.trim(),
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/perguntas/${idPergunta}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();   
              props.listarPerguntas();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.listarPerguntas();
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

  async function buscarPergunta() {
    handleOpen();
    try {
      const getPerguntaById = await api.get(`/perguntas/${props.idPergunta}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      let dados = getPerguntaById.data[0];
      setIdPergunta(dados.id);
      setPergunta(dados.pergunta);
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
    setPergunta('');
  }

  function semErros() {
    let erros = [];
    return erros;
  }

  return (
    <div style={{backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar> 
            <Typography variant="h6" className={classes.title} >
              Edição de Pergunta
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#FFF', marginTop: '1em'}}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="pergunta"
                  label="Pergunta"
                  variant="filled"
                  value={pergunta}
                  required 
                  onChange={e => setPergunta(e.target.value)} 
                  multiline
                  rows={5}
                  inputProps={{
                    maxLength: 200
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