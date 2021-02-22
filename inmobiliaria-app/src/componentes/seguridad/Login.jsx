import { Avatar, Button, Container, Grid, Link, TextField, Typography } from '@material-ui/core'
import LockOutlineIcon from '@material-ui/icons/LockOutlined'
import React , {useState, useContext } from 'react'
import {compose} from 'recompose'
import {consumerFirebase} from '../../server'
import {iniciarSesion} from '../../sesion/actions/sesionAction'

import {StateContext} from '../../sesion/store'
import {openMensajePantalla} from '../../sesion/actions/snackbarAction'


const style={
    paper:{
        marginTop:9,
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    },
    avatar:{
        marigin:5,
        backgroundColor:"red"
    },
    form:{
        width:"100%",
        marginTop:8  
    },
    submit:{
        marginTop:10,
        marginBottom:20
    }
    
}
    
 function Login(props) {   
    const contextType = useContext(StateContext); //uso el contexto de store
   // const [contextType , setContextType]=useState(null)
    const [usuario, setUsuario] = useState({
        email:"",
        password:""
    })
    const servfirebase= props.firebase

    const onChange=async e=>{
        e.persist();
        await setUsuario({
        ...usuario,
            [e.target.name]:e.target.value
        });
        //console.log(usuario)
    }
/*     useEffect(()=>{
        //setContextType(StateContext)
        if (props.firebase !== servfirebase) {
            setservFirebase(props.firebase)
          }
          return null
     },[props.firebase,servfirebase]) */
      
     /* const login =e =>{
         e.preventDefault();
        servfirebase.auth
        .signInWithEmailAndPassword(usuario.email, usuario.password)
        .then(auth => {
            props.history.push('/'); //una vez que se complete el login me lleva a la pagina principal
        })
        .catch(error=> {
            console.log(error)
        })
     } */
     const login= async e=>{
        e.preventDefault();
        const [{sesion}, dispatch]=contextType
        const {email, password}=usuario
        let callback =await iniciarSesion(dispatch, servfirebase,email, password)
        if(callback.status){
            props.history.push("/");
        }else{
            openMensajePantalla(dispatch, {
                open:true,
                mensaje:callback.mensaje.message
            })
        }
     }

     //solo con este metodo cambia de contraseña por medio del email usando solo con firebase 
     const resetearPassword=()=>{
        const [{sesion}, dispatch]=contextType
        servfirebase.auth.sendPasswordResetEmail(usuario.email)
        .then(success=>{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:"se han enviado un correo electronico a tu cuenta"
            })
        })
        .catch(error=>{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:error.message
            })
        })
     }

    return (
        
        
            /* xs para movil */
            <Container maxWidth="xs">
                <div style ={style.paper}>
                    <Avatar style={style.avatar}>
                        <LockOutlineIcon></LockOutlineIcon>
                    </Avatar>
                    {/* esto se usa para variar el tamaño de la fuente que va a ser responsive desde h1 a h5 */}
                    <Typography component="h1" variant="h5">
                        Ingrese Usuario
                    </Typography>
                    <form style={style.form}>
                        <TextField
                        variant="outlined" /* borde outlined */
                        label="E-mail"
                        name="email"
                        fullWidth /* para que tome el 100% de la columna */
                        margin="normal" /* margen normal para separar los textfield */
                        onChange={onChange}
                        value={usuario.email}
                        />
                        <TextField
                        variant="outlined"
                        label="password"
                        type="password"
                        name="password"
                        fullWidth
                        margin="normal"
                        onChange={onChange}
                        value={usuario.password}
                        />
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained" /* para dar un fondo */
                        color="primary" /* para dar color */
                        onClick={login}
                        style={style.submit}
                        >
                            Ingresar
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2" onClick={resetearPassword}>
                                    {"Olvido su contraseña?"}
                                </Link>
                                
                            </Grid>
                            <Grid item>
                            <Link href="/auth/registrarUsuario" variant="body2">
                                    {"No tienes cuenta? Registrate"}
                                </Link>
                            </Grid>
                        </Grid>
                        
                    </form>
                    <Button fullWidth variant="contained" color="primary" style={style.submit} href="/auth/loginTelefono">
                        Ingrese con su telefono
                    </Button>
                </div>
            </Container>
            
        
    )
}
export default compose(consumerFirebase)(Login)
