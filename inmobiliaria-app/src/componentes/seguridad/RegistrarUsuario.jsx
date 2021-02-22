import { Avatar, Button, Container, Grid, TextField, Typography } from '@material-ui/core'

import LockOutLineIcon from '@material-ui/icons/LockOutlined'
import React, { useState,  useContext } from 'react'
import { compose } from 'recompose'
import { consumerFirebase } from '../../server'
import {crearUsuario} from '../../sesion/actions/sesionAction'
import {StateContext} from '../../sesion/store'
import {openMensajePantalla} from '../../sesion/actions/snackbarAction'

const style = {
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        marin: 8,
        backgroundColor: "#e53935"
    },
    form: {
        width: "100%",
        marginTop: 10
    },
    submit: {
        marginTop: 15,
        marginBotton: 20
    }
}

/* const usuarioInicial = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
} */

//firebase se pasa como prop desde (server/context.js) y se le asigna a servfirebase dentro de useEfect 
function RegistrarUsuario(props) {
    const contextType = useContext(StateContext);
    const servfirebase = props.firebase
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    })
    //const [prevCount, setPrevCount] = useState(null);

/*     useEffect(() => {
        if (props.firebase !== servfirebase) {
            setservFirebase(props.firebase)
        }
        return null
    }, [props.firebase, servfirebase]) */


    const onChange = async e => {
        e.persist();
        await setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });

        // console.log(usuario);
    }

    const registrarUsuario = async e => {
        e.preventDefault();
        const [{sesion}, dispatch]=contextType
        let callback =await crearUsuario(dispatch, servfirebase,usuario)
        if(callback.status){
            props.history.push("/");
        }else{
            openMensajePantalla(dispatch, {
                open:true,
                mensaje:callback.mensaje.message
            })
        }

    }

/*     const registrarUsuario = e => {
        e.preventDefault();
        console.log(usuario)

        servfirebase.auth //creando un usuarui en authentification de firebase 
            .createUserWithEmailAndPassword(usuario.email, usuario.password)
            .then(auth => {

                const usuarioDb = {
                    usuarioid: auth.user.uid, // pasamos el id de el usuario en auth al usuario en db  
                    email: usuario.email,
                    apellido: usuario.apellido
                };
                //si guarda el usuarui en Authentificacion de firebase se guarda el usuario en Firestore
                servfirebase.db
                    .collection("Users")
                    .add(usuarioDb) //guardamos el usuario son el password ya que no es "etico" esto solo se guarda en auth
                    .then(usuarioAfter => {
                        console.log('esta insercion fue un exito', usuarioAfter);
                        props.history.push("/"); //para redirigir a inicio
                        //setUsuario(usuarioInicial)
                    })
                    .catch(error => {
                        console.log('error', error)
                    })

            }).catch(error => {
                console.log(error)
            })


    } */


    return (
        <Container maxWidth="md">
            <div style={style.paper}>
                <Avatar style={style.avatar}>
                    <LockOutLineIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registre su Cuenta
                    </Typography>
                <form style={style.form}>
                    <Grid container spacing={2}>
                        {/* aqui hace que tome 6 columnas para pantalla completa es decir la mitad del espacio total y 12 osea todo el ancho cuando es movil */}
                        <Grid item md={6} xs={12}>
                            <TextField name="nombre" value={usuario.nombre} onChange={onChange} fullWidth label="Ingrese su Nombre"></TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField name="apellido" value={usuario.apellido} onChange={onChange} fullWidth label="Ingrese su Apellido"></TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField name="email" value={usuario.email} onChange={onChange} fullWidth label="Ingrese su email"></TextField>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField type="password" value={usuario.password} onChange={onChange} name="password" fullWidth label="Ingrese su contraseña"></TextField>
                        </Grid>

                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="submit" onClick={registrarUsuario} variant="contained" fullWidth size="large" color="primary" style={style.submit}>
                                    Registrar
                                    </Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </form>
            </div>
        </Container>
    )

}
export default compose(consumerFirebase)(RegistrarUsuario)