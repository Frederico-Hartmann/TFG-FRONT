import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../../../../Services/api';
import { getToken, logout } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage } from '../../../../Utils/showToast';

//Loader Material UI
import Button from '@material-ui/core/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../CustomComponents/CustomMaterialTableNoActions';

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

export default function FormRelatorioAgendamentos(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const colunas = [
    { title: 'Cliente', field: 'nome', width: 250 },
    { title: 'Data', field: 'data_consulta', width: 250 },
    { title: 'Horário', field: 'horario_consulta', width: 250 },
    { title: 'Pago', field: 'pago', width: 250 },
    { title: 'Preço', field: 'preco', width: 250 },
  ];

  const [clientes, setClientes] = useState([]);
  const [clientesSelecionados, setClientesSelecionados] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [somenteNaoPagos, setSomenteNaoPagos] = useState(false);
  const [relatorio, setRelatorio] = useState([]);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarClientes();
  }, []);

  async function listarClientes() {
    handleOpen();
    try {
      const getClientes = await api.get('/clientes', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setClientes(getClientes.data);
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function visualizarRelatorio() {
    handleOpen();

    const data = {
      idClientes: clientesSelecionados.map(cli => cli.id),
      somenteNaoPagos: somenteNaoPagos,
      dataInicial: valor(dataInicial),
      dataFinal: valor(dataFinal)
    };
    try {
      const getRelatorio = await api.post('/relatorioagendamentos', data, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      setRelatorio(getRelatorio.data);
      handleClose();
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

  const valor = (v) => { return v == '' ? null : v }

  return (
    <div style={{ backgroundColor: '#FFF'}}>
      <Container disableGutters maxWidth={false} >
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <div className={classes.panels} >
            <Grid container spacing={2} alignItems="flex-start" marginBottom={1}>
              <Grid item xs={9}>
                <Autocomplete
                  multiple
                  id="Clientes"
                  options={clientes}
                  getOptionLabel={(option) => option.nome}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => {
                    if (value) {
                      setClientesSelecionados(value);
                    }
                  }}
                  variant="filled"
                  filterSelectedOptions
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Clientes"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={somenteNaoPagos}
                      onChange={e => setSomenteNaoPagos(e.target.checked)}
                      label="Parent"
                      labelPlacement="top"
                    />}
                  label="Somente Não Pagos"
                  labelPlacement="end"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="dataInicial"
                  label="Data Inicial"
                  type="date"
                  value={dataInicial}
                  variant="filled"
                  onChange={e => setDataInicial(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="dataFinal"
                  label="Data Final"
                  type="date"
                  value={dataFinal}
                  variant="filled"
                  onChange={e => setDataFinal(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} direction="row" justifyContent="flex-end" alignItems="center" marginBottom={1}>
              <Grid item>
                <Button variant="outlined" onClick={() => visualizarRelatorio()}>
                  Visualizar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={props.formClose}>
                  Voltar
                </Button>
              </Grid>
            </Grid>
            <CustomMaterialTable
              titulo={`Relatório de Agendamentos`}
              msgSemDados={'Nenhum Dado Recebido'}
              colunas={colunas}
              data={relatorio}
              isRelatorio
            />
          </div>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}