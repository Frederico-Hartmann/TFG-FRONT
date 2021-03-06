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
 
export default function FormEditarReceita(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [idReceita, setIdReceita] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    buscarReceita();  
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
        descricao: descricao.trim(),
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/receitas/${idReceita}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();   
              props.listarReceitas();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.listarReceitas();
              props.formClose();
            });
          }
        }
      }
      catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            swal({
              title: 'Aten????o',
              text: 'Sua sess??o expirou, por favor, realize login novamente!',
              icon: "info",
              buttons: "OK"
            }).then((willSuccess) => {
              handleClose();
              props.handleLogout();
            });
          }
        } else {
          handleClose();
          showMessage('error', 'Falha na conex??o');
        }
      }
    }
  }

  async function buscarReceita() {
    handleOpen();
    try {
      const getReceitaById = await api.get(`/receitas/${props.idReceita}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      let dados = getReceitaById.data[0];
      setIdReceita(dados.id);
      setDescricao(dados.descricao);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Aten????o',
            text: 'Sua sess??o expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            props.handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conex??o');
      }
    }
  }

  function limparCampos() {
    setDescricao('');
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
              Edi????o de Receita
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#FFF', marginTop: '1em'}}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="descricao"
                  label="Descri????o"
                  variant="filled"
                  value={descricao}
                  required 
                  onChange={e => setDescricao(e.target.value)} 
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