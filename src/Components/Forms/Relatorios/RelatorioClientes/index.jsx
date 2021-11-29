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

export default function FormRelatorioClientes(props) {
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
    { title: 'Esta Devendo', field: 'devendo_string', width: 250 },
    { title: 'Total Pago', field: 'totalpago', width: 250 },
    { title: 'Total Não Pago', field: 'totalnaopago', width: 250 },
  ];

  const [clientes, setClientes] = useState([]);
  const [clientesSelecionados, setClientesSelecionados] = useState([]);
  const [somenteDevedores, setSomenteDevedores] = useState(false);
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
      somenteDevedores: somenteDevedores
    };
    try {
      const getRelatorio = await api.post('/relatorioclientes', data, {
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
                      checked={somenteDevedores}
                      onChange={e => setSomenteDevedores(e.target.checked)}
                      label="Parent"
                      labelPlacement="top"
                    />}
                  label="Somente Devedores"
                  labelPlacement="end"
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
              titulo={`Relatório de Clientes`}
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