import React, { useState, useEffect } from "react";
import { useStateValue } from "../../sesion/store";
import { Container, Typography, Grid, TextField, Avatar, Button } from "@material-ui/core";
import reactFoto from "../../logo.svg";
import { consumerFirebase } from '../../server';
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from 'react-images-upload'; //esta libreria se descargo de npm install --save react-images-upload
import { v4 as uuidv4 } from 'uuid'; // esta libreria se descargo de npm i uuid


const style = {
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%",
        marginTop: 20
    },
    submit: {
        marginTop: 15,
        marginBottom: 20
    },
    avatar: {
        margin: 10,
        width: 100,
        height: 100

    }
};

const PerfilUsuario = props => {
    const [{ sesion }, dispatch] = useStateValue();
    const firebase = props.firebase;

    let [estado, cambiarEstado] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        id: "",
        foto: ""
    });


    //este es un handle change que captura los datos de entrada
    const cambiarDato = e => {
        const { name, value } = e.target;
        cambiarEstado(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const validarEstadoFormulario = sesion => {
        if (sesion) {
            cambiarEstado(sesion.usuario);
        }
    }
    useEffect(() => {
        if (estado.id === "") {
            validarEstadoFormulario(sesion);
        }
    });

    const guardarCambios = e => {
        e.preventDefault();

        firebase.db
            .collection("Users")
            .doc(firebase.auth.currentUser.uid)
            .set(estado, { merge: true })
            .then(success => {

                firebase.auth.currentUser.updateEmail(estado.email)// para cambiar de contraseña

                dispatch({
                    type: "INICIAR_SESION",
                    sesion: estado,
                    autenticado: true
                })

                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Se guardaron los cambios"
                })

            })
            .catch(error => {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Errores guardando en la base de datos:" + error
                })
            })
    }

    const subirFoto = fotos => {
        //1. Capturar la imagen
        const foto = fotos[0];
        //2. Renombrar la imagen ya que los usuarios podrian subir imagenes con el mismo nombre 
        const claveUnicaFoto = uuidv4(); //uuid crea codigos hexadecimales 
        //3. Obtener el nombre de la foto 
        const nombreFoto = foto.name;
        //4. Obtener la extension de la imagen
        const extensionFoto = nombreFoto.split('.').pop();
        //5. Crear el nuevo nombre de la foto - alias (nombre+_+clavehexadecimal+extencion) (los espacios en blanco se reemplaza x guion bajo) y todo en minusculas
        const alias = (nombreFoto.split('.')[0] + "_" + claveUnicaFoto + "." + extensionFoto).replace(/\s/g,"_").toLowerCase();
        // V a xI.jpg  --->  v_a_xi_423454354423324423.jpg
    
        firebase.guardarDocumento(alias, foto).then(metadata =>{
            //luego de guardar en el storage debemos guardar la url de la foto en el firestore de cada usuario
            firebase.devolverDocumento(alias).then(urlFoto=>{
              estado.foto = urlFoto;
    
              firebase.db
                .collection("Users")
                .doc(firebase.auth.currentUser.uid) // le pasamos el usuario 
                .set(
                  {
                    foto : urlFoto
                  },
                  {merge: true}
                )
                .then(userDB =>{
                  dispatch({
                    type: "INICIAR_SESION", //este metodo me permite refrescar la variable glogal session 
                    sesion: estado,
                    autenticado: true
                  })
                })
    
            })
    
        })
    
      }



    let fotoKey = uuidv4();

    return sesion ? (
        <Container component="main" maxWidth="md" justify="center">
            <div style={style.paper}>
                <Avatar style={style.avatar} src={estado.foto || reactFoto} />
                <Typography component="h1" variant="h5">
                    Perfil de Cuenta
        </Typography>
                <form style={style.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="nombre"
                                variant="outlined"
                                fullWidth
                                label="Nombre"
                                value={estado.nombre || ''}
                                onChange={cambiarDato}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="apellido"
                                variant="outlined"
                                fullWidth
                                label="Apellidos"
                                value={estado.apellido || ''}
                                onChange={cambiarDato}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="email"
                                variant="outlined"
                                fullWidth
                                label="E-Mail"
                                value={estado.email || ''}
                                onChange={cambiarDato}

                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="telefono"
                                variant="outlined"
                                fullWidth
                                label="Telefono"
                                value={estado.telefono || ''}
                                onChange={cambiarDato}

                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <ImageUploader
                                withIcon={false}
                                key={fotoKey}
                                singleImage={true}
                                buttonText="Seleccione su imagen de perfil"
                                onChange={subirFoto}
                                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                                maxFileSize={5242880}
                            />

                        </Grid>



                    </Grid>
                    <Grid container justify="center">
                        <Grid item xs={12} md={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                color="primary"
                                style={style.submit}
                                onClick={guardarCambios}

                            >
                                Guardar Cambios
            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    ) : null;
};

export default consumerFirebase(PerfilUsuario);