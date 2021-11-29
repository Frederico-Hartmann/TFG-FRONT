import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faIdBadge } from '@fortawesome/free-solid-svg-icons'

import { getToken, logout } from '../../../Services/auth';
import api from '../../../Services/api';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../Utils/showToast';
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../Components/CustomComponents/CustomMaterialTable';

import AdicionarDentista from '../../../Components/Forms/Dentistas/Adicionar';
import EditarDentista from '../../../Components/Forms/Dentistas/Editar';

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

  const [formCadastroOpen, setFormCadastroOpen] = useState(false);

  const handleFormCadastroChange = () => {
    setFormCadastroOpen(!formCadastroOpen);
  }

  const [formEditarOpen, setFormEditarOpen] = useState(false);

  const handleFormEditarChange = () => {
    setFormEditarOpen(!formEditarOpen);
  }

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Nome', field: 'nome', width: 250 },
    { title: 'Ativo', field: 'ativo_string' }];

  const [data, setData] = useState([]);

  const [idDentista, setIdDentista] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarDentistas();
  }, []);

  async function listarDentistas() {
    handleOpen();
    try {
      const getDentistas = await api.get('/dentistas/false', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getDentistas.data);
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

  async function handleInativeDelete(id) {
    const dentista = data.find(dentista => dentista.id = id);
    swal({
      title: `Deseja excluir ou ${dentista.ativo?"inativar":"ativar"} o dentista?`,
      icon: "warning",
      buttons: {
        inativate: dentista.ativo?"Inativar":"Ativar",
        delete: "Deletar",
        cancel: "Cancelar"
      }
    }).then((resposta) => {
      switch (resposta) {
        case "inativate":
          inativateDentista(id, dentista.ativo);
          break;
        case "delete":
          if (data.find(dentista => dentista.id = id).tem_agendamentos) {
            swal({
              title: 'Atenção',
              text: 'Não é possivel deletar dentistas com Agendamentos',
              icon: "info",
              buttons: "OK"
            }).then((willSuccess) => {
              handleClose();
            });
          }
          else
            deleteDentista(id);
          break;
      }
    });
  }

  async function inativateDentista(id, ativo) {
      const data = {
        ativo: !ativo,
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/dentistasAtivos/${id}`, data, {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              listarDentistas();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              listarDentistas();
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

  async function deleteDentista(id) {
    handleOpen();
    try {
      let callBackPost;
      callBackPost = await api.delete(`/dentistas/${id}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarDentistas();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarDentistas();
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
        <Main icon={faIdBadge} title="Dentistas" subtitle="Lista de Dentistas Cadastrados">
          <ToastAnimated />
          <div className={classes.panels} >
            {
              (!formCadastroOpen && !formEditarOpen) &&
              <>
                <CustomMaterialTable
                  titulo={''}
                  msgSemDados={'Nenhum dentista cadastrado'}
                  colunas={colunas}
                  data={data}
                  add={{ tooltip: 'Adicionar Dentista', acao: handleFormCadastroChange }}
                  editar={{ tooltip: 'Editar Dentista', acao: handleFormEditarChange, setId: setIdDentista }}
                  excluir={{ tooltip: 'Excluir/inativar Dentista', acao: handleInativeDelete }}
                />
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarDentista
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarDentistas={listarDentistas}
              />
            }
            {
              formEditarOpen &&
              <EditarDentista
                idDentista={idDentista}
                formClose={handleFormEditarChange}
                handleLogout={handleLogout}
                listarDentistas={listarDentistas}
              />
            }
          </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}