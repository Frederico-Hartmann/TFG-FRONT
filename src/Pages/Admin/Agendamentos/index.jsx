import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

import { getToken, logout } from '../../../Services/auth';
import api from '../../../Services/api';

//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../Utils/showToast';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import CustomScheduler from '../../../Components/CustomComponents/CustomScheduler'
import FormSelecionarTipoAgendamento from '../../../Components/Forms/Agendamentos/Selecionar'
import FormAdicionarConsulta from '../../../Components/Forms/Agendamentos/Consultas/Adicionar'
import FormAdicionarCompromisso from '../../../Components/Forms/Agendamentos/Compromisso/Adicionar'
import FormEditarConsulta from '../../../Components/Forms/Agendamentos/Consultas/Editar'
import FormEditarCompromisso from '../../../Components/Forms/Agendamentos/Compromisso/Editar'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  panels: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 500,
    color: '#004725',
    padding: '0.5em',
    fontFamily: 'Bebas Neue'
  },
}));

export default function Home() {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [formCadastroOpen, setFormCadastroOpen] = useState(0);

  const handleFormCadastroChange = (tipo) => {
    if (tipo == 1) {
      listarClientes();
      listarProcedimentos();
    }
    setFormCadastroOpen(tipo);
  }

  const [formEditarOpen, setFormEditarOpen] = useState(0);

  const handleFormEditarChange = (id, tipo, idCliente) => {
    setIdAgendamento(id);
    if (tipo == 1) {
      listarClientes();
      listarTratamentos(idCliente);
      listarProcedimentos();
    }
    setFormEditarOpen(tipo);
  }

  const [dentistas, setDentistas] = useState([]);
  const [idDentistaSelecionado, setIdDentistaSelecionado] = useState(0);
  const [nomeDentistaSelecionado, setNomeDentistaSelecionado] = useState('');
  const [dataScheduler, setDataScheduler] = useState(new Date);
  const [agendamentos, setAgendamento] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [tratamentos, setTratamentos] = useState([]);

  const [idAgendamento, setIdAgendamento] = useState(0);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarDentistas();
  }, []);

  async function handleDataSchedulerChange(newDate) {
    setDataScheduler(new Date(newDate));
    listarAgendamentos(new Date(newDate), idDentistaSelecionado);
  }

  async function listarDentistas() {
    handleOpen();
    try {
      const getDentistas = await api.get('/dentistas/true', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      setDentistas(getDentistas.data);
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function listarAgendamentos(dataPesquisa = dataScheduler, idDentista = idDentistaSelecionado) {
    handleOpen();
    try {
      const getAgendamentos = await api.get(`/agendamentos/${idDentista}/${dataPesquisa.getDate()}/${(dataPesquisa.getMonth())}/${dataPesquisa.getFullYear()}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      setAgendamento(getAgendamentos.data);
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

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

  async function listarTratamentos(idCliente) {
    handleOpen();
    try {
      const getTratamentos = await api.get(`/clientetratamentoativo/${idCliente}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      setTratamentos(getTratamentos.data);
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function listarProcedimentos() {
    handleOpen();
    try {
      const getProcedimentos = await api.get('/procedimentos', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setProcedimentos(getProcedimentos.data);
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

  async function handleDelete(id) {
    
    await new Promise(resolve => setTimeout(resolve, 100));
    swal({
      title: "Deseja excluir o Agendamento?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteAgendamento(id);
      }
    });
  }

  async function deleteAgendamento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/agendamentos/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarAgendamentos();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarAgendamentos();
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  return (
    <React.Fragment>
      <div className='app'>
        <Logo />
        <Nav />
        <Main icon={faCalendar} title="Agenda" subtitle="Quadro de Agendamentos">
          <ToastAnimated />
          <div className={classes.panels} >
            {
              (formCadastroOpen == 0 && formEditarOpen == 0) &&
              <>
                <Autocomplete
                  id="dentistas"
                  options={dentistas}
                  getOptionLabel={(option) => option.nome}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => {
                    if (value) {
                      setIdDentistaSelecionado(value.id);
                      listarAgendamentos(dataScheduler, value.id);
                    }
                  }}
                  size="small"
                  inputValue={nomeDentistaSelecionado}
                  onInputChange={(event, input) => {
                    setNomeDentistaSelecionado(input);
                  }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Dentista"
                      variant="filled"
                    />
                  }
                />
                {
                  (idDentistaSelecionado != 0) &&
                  <CustomScheduler
                    data={agendamentos}
                    date={dataScheduler}
                    setDate={handleDataSchedulerChange}
                    addAction={handleFormCadastroChange}
                    editAction={handleFormEditarChange}
                    deleteAction={handleDelete}
                  />
                }
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            }
            {
              formCadastroOpen == 1 &&
              <FormAdicionarConsulta
                idDentista={idDentistaSelecionado}
                clientes={clientes}
                tratamentos={tratamentos}
                listarTratamentos={listarTratamentos}
                procedimentos={procedimentos}
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarAgendamentos={listarAgendamentos}
              />
            }
            {
              formCadastroOpen == 2 &&
              <FormAdicionarCompromisso
                idDentista={idDentistaSelecionado}
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarAgendamentos={listarAgendamentos}
              />
            }
            {
              formCadastroOpen == 3 &&
              <FormSelecionarTipoAgendamento
                formChange={handleFormCadastroChange}
              />
            }
            {
              formEditarOpen == 1 &&
              <FormEditarConsulta
                idAgendamento={idAgendamento}
                idDentista={idDentistaSelecionado}
                clientes={clientes}
                tratamentos={tratamentos}
                listarTratamentos={listarTratamentos}
                procedimentos={procedimentos}
                formClose={handleFormEditarChange}
                handleLogout={handleLogout}
                listarAgendamentos={listarAgendamentos}
              />
            }
            {
              formEditarOpen == 2 &&
              <FormEditarCompromisso
                idAgendamento={idAgendamento}
                formClose={handleFormEditarChange}
                handleLogout={handleLogout}
                listarAgendamentos={listarAgendamentos}
              />
            }
          </div>
        </Main>
        <Footer />
      </div >
    </React.Fragment >
  );
}