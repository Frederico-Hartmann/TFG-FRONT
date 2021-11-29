import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faTeeth } from '@fortawesome/free-solid-svg-icons'

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

import AdicionarTratamento from '../../../Components/Forms/Tratamentos/Adicionar';
import EditarTratamento from '../../../Components/Forms/Tratamentos/Editar';

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
    { title: 'Tratamento', field: 'descricao', width: 250 },];

  const [data, setData] = useState([]);

  const [idTratamento, setIdTratamento] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarTratamentos();
  }, []);

  async function listarTratamentos() {
    handleOpen();
    try {
      const getTratamentos = await api.get('/tratamentos', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getTratamentos.data);
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
      title: "Deseja excluir o tratamento?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteTratamento(id);
      }
    });
  }

  async function deleteTratamento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/tratamentos/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarTratamentos();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarTratamentos();
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
        <Main icon={faTeeth} title="Tratamentos" subtitle="Lista de Tratamentos Cadastrados">
        <ToastAnimated />
      <div className={classes.panels} > 
        {
          (!formCadastroOpen && !formEditarOpen) &&
          <>
            <CustomMaterialTable
              titulo={''}
              msgSemDados={'Nenhum tratamento cadastrado'}
              colunas={colunas} 
              data={data}
              add={{tooltip: 'Adicionar Tratamento', acao: handleFormCadastroChange}}
              editar={{tooltip: 'Editar Tratamento', acao: handleFormEditarChange, setId: setIdTratamento}}
              excluir={{tooltip: 'Excluir Tratamento', acao: handleDelete}}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarTratamento
            formClose={handleFormCadastroChange} 
            handleLogout={handleLogout}
            listarTratamentos={listarTratamentos}
          />
        }
        {
          formEditarOpen &&
          <EditarTratamento
            idTratamento={idTratamento}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            listarTratamentos={listarTratamentos} 
          />
        }
      </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}