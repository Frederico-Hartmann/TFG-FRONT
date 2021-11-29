import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faTooth } from '@fortawesome/free-solid-svg-icons'

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

import AdicionarProcedimento from '../../../Components/Forms/Procedimentos/Adicionar';
import EditarProcedimento from '../../../Components/Forms/Procedimentos/Editar';

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
    { title: 'Procedimento', field: 'descricao', width: 250 },];

  const [data, setData] = useState([]);

  const [idProcedimento, setIdProcedimento] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarProcedimentos();
  }, []);

  async function listarProcedimentos() {
    handleOpen();
    try {
      const getProcedimentos = await api.get('/procedimentos', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getProcedimentos.data);
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
    swal({
      title: "Deseja excluir o Procedimento?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteProcedimento(id);
      }
    });
  }

  async function deleteProcedimento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/procedimentos/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarProcedimentos();
          });
        }
        else if (!callBackPost.data.deletado) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarProcedimentos();
          });
        }
        else if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarProcedimentos();
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
        <Main icon={faTooth} title="Procedimentos" subtitle="Lista de Procedimentos Cadastrados">
        <ToastAnimated />
      <div className={classes.panels} > 
        {
          (!formCadastroOpen && !formEditarOpen) &&
          <>
            <CustomMaterialTable
              titulo={''}
              msgSemDados={'Nenhum Procedimento cadastrado'}
              colunas={colunas} 
              data={data}
              add={{tooltip: 'Adicionar Procedimento', acao: handleFormCadastroChange}}
              editar={{tooltip: 'Editar Procedimento', acao: handleFormEditarChange, setId: setIdProcedimento}}
              excluir={{tooltip: 'Excluir Procedimento', acao: handleDelete}}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarProcedimento
            formClose={handleFormCadastroChange} 
            handleLogout={handleLogout}
            listarProcedimentos={listarProcedimentos}
          />
        }
        {
          formEditarOpen &&
          <EditarProcedimento
            idProcedimento={idProcedimento}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            listarProcedimentos={listarProcedimentos} 
          />
        }
      </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}