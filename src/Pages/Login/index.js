import './styles.css';
import React, { useState, lazy } from 'react';
import { Link, useHistory } from 'react-router-dom';
//Componentes
import ToastAnimated from '../../Components/Toasts';
import { showMessage, showWarning, showError } from '../../Utils/showToast';
//Validadores
import { validarDados } from '../../Utils/validators';
//Services
import api from '../../Services/api.jsx';
import { login, loginTipo } from '../../Services/auth';
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress'; 
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
//Logos
import logo from '../../Assets/Imgs/logo.png';
import Copyright from '../../Components/Copyright/index';
 
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }, 
}));
//Login 
export default function Login() {
  //Loader
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  //Login com Usuário e Senha
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory(); 

  async function handleLogin(e) {
    e.preventDefault();

    const data = {
      email: email,
      senha: senha,
    };
    if (!validarDados(data)) {
      showMessage('warn', 'Preencha todos os campos!');
    } 
    else {
      handleOpen();
      try {
          const callBackPost = await api.post('/admin/login', data);
          if (callBackPost) {
              if (callBackPost.data.statusCode === 200) {
                  handleClose();
                  login(callBackPost.data.token); 
                  if (callBackPost.data.message) {
                      localStorage.setItem("msg", callBackPost.data.message);
                  } 
                  history.push('/Agenda');
              }
              if (callBackPost.data.statusCode === 404) {
                  handleClose();
                  showWarning(callBackPost);
              }
              if (callBackPost.data.statusCode === 403) {
                  handleClose();
                  showError(callBackPost);
              }
          }
      } catch (err) { 
          handleClose();
          showMessage('error', 'Falha ao acessar, tente novamente mais tarde');
      }
    }
  }

  return (
    <> 
      <Grid container component="main" className={classes.root} justifyContent="center" alignItems="center">
        <CssBaseline />
        <div className="backgroundImage"></div>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <img src={logo} alt="TFG Frederico" style={{ maxWidth: '100%', marginBottom: '1em', width: '30ch' }} />
            <Grid container style={{ marginTop: "5%" }}>
              <Grid item xs={12} >
                <Typography className="textInit" style={{ marginTop: "10px" }}>
                  Portal da Clínica
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '1em' }}>
              <form onSubmit={handleLogin} className={classes.form}>
                <Grid container spacing={1} alignItems="flex-end"> 
                  <TextField
                    id="email"
                    label="Usuário"
                    variant="outlined"
                    value={email}
                    required 
                    onChange={e => setEmail(e.target.value)}
                    style={{ marginBottom: '1em'}}
                    inputProps={{
                      maxLength: 200,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle style={{color: "#004725"}}/>
                        </InputAdornment>
                      ),  
                    }}
                    type="text"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid container spacing={1} alignItems="flex-end">
                  <TextField
                    id="senha"
                    label="Senha"
                    variant="outlined"
                    type="password"
                    value={senha}
                    required
                    fullWidth
                    onChange={e => setSenha(e.target.value)}
                    inputProps={{
                      maxLength: 200,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock style={{color: "#004725"}}/>
                        </InputAdornment>
                      ), 
                    }}
                    size="small"
                  />
                </Grid>
                <Grid container spacing={1} style={{ marginTop: '2%' }}>
                  <Grid item xs={12}>
                    <Button type="submit" variant="outlined" className="btn-login">
                      Entrar
                    </Button>
                  </Grid> 
                </Grid> 
              </form>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </div>
        </Grid>
      </Grid>
      <ToastAnimated />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

