import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../../../../Services/api';
import { getToken } from '../../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../../Utils/showToast';

//Loader Material UI
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
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

export default function FormAdicionarCompromisso(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => { setOpen(false); };
  const handleOpen = () => { setOpen(!open); };

  const [date, setDate] = useState('');
  const [timeInicio, setTimeInicio] = useState('');
  const [timeFim, setTimeFim] = useState('');
  const [descricao, setDescricao] = useState('');

  async function handleRegister(e) {
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
      handleOpen();
      const splitDate = date.split('-');
      const splitInicio = timeInicio.split(':');
      const splitFim = timeFim.split(':');
      const dataInicio =  `${parseInt(splitDate[0])}-${parseInt(splitDate[1])}-${parseInt(splitDate[2])} ${parseInt(splitInicio[0])}:${parseInt(splitInicio[1])}`;
      const dataFim =     `${parseInt(splitDate[0])}-${parseInt(splitDate[1])}-${parseInt(splitDate[2])} ${parseInt(splitFim[0])}:${parseInt(splitFim[1])}`;
      const data = {
        tipo: 2,
        inicio: dataInicio,
        fim: dataFim,
        descricao: descricao,
        status: 0,
        preco: null,
        idDentista: props.idDentista,
        idCliente: null,
        idClienteTratamento: null,
        idProcedimento: null
      };
      try {
        const callBackPost = await api.post('/agendamentos', data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              props.listarAgendamentos();
              props.formClose(0);
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              props.listarAgendamentos();
              props.formClose(0);
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
              Cadastro de Compromisso
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={6}>
                <TextField
                  id="descricao"
                  label="Descri????o"
                  variant="filled"
                  value={descricao}
                  required
                  onChange={e => setDescricao(e.target.value)}
                  inputProps={{
                    maxLength: 100,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}/>
              <Grid item xs={3}>
                <TextField
                  id="date"
                  label="Data"
                  type="date"
                  value={date}
                  required
                  onChange={e => setDate(e.target.value)}
                  fullWidth
                  size="small"
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="timeInicio"
                  label="Hor??rio de inicio"
                  type="time"
                  value={timeInicio}
                  required
                  onChange={e => setTimeInicio(e.target.value)}
                  fullWidth
                  size="small"
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
              <TextField
                  id="timeFim"
                  label="Hor??rio de finaliza????o"
                  type="time"
                  value={timeFim}
                  required
                  onChange={e => setTimeFim(e.target.value)}
                  fullWidth
                  size="small"
                  variant="filled"
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
                <Button className="btn-login btn-form" variant="outlined" onClick={() =>props.formClose(0)}>
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