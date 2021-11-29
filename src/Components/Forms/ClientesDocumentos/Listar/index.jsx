import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../../../../Services/api';
import { getToken, logout } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../Utils/showToast';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../CustomComponents/CustomMaterialTableNoActions';
import { AddBox, Download, ArrowBackIosNew, Delete } from '@mui/icons-material';

import AdicionarClienteDocumento from '../Adicionar'

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

export default function FormListarClienteDocumento(props) {
  const classes = useStyles();
  const history = useHistory();
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

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Documento', field: 'nome', width: 250 },
  ];

  const [data, setData] = useState([]);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarClienteDocumento();
  }, []);

  async function listarClienteDocumento() {
    handleOpen();
    try {
      const getClienteDocumento = await api.get(`/clientedocumento/${props.idCliente}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getClienteDocumento.data);
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

  async function download(id) {
    handleOpen();
    try {
      const getDocumento = await api.get(`/clientedocumentodownload/${id}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });

      const downloadLink = document.createElement("a");
      downloadLink.href = getDocumento.data[0].documento;
      downloadLink.download = getDocumento.data[0].nome;
      downloadLink.click();
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

  async function handleDelete(id) {
    swal({
      title: "Deseja Excluir o Documento do Paciente?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteClienteDocumento(id);
      }
    });
  }

  async function deleteClienteDocumento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/clientedocumento/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteDocumento();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteDocumento();
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
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <div className={classes.panels} >
            {
              !formCadastroOpen &&
              <>
                <CustomMaterialTable
                  titulo={`Documentos do Cliente "${props.nomeCliente}"`}
                  msgSemDados={'Este cliente não possui documentos'}
                  colunas={colunas}
                  data={data}
                  actions={[
                    { icon: AddBox, tooltip: 'Adicionar documento ao cliente', onClick: (event, rowData) => { handleFormCadastroChange() }, isFreeAction: true },
                    { icon: ArrowBackIosNew, tooltip: 'Voltar', onClick: (event, rowData) => { props.formClose() }, isFreeAction: true },
                    { icon: Download, tooltip: 'Baixar documento', onClick: (event, rowData) => { download(rowData.id) } },
                    { icon: Delete, tooltip: 'Excluir documento do cliente', onClick: (event, rowData) => { handleDelete(rowData.id) } }
                  ]}
                />
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarClienteDocumento
                idCliente={props.idCliente}
                nomeCliente={props.nomeCliente}
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarClienteDocumento={listarClienteDocumento}
              />
            }
          </div>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}