import React, { Component } from 'react'

import Button from '@material-ui/core/Button'
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, CardMedia, Card, CardContent, CardActions, ButtonGroup } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import logo from "../../logo.svg";

import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import { obtenerData, obtenerDataAnterior } from "../../sesion/actions/InmbuebleAction";
const style = {
    cardGrid: {
        paddingTop: 8,
        paddingBottom: 8
    },
    paper: {
        backgroundColor: "#f5f5f5",
        padding: "20px",
        minHeight: 650
    },
    link: {
        display: "flex"
    },
    gridTextfield: {
        marginTop: "20px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {
        paddingTop: "56.25%"
    },
    cardContent: {
        flexGrow: 1
    },
    barraBoton: {
        marginTop: "20px"
    }
};

class ListaInmuebles extends Component {
    state = {
        inmuebles: [],
        textoBusqueda: "",
        paginas: [],
        paginaSize: 2,
        casaInicial: null,
        paginaActual: 0
    };
    cambiarBusquedaTexto = e => {
        const self = this;
        self.setState({
            [e.target.name]: e.target.value
        });

        //esto sirve para esperar a que le usuario termine de escribir 
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            name: e.target.value,
            typing: false,
            typingTimeout: setTimeout(goTime => {
                //query para devolvernos los inmuebles por el keyword ingresado 
               /*  let objectQuery = this.props.firebase.db
                    .collection("Inmuebles")
                    .orderBy("direccion")
                    .where("keywords", "array-contains", self.state.textoBusqueda.toLowerCase()); //busca dentro del arreglo de keywords que coincida con el texto ingresado

                //si el texto de busqueda es vacio entonces muestra todos los inmuebles 
                if (self.state.textoBusqueda.trim() === "") {//trim() elimina los espacios en blanco 
                    objectQuery = this.props.firebase.db
                        .collection("Inmuebles")
                        .orderBy("direccion")
                }
                objectQuery.get().then(snapshot => {
                    const arrayInmuebles = snapshot.docs.map(doc => {
                        let data = doc.data();
                        let id = doc.id
                        return { id, ...data }
                    })
                    this.setState({
                        inmuebles: arrayInmuebles
                    })
                }) */
                 const firebase = this.props.firebase;
                const { paginaSize } = this.state;

                obtenerDataAnterior(firebase, paginaSize, 0, self.state.textoBusqueda).then(firebaseReturnData => {
                    const pagina = {
                        inicialValor: firebaseReturnData.inicialValor,
                        finalValor: firebaseReturnData.finalValor
                    }
                    const paginas = [];
                    paginas.push(pagina);

                    this.setState({
                        paginaActual: 0,
                        paginas,
                        inmuebles: firebaseReturnData.arrayInmuebles
                    })

                })



            }, 500) //espera medio segundo
        });
    };

    eliminarInmueble = id => {
        this.props.firebase.db.collection("Inmuebles")
            .doc(id)
            .delete()
            .then(success => {
                this.eliminarInmuebledeListaEstado(id);
            })
    }

    eliminarInmuebledeListaEstado = id => {
        // almaceno en una lista de inmiebles nueva  la lista del estado sin el inmueble eliminado
        const inmuebleListaNueva = this.state.inmuebles.filter(
            inmueble => inmueble.id !== id
        )
        //actualizo el estado de inmueble 
        this.setState({
            inmuebles: inmuebleListaNueva
        })
    }
    anteriorPagina = () => {
        const {paginaActual, paginaSize, textoBusqueda, paginas} = this.state;
       
        if(paginaActual > 0) {
          const firebase = this.props.firebase;
           obtenerDataAnterior(firebase, paginaSize, paginas[paginaActual - 1].inicialValor, textoBusqueda).then(firebaseReturnData => {
            const pagina = {
              inicialValor : firebaseReturnData.inicialValor,
              finalValor : firebaseReturnData.finalValor
            }
    
            paginas.push(pagina);
          
            this.setState({
              paginas, 
              paginaActual : paginaActual - 1,
              inmuebles : firebaseReturnData.arrayInmuebles
            })
    
          })
        }
    
    
      }

    siguientePagina = () => {
        const {paginaActual,paginaSize, textoBusqueda, paginas} = this.state;
        const firebase = this.props.firebase;
        const casaInicial= paginas[paginaActual].finalValor // es el ultimo valor del arreglo anterior
    
        obtenerData(firebase, paginaSize,casaInicial, textoBusqueda).then( firebaseReturnData => {
    
          if(firebaseReturnData.arrayInmuebles.length > 0){
            const pagina = {
              inicialValor :  firebaseReturnData.inicialValor,
              finalValor : firebaseReturnData.finalValor
            }
    
            paginas.push(pagina);
            this.setState({
              paginas,
              paginaActual : paginaActual + 1,
              inmuebles : firebaseReturnData.arrayInmuebles
            })
          }
        })
      }

    async componentDidMount() {

        const { paginaSize, textoBusqueda, casaInicial, paginas } = this.state;

        const firebase = this.props.firebase;

        const firebaseReturnData = await obtenerData(firebase, paginaSize, casaInicial, textoBusqueda);

        const pagina = {
            inicialValor: firebaseReturnData.inicialValor,
            finalValor: firebaseReturnData.finalValor
        }

        paginas.push(pagina);

        //console.log(firebaseReturnData);

        this.setState({
            inmuebles: firebaseReturnData.arrayInmuebles,
            paginas,
            paginaActual: 0
        })

    }

    editarInmueble = id => {
        this.props.history.push("/inmueble/" + id)
    }
    render() {
        return (
            <Container style={style.cardGrid}>
                <Paper style={style.paper}>
                    <Grid item xs={12} sm={12}>
                        <Breadcrumbs aria-label="breadcrumbs">
                            <Link color="inherit" style={style.link} href="/">
                                <HomeIcon />
                    Home
                  </Link>
                            <Typography color="textPrimary">Mis Inmuebles</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12} sm={6} style={style.gridTextfield}>
                        <TextField
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            name="textoBusqueda"
                            variant="outlined"
                            label="Ingrese el inmueble a buscar"
                            onChange={this.cambiarBusquedaTexto}
                            value={this.state.textoBusqueda}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} style={style.barraBoton}>
                        <Grid container spacing={1} direction="column" alignItems="flex-end">
                            <ButtonGroup size="small" aria-label="Small outlined group">
                                <Button onClick={this.anteriorPagina}>
                                    <ArrowLeft />
                                </Button>
                                <Button onClick={this.siguientePagina}>
                                    <ArrowRight />
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>


                    <Grid item xs={12} sm={12} style={style.gridTextfield}>
                        <Grid container spacing={4}>
                            {this.state.inmuebles.map(card => (  /* recorro todo los inmuebles  */
                                <Grid item key={card.id} xs={12} sm={6} md={4}> {/* si es para telefono movil completa las 12 columnas , si es para desktop a 4 y para pantallas muy gramdes 4*/}
                                    <Card style={style.card}>
                                        <CardMedia
                                            style={style.cardMedia}
                                            image={
                                                card.fotos ? card.fotos[0] /* si el arrglo tiene fotos si no imprime logo */
                                                    ? card.fotos[0] /* si una imegen del arreglo de fotos esta vacia imprime tambien logo */
                                                    : logo
                                                    : logo
                                            }
                                            title="Mi Inmueble"
                                        />

                                        <CardContent style={style.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {card.ciudad + ", " + card.pais}
                                            </Typography>
                                        </CardContent>

                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => this.editarInmueble(card.id)}>
                                                Editar
                                            </Button>
                                            <Button size="small" color="primary" onClick={() => this.eliminarInmueble(card.id)}>
                                                Eliminar
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        )
    }
}

export default consumerFirebase(ListaInmuebles);
