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

export default function FormAdicionarReceitaMedicamento(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [dataMedicamentos, setDataMedicamentos] = useState([]);
  const [idMedicamento, setIdMedicamento] = useState(0);
  const [descricaoMedicamento, setDescricaoMedicamento] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [unidadeMedida, setUnidadeMedida] = useState('');

  useEffect(() => {
    listarMedicamentos();
  }, []);

  async function listarMedicamentos() {
    handleOpen();
    try {
      const getMedicamentos = await api.get('/medicamentos', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setDataMedicamentos(getMedicamentos.data);
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
        quantidade: quantidade,
        unidadeMedida: unidadeMedida,
        idReceita: props.idReceita,
        idMedicamento: idMedicamento
      };
      handleOpen();
      try {
        const callBackPost = await api.post('/receitamedicamento', data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarReceitaMedicamento();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.listarReceitaMedicamento();
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

  function limparCampos() {
  }

  function semErros() {
    let erros = [];
    if (!Number.isInteger(parseFloat(quantidade))) {
      erros.push('Quantidade deve ser um número inteiro');
    }
    return erros;
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h6" className={classes.title} >
              {`Inserir medicamento na receita "${props.descricaoReceita}"`}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={6}>
                <Autocomplete
                  id='medicamentos'
                  options={dataMedicamentos}
                  getOptionLabel={(option) => option.descricao}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => { if (value) setIdMedicamento(value.id) }}
                  size="small"
                  required
                  inputValue={descricaoMedicamento}
                  onInputChange={(event, input) => { setDescricaoMedicamento(input) }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label='Medicamento'
                      variant="filled"
                      required
                    />
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="quantidade"
                  label="Quantidade"
                  variant="filled"
                  value={quantidade}
                  type="number"
                  required
                  onChange={e => setQuantidade(e.target.value)}
                  inputProps={{
                    maxLength: 10,
                  }}
                  fullWidth
                  size="small"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="unidadeMedida"
                  label="Unidade de Medida"
                  variant="filled"
                  value={unidadeMedida}
                  required
                  onChange={e => setUnidadeMedida(e.target.value)}
                  inputProps={{
                    maxLength: 10,
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