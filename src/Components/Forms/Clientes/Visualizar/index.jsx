import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../../../Services/api';
import { getToken } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage } from '../../../../Utils/showToast';

//Loader Material UI
import { Grid } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    color: '#004725'
  },
  title: {
    textAlign: `center`,
    flex: 1,
  },
  dados: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
    flex: 1,
  },
  obs: {
    marginLeft: theme.spacing(4),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
  button: {
    marginRight: theme.spacing(1)
  }
}));

export default function FormVisualizarCliente(props) {
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
      setDataNascimento(dados.datanascimento_br);
      setObservacao(dados.observacao);
      setReceberMensagens(dados.receberMensagens);
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

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 200px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h5" className={classes.title} >
              {`Cliente: ${nome}`}
            </Typography>
            <Button className="btn-login btn-form" variant="outlined" onClick={props.formClose}>
              Voltar
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={9} maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
            {
              (cpf) &&
              <Typography variant="h6" className={classes.dados} >
                {`CPF: ${cpf}`}
              </Typography>
            }{
              (rg) &&
              <Typography variant="h6" className={classes.dados} >
                {`RG: ${rg}`}
              </Typography>
            }{
              (email) &&
              <Typography variant="h6" className={classes.dados} >
                {`E-mail: ${email}`}
              </Typography>
            }{
              (telefone) &&
              <Typography variant="h6" className={classes.dados} >
                {`Telefone: ${telefone}`}
              </Typography>
            }{
              (dataNascimento) &&
              <Typography variant="h6" className={classes.dados} >
                {`Data de Nascimento: ${dataNascimento}`}
              </Typography>
            }{
              (genero) &&
              <Typography variant="h6" className={classes.dados} >
                {`Gênero: ${(genero == 'M') ? 'Masculino' : (genero == 'F') ? 'Feminino' : 'Outro'}`}
              </Typography>
            }
            {/*<Typography variant="h6" className={classes.dados} >
              {`Receber Mensagens: ${(receberMensagens) ? 'Sim' : 'Não'}`}
          </Typography>*/}
            {
              (observacao) &&
              <>
                <Typography variant="h6" className={classes.dados} >
                  Observações:
                </Typography>
                <Typography className={classes.obs} >
                  {observacao}
                </Typography>
              </>
            }
          </Grid>
          <Grid item xs={3} maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
              <Grid container spacing={2} direction="column" justifyContent="flex-start" alignItems="center">
              <Grid item>
                <Typography variant="h6">
                  Opções:
                </Typography>
                </Grid>
                <Grid item>
                  <Button className={classes.button} variant="outlined" onClick={props.TratamentosClienteChange}>
                    Tratamentos do cliente
                  </Button>
                </Grid>
                <Grid item>
                  <Button className={classes.button} variant="outlined" onClick={props.DocumentosClienteChange}>
                    Documentos do cliente
                  </Button>
                </Grid>
                <Grid item>
                  <Button className={classes.button} variant="outlined" onClick={props.RespostasAnamneseChange}>
                    Anamnese
                  </Button>
                </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}