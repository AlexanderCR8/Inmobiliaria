import React, { Component } from 'react';
import { consumerFirebase } from '../../server';
import { Paper, Container, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableRow, TableCell, TableBody } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ImageUploader from 'react-images-upload';
import { v4 as uuidv4 } from 'uuid'; // esta libreria se descargo de npm i uuid
import { crearKeyword } from '../../sesion/actions/Keyword';
const style={
    container: {
        paddingTop : "8px"
    },
    paper: {
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    link: {
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    homeIcon:{
        width: 20,
        height:20,
        marginRight: "4px"
    },
    submit:{
        marginTop: 15,
        marginBottom:10
    },
    fotoInmueble: {
        height: "100px"
    }
}

class EditarInmueble extends Component {
    state = {
        inmueble : {
            direccion : "",
            ciudad: "",
            pais:"",
            descripcion:"",
            interior:"",    
            fotos: []
        }
    }

    cambiarDato = e => {
        let inmueble = Object.assign({}, this.state.inmueble);
        inmueble[e.target.name] = e.target.value;
        this.setState({inmueble});
    }

    subirImagenes = imagenes =>{
        const { inmueble } = this.state;
        const {id} = this.props.match.params; //capturo el id del inmueble  a editar 

        //agregar un nombre dinamico por cada imagen que necesites subir al firestorage
        const idUser= this.props.firebase.auth.currentUser.uid
        Object.keys(imagenes).forEach(key=>{
            let codigoDinamico =  uuidv4();
            let nombreImagen = imagenes[key].name;
            let extension = nombreImagen.split(".").pop();
            imagenes[key].alias = (nombreImagen.split(".")[0]  + "_" + codigoDinamico + "." + extension ).replace(/\s/g,"_").toLowerCase();
        })

        this.props.firebase.guardarDocumentos(imagenes, idUser).then(urlImagenes => {
            inmueble.fotos =  inmueble.fotos.concat(urlImagenes);//para que a lo existente agregue 

            this.props.firebase.db
                .collection("Inmuebles")
                .doc(id) //esecifico a que documento quiero actualizar 
                .set(inmueble, {merge: true})
                .then(success =>{
                    this.setState({ //actualizo el estado luego de guardar 
                       inmueble 
                    })
                })
        })
    }

    //eliminar foto de la base de datos 
    eliminarFoto = fotoUrl => async () =>{
        
        const {inmueble} = this.state;
        const {id} = this.props.match.params;

        //expresion regular para extraer el codigo unico de la url de la foto
        let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
        fotoID = fotoID[0];
        fotoID=fotoID.substr(2)// esto es para quitar los dos primeros letras ya que es 2f(codigo)
        console.log(fotoID)

        const idUser= this.props.firebase.auth.currentUser.uid
        await this.props.firebase.eliminarDocumento(fotoID,idUser);

        let fotoList = this.state.inmueble.fotos.filter(foto => {//para traer la nueva lista de fotos son las que fueron eliminadas del storage
            return foto !== fotoUrl;
        })
        

        inmueble.fotos = fotoList;
        //esta nueva lista se agrega en la base de datos 
        this.props.firebase.db
            .collection("Inmuebles")
            .doc(id)
            .set(inmueble, {merge: true})
            .then(success => {
                this.setState({
                    inmueble
                })
            })
    }

    async componentDidMount() {
        const {id} = this.props.match.params; // esto es para capturar el id del inmueble del Lista Inmuebles
        
        const inmuebleCollection = this.props.firebase.db.collection("Inmuebles");
        const inmuebleDB = await inmuebleCollection.doc(id).get(); //llamo al inmuble x id  

        this.setState({
            inmueble : inmuebleDB.data()
        })

    }

    guardarInmueble = () => {
        const {inmueble} = this.state;
        const {id} = this.props.match.params;

        ///creamos nuevas keywords ya que e va a editar 
        const textoBusqueda = inmueble.direccion + " " + inmueble.ciudad + " " + inmueble.pais;
        const keyWords = crearKeyword(textoBusqueda);

        inmueble.keywords = keyWords;
        inmueble.propietario = this.props.firebase.auth.currentUser.uid; //para almacenar el propietario

        this.props.firebase.db
            .collection("Inmuebles")
            .doc(id)
            .set(inmueble, {merge: true})
            .then( success => {
                this.props.history.push("/");
            })

    }

    render() {
        let uniqueID = uuidv4();

        return (
            <Container style={style.container}>
                <Paper style={style.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} href="/" >
                                    <HomeIcon style={style.homeIcon} />
                                    Home
                                </Link>
                                <Typography color="textPrimary">Editar Inmueble</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField 
                                name="direccion"
                                label="Direccion del inmueble"
                                fullWidth
                                onChange={this.cambiarDato}
                                value={this.state.inmueble.direccion}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                name="ciudad"
                                label="Ciudad"
                                fullWidth
                                onChange={this.cambiarDato}
                                value={this.state.inmueble.ciudad}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                name="pais"
                                label="Pais"
                                fullWidth
                                onChange={this.cambiarDato}
                                value={this.state.inmueble.pais}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField 
                                name="descripcion"
                                label="Descripcion"
                                fullWidth
                                rowsMax="4"
                                multiline
                                onChange={this.cambiarDato}
                                value={this.state.inmueble.descripcion}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <TextField 
                                name="interior"
                                label="Interior"
                                fullWidth
                                rowsMax="4"
                                onChange={this.cambiarDato}
                                value={this.state.inmueble.interior}
                            />
                        </Grid>
                    </Grid>

                    <Grid container justify="center">
                        <Grid item xs={12} sm={6}>
                            <ImageUploader 
                                key={uniqueID}
                                withIcon={true}
                                buttonText="Seleccion su imagen"
                                onChange={this.subirImagenes}
                                imgExtension={[".jpg",".gif",".png",".jpeg"]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Table>
                                <TableBody>
                                    {
                                        this.state.inmueble.fotos 
                                        ?this.state.inmueble.fotos.map((foto, i) =>(
                                            <TableRow key={i}>
                                                 <TableCell align="left">
                                                    <img src={foto} style={style.fotoInmueble} />
                                                 </TableCell>   
                                                 <TableCell align="left">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={this.eliminarFoto(foto)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                 </TableCell>
                                            </TableRow>            
                                        ))
                                        :""
                                    }
                                </TableBody>
                            </Table>
                        </Grid>

                    </Grid>


                    <Grid container justify="center">
                        <Grid item xs={12} sm={6}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                size="large"
                                color="primary"
                                style={style.submit}
                                onClick={this.guardarInmueble}
                            >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>




                </Paper>
            </Container>
        );
    }
}

export default consumerFirebase(EditarInmueble);