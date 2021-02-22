
import './App.css';
//import { Component } from 'react';
import ListaInmuebles from './componentes/vistas/ListaInmuebles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/theme'
import AppNavbar from './componentes/layout/AppNavbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import  {Snackbar} from '@material-ui/core'
import RegistrarUsuario from './componentes/seguridad/RegistrarUsuario'
import Login from './componentes/seguridad/Login';
import { FirebaseContext } from './server'
import React, { useEffect, useState, useContext } from 'react'
import RutaAutenticada from './componentes/seguridad/RutaAutenticada'


//import openSnackbarReducer from './sesion/reducers/openSnackbarReducer'


import { useStateValue } from './sesion/store'
import Perfilusuario from './componentes/seguridad/Perfilusuario';
import NuevoInmueble from './componentes/vistas/NuevoInmueble';
import EditarInmueble from './componentes/vistas/EditarInmueble';
import LoginTelefono from './componentes/seguridad/LoginTelefono';

function App(props) {

  let firebase = useContext(FirebaseContext);
  const [autenticationIniciada, setupFirebaseInicial] = useState(false)
  // los nombres de openSnackvbar y sesion estan definidas en el index de reducers
  const [{ openSnackbar }, dispatch] = useStateValue();
  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseInicial(val);

    })
  })

  //solo si la autentificacion esta iniciada me muesta todo 
  return autenticationIniciada !== false ? (
    <React.Fragment>
      <Snackbar
      anchorOrigin ={{ vertical: "bottom", horizontal: "center" }}
      open={openSnackbar ? openSnackbar.open : false}
      autoHideDuration={3000}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={
        <span id="message-id">
          {openSnackbar ? openSnackbar.mensaje : ""}
        </span>
      }
      onClose={() =>
        dispatch({  //se comunica con el reducer 
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: false,
            mensaje: ""
          }
        })

      }
      >
        
      </Snackbar>
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />
          <Grid container>
            <Switch>
              {/* esta es una ruta sin autentificacion */}
             {/* <Route path="/" exact component={ListaInmuebles}></Route> */} 
              
              {/* esta es una ruta usando autenticacion  */}
              <RutaAutenticada  exact path="/" autenticadoFirebase={firebase.auth.currentUser} component={ListaInmuebles}/>
              <RutaAutenticada  exact path="/auth/perfil" autenticadoFirebase={firebase.auth.currentUser} component={Perfilusuario}/>
              <RutaAutenticada  exact path="/inmueble/nuevo" autenticadoFirebase={firebase.auth.currentUser} component={NuevoInmueble}/>
              <RutaAutenticada  exact path="/inmueble/:id" autenticadoFirebase={firebase.auth.currentUser} component={EditarInmueble}/>
              <Route path="/auth/registrarUsuario" exact component={RegistrarUsuario}/>
              <Route path="/auth/loginTelefono" exact component={LoginTelefono}/>
              <Route path="/auth/login" exact component={Login}/>
            </Switch>
          </Grid>

        </MuiThemeProvider>
      </Router>
    </React.Fragment>


  )
    : null

}



export default App;
