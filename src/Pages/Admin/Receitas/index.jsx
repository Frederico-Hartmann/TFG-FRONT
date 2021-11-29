import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'

import { getToken, logout } from '../../../Services/auth';
import api from '../../../Services/api';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../Utils/showToast';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../Components/CustomComponents/CustomMaterialTableNoActions';
import { AddBox, Print, ListAlt, Edit, Delete } from '@mui/icons-material';

import AdicionarReceita from '../../../Components/Forms/Receitas/Adicionar';
import EditarReceita from '../../../Components/Forms/Receitas/Editar';
import ImprimirReceita from '../../../Components/Forms/Receitas/Imprimir';
import ListarReceitaMedicamento from '../../../Components/Forms/ReceitasMedicamentos/Listar';

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

  const [formTabelaMedicamentosOpen, setFormTabelaMedicamentosOpen] = useState(false);

  const handleFormTabelaMedicamentosChange = () => {
    setFormTabelaMedicamentosOpen(!formTabelaMedicamentosOpen);
  }

  const [formImprimirOpen, setFormImprimirOpen] = useState(false);

  const handleFormImprimirChange = () => {
    setFormImprimirOpen(!formImprimirOpen);
  }

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Receita', field: 'descricao', width: 250 },
  ];

  const [data, setData] = useState([]);

  const [idReceita, setIdReceita] = useState('');
  const [descricao, setDescricao] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarReceitas();
  }, []);

  async function listarReceitas() {
    handleOpen();
    try {
      const getReceitas = await api.get('/receitas', {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getReceitas.data);
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
      title: "Deseja excluir a receita?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteReceita(id);
      }
    });
  }

  async function deleteReceita(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/receitas/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarReceitas();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarReceitas();
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
        <Main icon={faClipboardList} title="Receitas" subtitle="Lista de Receitas Cadastradas">
          <ToastAnimated />
          <div className={classes.panels} >
            {
              (!formCadastroOpen && !formEditarOpen && !formTabelaMedicamentosOpen && !formImprimirOpen) &&
              <>
                <CustomMaterialTable
                  titulo={''}
                  msgSemDados={'Nenhuma receita cadastrada'}
                  colunas={colunas}
                  data={data}
                  actions={[
                    { icon: AddBox, tooltip: 'Adicionar Receita', onClick: (event, rowData) => { handleFormCadastroChange() }, isFreeAction: true },
                    { icon: Print, tooltip: 'Gerar PDF Receita', onClick: (event, rowData) => { handleFormImprimirChange(); setIdReceita(rowData.id); setDescricao(rowData.descricao); } },
                    { icon: ListAlt, tooltip: 'Gerenciar Medicamentos da Receita', onClick: (event, rowData) => { handleFormTabelaMedicamentosChange(); setIdReceita(rowData.id); setDescricao(rowData.descricao); } },
                    { icon: Edit, tooltip: 'Editar Receita', onClick: (event, rowData) => { handleFormEditarChange(); setIdReceita(rowData.id); } },
                    { icon: Delete, tooltip: 'Excluir Receita', onClick: (event, rowData) => { handleDelete(rowData.id) } }
                  ]}
                />
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarReceita
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarReceitas={listarReceitas}
              />
            }
            {
              formEditarOpen &&
              <EditarReceita
                idReceita={idReceita}
                formClose={handleFormEditarChange}
                handleLogout={handleLogout}
                listarReceitas={listarReceitas}
              />
            }
            {
              formImprimirOpen &&
              <ImprimirReceita
                idReceita={idReceita}
                descricaoReceita={descricao}
                formClose={handleFormImprimirChange}
                handleLogout={handleLogout}
                listarReceitas={listarReceitas}
              />
            }
            {
              formTabelaMedicamentosOpen &&
              <ListarReceitaMedicamento
                idReceita={idReceita}
                descricaoReceita={descricao}
                formClose={handleFormTabelaMedicamentosChange}
                handleLogout={handleLogout}
                listarReceitas={listarReceitas}
              />
            }
          </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}