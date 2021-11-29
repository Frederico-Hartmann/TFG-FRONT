import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../../../../Services/api';
import { getToken } from '../../../../../Services/auth';
import { moneyMask } from '../../../../../Utils/mask';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../../Utils/showToast';

//Loader Material UI
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
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

export default function FormEditarCompromisso(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => { setOpen(false); };
  const handleOpen = () => { setOpen(!open); };

  const [idCliente, setIdCliente] = useState(0);
  const [nomeCliente, setNomeCliente] = useState('');
  const [idProcedimento, setIdProcedimento] = useState(0);
  const [descricaoProcedimento, setDescricaoProcedimento] = useState('');
  const [idTratamento, setIdTratamento] = useState(0);
  const [descricaoTratamento, setDescricaoTratamento] = useState('');

  const [dataAgendamento, setDataAgendamento] = useState('');
  const [timeInicio, setTimeInicio] = useState('');
  const [timeFim, setTimeFim] = useState('');
  const [status, setStatus] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    buscarAgendamento();
  }, []);

  async function buscarAgendamento() {
    handleOpen();
    try {
      const getClienteById = await api.get(`/agendamentos/${props.idAgendamento}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      let dados = getClienteById.data[0];
      const tempDateInicio = new Date(dados.inicio);
      const temdDateFim = new Date(dados.fim);
      setDataAgendamento(`${tempDateInicio.getFullYear()}-${(tempDateInicio.getMonth()+1).toString().padStart(2, "0")}-${tempDateInicio.getDate().toString().padStart(2, "0")}`);
      setTimeInicio(`${tempDateInicio.getHours().toString().padStart(2, "0")}:${tempDateInicio.getMinutes().toString().padStart(2, "0")}`);
      setTimeFim(`${temdDateFim.getHours().toString().padStart(2, "0")}:${temdDateFim.getMinutes().toString().padStart(2, "0")}`);
      setStatus(dados.status);
      setPreco(moneyMask(dados.preco));
      setIdCliente(dados.id_cliente);
      setNomeCliente(dados.nome_cliente);
      setIdTratamento(dados.id_tratamento);
      setDescricaoTratamento(dados.descricao_tratamento);
      setIdProcedimento(dados.id_procedimento);
      setDescricaoProcedimento(dados.descricao_procedimento);
      setDescricao(dados.descricao);
      handleClose();
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
        console.log(err)
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

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
      const splitDate = dataAgendamento.split('-');
      const splitInicio = timeInicio.split(':');
      const splitFim = timeFim.split(':');
      const dataInicio = `${parseInt(splitDate[0])}-${parseInt(splitDate[1])}-${parseInt(splitDate[2])} ${parseInt(splitInicio[0])}:${parseInt(splitInicio[1])}`;
      const dataFim = `${parseInt(splitDate[0])}-${parseInt(splitDate[1])}-${parseInt(splitDate[2])} ${parseInt(splitFim[0])}:${parseInt(splitFim[1])}`;
      const data = {
        tipo: 1,
        inicio: dataInicio,
        fim: dataFim,
        descricao: descricao,
        status: status,
        preco: parseFloat(preco.replace('.', '').replace(',', '.')),
        idDentista: props.idDentista,
        idCliente: idCliente,
        idClienteTratamento: idTratamento != 0 ? idTratamento : null,
        idProcedimento: idProcedimento != 0 ? idProcedimento : null
      };
      try {
        const callBackPost = await api.put(`/agendamentos/${props.idAgendamento}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              props.listarAgendamentos();
              props.formClose(0,0);
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              props.listarAgendamentos();
              props.formClose(0,0);
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

  function semErros() {
    let erros = [];
    if (!status) {
      erros.push('Status não selecionado');
    }
    return erros;
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              Edição de Consulta
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={6}> {/** Clientes */}
              <TextField
                  id="cliente"
                  label="Cliente"
                  variant="filled"
                  value={nomeCliente}
                  onChange={e => setNomeCliente(e.target.value)}
                  inputProps={{
                    maxLength: 100,
                  }}
                  fullWidth
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={6}> {/** Tratamentos */}
              <TextField
                  id="tratamento"
                  label="Tratamento"
                  variant="filled"
                  value={descricaoTratamento}
                  onChange={e => setDescricaoTratamento(e.target.value)}
                  inputProps={{
                    maxLength: 100,
                  }}
                  fullWidth
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={3}> {/** Status */}
                <FormControl fullWidth>
                  <InputLabel id='label status' variant="filled">Status</InputLabel>
                  <Select
                    labelId='label status'
                    id='select status'
                    value={status}
                    label='Status'
                    variant="filled"
                    size="small"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem key='1' value='1' >Não Pago</MenuItem>
                    <MenuItem key='2' value='2' >Pago</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}> {/** Procedimentos */}
              <TextField
                  id="procedimento"
                  label="Procedimento"
                  variant="filled"
                  value={descricaoProcedimento}
                  onChange={e => setDescricaoProcedimento(e.target.value)}
                  inputProps={{
                    maxLength: 100,
                  }}
                  fullWidth
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={3}>  {/** Preco */}
                <TextField
                  id="preco"
                  label="Preço"
                  variant="filled"
                  value={preco}
                  onChange={e => setPreco(moneyMask(e.target.value))}
                  inputProps={{
                    maxLength: 15,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>  {/** Data */}
                <TextField
                  id="dataAgendamento"
                  label="Data"
                  type="date"
                  value={dataAgendamento}
                  required
                  variant="filled"
                  onChange={e => setDataAgendamento(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>  {/** Inicio */}
                <TextField
                  id="timeInicio"
                  label="Horário de inicio"
                  type="time"
                  value={timeInicio}
                  variant="filled"
                  required
                  onChange={e => setTimeInicio(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>  {/** Fim */}
                <TextField
                  id="timeFim"
                  label="Horário de finalização"
                  type="time"
                  value={timeFim}
                  variant="filled"
                  required
                  onChange={e => setTimeFim(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>  {/** Descricao */}
                <TextField
                  id="descricao"
                  label="Descrição"
                  variant="filled"
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  inputProps={{
                    maxLength: 100,
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
                <Button className="btn-login btn-form" variant="outlined" onClick={() => props.formClose(0,0)}>
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