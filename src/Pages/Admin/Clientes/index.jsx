import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../Components/Toasts';

import Main from '../../../Components/Template/Main'
import Logo from '../../../Components/Template/Logo'
import Nav from '../../../Components/Template/Nav'
import Footer from '../../../Components/Template/Footer'
import { faAddressBook } from '@fortawesome/free-solid-svg-icons'

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
import { AddBox, Person, Edit, Delete } from '@mui/icons-material';

import AdicionarCliente from '../../../Components/Forms/Clientes/Adicionar';
import EditarCliente from '../../../Components/Forms/Clientes/Editar';
import VisualizarCliente from '../../../Components/Forms/Clientes/Visualizar';
import ListarClienteTratamento from '../../../Components/Forms/ClientesTratamentos/Listar';
import ListarClienteDocumentos from '../../../Components/Forms/ClientesDocumentos/Listar';
import ListarRespostasAnamnese from '../../../Components/Forms/RespostasAnamnese/Listar';

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

  const [formVisualizarOpen, setFormVisualizarOpen] = useState(false);

  const handleFormVisualizarChange = () => {
    setFormVisualizarOpen(!formVisualizarOpen);
  }

  const [formTratamentosClienteOpen, setFormTratamentosClienteOpen] = useState(false);

  const handleFormTratamentosClienteChange = () => {
    setFormTratamentosClienteOpen(!formTratamentosClienteOpen);
  }

  const [formDocumentosClienteOpen, setFormDocumentosClienteOpen] = useState(false);

  const handleFormDocumentosClienteChange = () => {
    setFormDocumentosClienteOpen(!formDocumentosClienteOpen);
  }

  const [formRespostasAnamneseOpen, setFormRespostasAnamneseOpen] = useState(false);

  const handleFormRespostasAnamneseChange = () => {
    setFormRespostasAnamneseOpen(!formRespostasAnamneseOpen);
  }

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Cliente', field: 'nome', width: 250 },
    { title: 'E-mail', field: 'email', width: 250 },
    { title: 'Telefone', field: 'telefone', width: 250 },
  ];

  const [data, setData] = useState([]);

  const [idCliente, setIdCliente] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');

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
      setData(getClientes.data);
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
      title: "Deseja excluir o cliente?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteCliente(id);
      }
    });
  }

  async function deleteCliente(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/clientes/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClientes();
          });
        }
        else if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClientes();
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
        <Main icon={faAddressBook} title="Clientes" subtitle="Lista de Clientes Cadastrados">
          <ToastAnimated />
          <div className={classes.panels} >
            {
              (!formCadastroOpen && !formEditarOpen && !formVisualizarOpen && !formTratamentosClienteOpen) &&
              <>
                <CustomMaterialTable
                  titulo={''}
                  msgSemDados={'Nenhum cliente cadastrado'}
                  colunas={colunas}
                  data={data}
                  actions={[
                    { icon: AddBox, tooltip: 'Adicionar Cliente', onClick: (event, rowData) => { handleFormCadastroChange() }, isFreeAction: true },
                    { icon: Person, tooltip: 'Visualizar Cliente', onClick: (event, rowData) => { handleFormVisualizarChange(); setIdCliente(rowData.id); setNomeCliente(rowData.nome); } },
                    { icon: Edit, tooltip: 'Editar Cliente', onClick: (event, rowData) => { handleFormEditarChange(); setIdCliente(rowData.id); } },
                    { icon: Delete, tooltip: 'Excluir Cliente', onClick: (event, rowData) => { handleDelete(rowData.id) } }
                  ]}
                />
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarCliente
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarClientes={listarClientes}
              />
            }
            {
              formEditarOpen &&
              <EditarCliente
                idCliente={idCliente}
                formClose={handleFormEditarChange}
                handleLogout={handleLogout}
                listarClientes={listarClientes}
              />
            }
            {
              (formVisualizarOpen && !formTratamentosClienteOpen && !formDocumentosClienteOpen && !formRespostasAnamneseOpen) &&
              <VisualizarCliente
                idCliente={idCliente}
                formClose={handleFormVisualizarChange}
                handleLogout={handleLogout}
                listarClientes={listarClientes}
                TratamentosClienteChange={handleFormTratamentosClienteChange}
                DocumentosClienteChange={handleFormDocumentosClienteChange}
                RespostasAnamneseChange={handleFormRespostasAnamneseChange}
              />
            }
            {
              formTratamentosClienteOpen &&
              <ListarClienteTratamento
                idCliente={idCliente}
                nomeCliente={nomeCliente}
                formClose={handleFormTratamentosClienteChange}
                handleLogout={handleLogout}
              />
            }
            {
              formDocumentosClienteOpen &&
              <ListarClienteDocumentos
                idCliente={idCliente}
                nomeCliente={nomeCliente}
                formClose={handleFormDocumentosClienteChange}
                handleLogout={handleLogout}
              />
            }
            {
              formRespostasAnamneseOpen &&
              <ListarRespostasAnamnese
                idCliente={idCliente}
                nomeCliente={nomeCliente}
                formClose={handleFormRespostasAnamneseChange}
                handleLogout={handleLogout}
              />
            }
          </div>
        </Main>
        <Footer />
      </div>
    </React.Fragment>
  );
}