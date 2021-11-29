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
import { AddBox, Flag, ArrowBackIosNew, Delete } from '@mui/icons-material';

import AdicionarClienteTratamento from '../Adicionar'

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

export default function FormListarClienteTratamento(props) {
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
    { title: 'Tratamento', field: 'descricao', width: 250 },
    { title: 'Finalizado', field: 'finalizado_string', width: 250 },
  ];

  const [tratamentosCliente, setTratamentosCliente] = useState([]);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarClienteTratamento();
  }, []);

  async function listarClienteTratamento() {
    handleOpen();
    try {
      const getClienteTratamento = await api.get(`/clientetratamento/${props.idCliente}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setTratamentosCliente(getClienteTratamento.data);
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

  async function handleFinalize(id, finalizado) {
    swal({
      title: `Deseja ${(finalizado) ? 'Reativar' : 'Finalizar'} o Tratamento do Paciente?`,
      icon: "info",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        finalizeClienteTratamento(id, finalizado);
      }
    });
  }

  async function finalizeClienteTratamento(id, finalizado) {
    const data = {
      finalizado: !finalizado,
    };
    handleOpen();
    try {
      const callBackPost = await api.put(`/clientetratamento/${id}`, data, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteTratamento();
          });
        }
        if (callBackPost.data.cadastrado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteTratamento();
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

  async function handleDelete(id) {
    swal({
      title: "Deseja Excluir o Tratamento do Paciente?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteClienteTratamento(id);
      }
    });
  }

  async function deleteClienteTratamento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/clientetratamento/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteTratamento();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarClienteTratamento();
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
                  titulo={`Tratamentos do Cliente "${props.nomeCliente}"`}
                  msgSemDados={'Este cliente não possui tratamentos'}
                  colunas={colunas}
                  data={tratamentosCliente}
                  actions={[
                    { icon: AddBox, tooltip: 'Adicionar tratamento ao cliente', onClick: (event, rowData) => { handleFormCadastroChange() }, isFreeAction: true },
                    { icon: ArrowBackIosNew, tooltip: 'Voltar', onClick: (event, rowData) => { props.formClose() }, isFreeAction: true },
                    { icon: Flag, tooltip: 'Finalizar/Reativar tratamento do cliente', onClick: (event, rowData) => { handleFinalize(rowData.id, rowData.finalizado) } },
                    { icon: Delete, tooltip: 'Excluir tratamento do cliente', onClick: (event, rowData) => { handleDelete(rowData.id) } }
                  ]}
                />
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarClienteTratamento
                idCliente={props.idCliente}
                nomeCliente={props.nomeCliente}
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarClienteTratamento={listarClienteTratamento}
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