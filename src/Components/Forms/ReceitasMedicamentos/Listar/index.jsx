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
import CustomMaterialTableNoEdit from '../../../CustomComponents/CustomMaterialTableNoActions';
import { AddBox, ArrowBackIosNew, Delete } from '@mui/icons-material';

import AdicionarReceitaMedicamento from '../Adicionar'

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

export default function FormListarReceitaMedicamento(props) {
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
    { title: 'Medicamento', field: 'descricao_medicamento', width: 250 },
    { title: 'Quantidade', field: 'quantidade_unidade', width: 100 },
  ];

  const [medicamentos, setMedicamentos] = useState([]);

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarReceitaMedicamento();
  }, []);

  async function listarReceitaMedicamento() {
    handleOpen();
    try {
      const getReceiraMedicamento = await api.get(`/receitamedicamento/${props.idReceita}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setMedicamentos(getReceiraMedicamento.data);
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
      title: "Deseja Remover o Medicamento da Receita?",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteReceitaMedicamento(id);
      }
    });
  }

  async function deleteReceitaMedicamento(id) {
    handleOpen();
    try {
      const callBackPost = await api.delete(`/receitamedicamento/${id}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarReceitaMedicamento();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose();
            listarReceitaMedicamento();
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
                <CustomMaterialTableNoEdit
                  titulo={`Medicamentos na Receita "${props.descricaoReceita}"`}
                  msgSemDados={'Nenhum medicamento nesta receita'}
                  colunas={colunas}
                  data={medicamentos}
                  actions={[
                    { icon: AddBox, tooltip: 'Adicionar medicamento à receita', onClick: (event, rowData) => { handleFormCadastroChange() }, isFreeAction: true },
                    { icon: ArrowBackIosNew, tooltip: 'Voltar', onClick: (event, rowData) => { props.formClose() }, isFreeAction: true },
                    { icon: Delete, tooltip: 'Excluir medicamento da receita', onClick: (event, rowData) => { handleDelete(rowData.id) } }
                  ]}
                />
              </>
            }
            {
              formCadastroOpen &&
              <AdicionarReceitaMedicamento
                idReceita={props.idReceita}
                descricaoReceita={props.descricaoReceita}
                formClose={handleFormCadastroChange}
                handleLogout={handleLogout}
                listarReceitaMedicamento={listarReceitaMedicamento}
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