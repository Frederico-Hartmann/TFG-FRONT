import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import api from '../../../../Services/api';
import { getToken, logout } from '../../../../Services/auth';
import swal from 'sweetalert';
import { showMessage } from '../../../../Utils/showToast';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/Appbar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ResponderAnamnese from '../Responder'

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
  dados: {
    marginLeft: theme.spacing(3),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
}));

export default function FormListarRespostasAnamnese(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [formResponderOpen, setFormResponderOpen] = useState(false);

  const handleFormResponderChange = () => {
    setFormResponderOpen(!formResponderOpen);
  }

  const [data, setData] = useState([]);
  const [idPergunta, setIdPergunta] = useState(0);
  const [textoPergunta, setTextoPergunta] = useState('');
  const [idResposta, setIdResposta] = useState(0);
  const [textoResposta, setTextoResposta] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    listarRespostasAnamnese();
  }, []);

  async function listarRespostasAnamnese() {
    handleOpen();
    try {
      const getRespostasAnamnese = await api.get(`/respostas/${props.idCliente}`, {
        headers: { Authorization: "Bearer " + getToken() }
      });
      handleClose();
      setData(getRespostasAnamnese.data);
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

  async function handleResponder(e) {
    setIdPergunta(e.id_pergunta);
    setTextoPergunta(e.pergunta);
    setIdResposta(e.id_resposta);
    setTextoResposta((e.resposta) ? e.resposta : '');
    handleFormResponderChange();
  }

  return (
    <div style={{ backgroundColor: '#FFF', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar>
            <Typography variant="h5" className={classes.title} >
              {`Anamnese de ${props.nomeCliente}`}
            </Typography>
            <Button className="btn-login btn-form" variant="outlined" onClick={props.formClose}>
              Voltar
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{ backgroundColor: '#FFF', marginTop: '1em' }}>
          <div className={classes.panels} >
            {
              !formResponderOpen && data.length > 0 &&
              <>
                {data.map((e, id) => {
                  return <div id={id} style={{ backgroundColor: '#E0FFFF', marginBottom: '1em' }}>
                    <Typography variant="body1" className={classes.title} >
                      {`${e.pergunta}`}
                    </Typography>
                    <Typography variant="body2" className={classes.dados} >
                      {`${(e.resposta) ? e.resposta : 'Não Respondido'}`}
                    </Typography>
                    <Button className="btn-login btn-form" variant="outlined" onClick={() => handleResponder(e)}>
                      Editar Resposta
                    </Button>
                  </div>
                })}
              </>
            }
            {
            !formResponderOpen && data.length == 0 &&
              <Typography variant="body1" className={classes.title} >
                Não foram encontradas perguntas.
              </Typography>
            }
            {
              formResponderOpen &&
              <ResponderAnamnese
                idCliente={props.idCliente}
                idPergunta={idPergunta}
                textoPergunta={textoPergunta}
                idResposta={idResposta}
                textoResposta={textoResposta}
                setTextoResposta={setTextoResposta}
                formClose={handleFormResponderChange}
                handleLogout={handleLogout}
                listarRespostasAnamnese={listarRespostasAnamnese}
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