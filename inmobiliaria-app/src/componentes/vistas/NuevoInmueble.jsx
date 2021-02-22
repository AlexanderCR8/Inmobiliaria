import { Container, Paper,Grid,Breadcrumbs,Link,Typography,TextField,Button,Table,TableBody,TableRow,TableCell } from '@material-ui/core'
import React, { Component } from 'react'
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from 'uuid'; // esta libreria se descargo de npm i uuid
import { crearKeyword } from '../../sesion/actions/Keyword';


const style ={
    container: {
        paddingTop: "8px"
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
        display: "flex"
      },
      homeIcon: {
        width: 20,
        height: 20,
        marginRight: "4px"
      },
      submit: {
        marginTop: 15,
        marginBottom: 10
      },
      foto: {
        height: "100px"
      }
}

//componente sin hooks 
 class NuevoInmueble extends Component {

    state = {
        inmueble: {
          direccion: "",
          ciudad: "",
          pais: "",
          descripcion: "",
          interior: "",
          fotos: []
        },
        archivos: [] // esta es para que se guarde  las fotos de manera temporal (nombre y Url) en el storage de react 
                    // para poder eliminarlos antes de enviar a guardar en firebase 
      };
    
      //este es un handlechange que captura los datos de los textfield y foto
      entraDatoEnEstado = e => {
        let inmueble_ = Object.assign({}, this.state.inmueble);
        inmueble_[e.target.name] = e.target.value;
        this.setState({
          inmueble: inmueble_
        });
      };
    
      //metodo para subir fotos y previsualizarlas sin gurdarlas 
      subirFotos = documentos => {
        //Object.keys devuelve un array de las propiedades names de un objeto

        Object.keys(documentos).forEach(function(key) {
            //a documentos se esta creando un atributo temporal llamado URLTEMP
            //URL.createObjectURL recibe un media stream  y crea una url temporal
            //con esto podremos observar temporalmente las fotos en la pagina 
           documentos[key].urlTemp = URL.createObjectURL(documentos[key]);
        });
    
        this.setState({
            //concat sirve para unir dos o mas arrays
            //en archivos se guardan las urls temporales 
          archivos: this.state.archivos.concat(documentos)
        });
      };
    
      guardarInmueble = () => {
        const { archivos, inmueble } = this.state;
    
         //Crearle a cada image(archivo) un alias, ese alias es la referencia con la cual posteriormente lo invocaras
        //Ademas ese alias sera almacenado en la base de datos(firestore/firebase)
    
        //recorro todos los archivos
        const idUser= this.props.firebase.auth.currentUser.uid
        Object.keys(archivos).forEach(function(key) {
          let valorDinamico = Math.floor(new Date().getTime() / 1000); //tomamos el tiempo actual en mili segundos para crear un alias
          let nombre = archivos[key].name;
          let extension = nombre.split(".").pop();
          archivos[key].alias = ( nombre.split(".")[0] + "_" + valorDinamico +"." +extension).replace(/\s/g, "_").toLowerCase();
          //archivos[key].idUser = idUser;// creo un atributo idUser  para usarlo en el guardado de las imagenes 
        });
    
        const textoBusqueda =
          inmueble.direccion + " " + inmueble.ciudad + " " + inmueble.pais; 
        let keywords = crearKeyword(textoBusqueda);
      
        //guardamos las fotos en el storage  y luego que se complete guardamos las urls en el campo fotos de firestore
        this.props.firebase.guardarDocumentos(archivos, idUser).then(arregloUrls => {
          inmueble.fotos = arregloUrls;//arregloUrls tiene las urls de todas las fotos que guaramos en storage
          inmueble.keywords = keywords; // se guarda en un atributo keywords  en firestore
          inmueble.propietario = idUser //se gurada el id del usuario en el storage 
    
          this.props.firebase.db
            .collection("Inmuebles") /// si no existe esa coleccion la crea 
            .add(inmueble)
            .then(success => {
              this.props.history.push("/"); //redirige al inicio
            })
            .catch(error => {
              openMensajePantalla({
                open: true,
                mensaje: error
              });
            });
        
        
         });
      };
    
      //metodo para eliminar cada  url del arreglo archivos que guarda temporalmente las fotos  
      eliminarFoto = nombreFoto => () => {

        //nombre foto representa 
        this.setState({
            //decimos que archivos es igual al arreglo de archivos sin el archivo que se selecciono para eliminar 
          archivos: this.state.archivos.filter(archivo => {
            return archivo.name !== nombreFoto;
          })
        });
      };
    
    render() {
        let imagenKey = uuidv4();
        return (
            <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Home
                </Link>
                <Typography color="textPrimary">Nuevo Inmueble</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="direccion"
                label="Direccion del inmueble"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.direccion}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.ciudad}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="pais"
                label="Pais"
                fullWidth
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.pais}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="descripcion"
                label="Descripcion del Inmueble"
                fullWidth
                multiline
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.descripcion}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="interior"
                label="Interior del Inmueble"
                fullWidth
                multiline
                onChange={this.entraDatoEnEstado}
                value={this.state.inmueble.interior}
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <ImageUploader
                key={imagenKey} /* debe ser un valor dinamico */
                withIcon={true}
                buttonText="Seleccione imagenes"
                onChange={this.subirFotos}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880} /* 5 Mb */
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* aqui es para previsualizar las fotos para poder eliminarlas o seleccionar otras antes de enviarlas */}
              <Table> 
                <TableBody>
                  {this.state.archivos.map((archivo, i) => (
                    <TableRow key={i}>
                      <TableCell align="left">
                        <img src={archivo.urlTemp} style={style.foto} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={this.eliminarFoto(archivo.name)} /* pese a que archivo no tiene un atributo name se almacena temporalmente el nombre en ese atributo */
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={6}>
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
        )
    }
}

export default consumerFirebase(NuevoInmueble);
