import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../../Services/api';
import { getToken } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../Utils/showToast';
import {cpfMask, telMask} from '../../../../Utils/mask';

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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

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

export default function FormEditarCliente(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [idCliente, setIdCliente] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [genero, setGenero] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [receberMensagens, setReceberMensagens] = useState(false);

  useEffect(() => {
    buscarCliente();
  }, []);

  async function handleEdit(e) {
    e.preventDefault();
    let erros = semErros();

    if (erros.length > 0) {
      let msg = '';
      erros.map(elt => (msg += elt));
      showMessage('error', msg);
    }
    else {
      const data = {
        nome: nome.trim(),
        cpf: valor(cpf),
        rg: valor(rg),
        email: valor(email),
        telefone: valor(telefone),
        genero: valor(genero),
        dataNascimento: valor(dataNascimento),
        observacao: valor(observacao),
        receberMensagens: receberMensagens
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/clientes/${idCliente}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarClientes();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarClientes();
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

  const valor = (v) => { return v == '' ? null : v }

  async function buscarCliente() {
    handleOpen();
    try {
      const getClienteById = await api.get(`/clientes/${props.idCliente}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      let dados = getClienteById.data[0];
      setIdCliente(dados.id);
      setNome(dados.nome);
      setCpf(dados.cpf);
      setRg(dados.rg);
      setEmail(dados.email);
      setTelefone(dados.telefone);
      setGenero(dados.genero);
      setDataNascimento(dados.datanascimento);
      setObservacao(dados.observacao);
      setReceberMensagens(dados.recebermensagens);
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
    setCpf('');
    setRg('');
    setEmail('');
    setTelefone('');
    setGenero('');
    setDataNascimento('');
    setObservacao('');
    setReceberMensagens(false);
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
              Edição de Cliente
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="nome"
                  label="Nome"
                  variant="filled"
                  value={nome}
                  required
                  onChange={e => setNome(e.target.value)}
                  inputProps={{
                    maxLength: 100,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="cpf"
                  label="CPF"
                  variant="filled"
                  value={cpf}
                  onChange={e => setCpf(cpfMask(e.target.value))}
                  inputProps={{
                    maxLength: 14
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="rg"
                  label="RG"
                  variant="filled"
                  value={rg}
                  onChange={e => setRg(e.target.value)}
                  inputProps={{
                    maxLength: 14
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="email"
                  label="E-mail"
                  variant="filled"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  inputProps={{
                    maxLength: 100
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="telefone"
                  label="Telefone"
                  variant="filled"
                  value={telefone}
                  onChange={e => setTelefone(telMask(e.target.value))}
                  inputProps={{
                    maxLength: 15
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <FormLabel component="legend">Gênero</FormLabel>
                <RadioGroup row aria-label="genero" value={genero} onChange={e => setGenero(e.target.value)} name="row-radio-buttons-group" >
                  <FormControlLabel value="M" control={<Radio />} label="Masculino" />
                  <FormControlLabel value="F" control={<Radio />} label="Feminino" />
                  <FormControlLabel value="O" control={<Radio />} label="Outro" />
                </RadioGroup>
              </Grid>
              <Grid item xs={6}>
              <TextField
                  id="dataNasc"
                  label="Data de Nascimento"
                  type="date"
                  variant="filled"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="observacao"
                  label="Observações"
                  variant="filled"
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                  multiline
                  rows={5}
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