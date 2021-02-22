import { Avatar, Button, Drawer, IconButton, Toolbar, Typography } from '@material-ui/core'
import React, { useState, useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { consumerFirebase } from '../../../server'
import { compose } from 'recompose'
import { StateContext } from '../../../sesion/store'
import { SalirSesion } from '../../../sesion/actions/sesionAction'
import { MenuDerecha } from './MenuDerecha'
import { MenuIzquierda } from './MenuIzquierda'
import fotoUsuarioTemp from '../../../logo.svg'
import { withRouter, Link } from 'react-router-dom'

//import {MuiThemeProvider} from "@material-ui/core/styles";



const styles = theme => ({
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    grow: {
        flexGrow: 1
    },
    sectionMovil: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    avatarSize: {
        width: 40,
        height: 40
    },
    listItemText: {
        fontSize: "14px",
        fontWeight: 600,
        paddingLeft: "15px",
        color: "#212121"
    },
    list: {
        width: 250
    }

});
function BarSesion(props) {
    const contextType = useContext(StateContext);
    const servfirebase = props.firebase
    const [state, setstate] = useState({
        right: false,
        left: false
    })

    const salirSesionApp = () => {
        const [{ sesion }, dispatch] = contextType
        SalirSesion(dispatch, servfirebase).then(success => {
            props.history.push("/auth/login")
        })

    }
    const toggleDrawer = (side, open) => () => {
        setstate({
            [side]: open
        })
    }



    const { classes } = props;
    const [{ sesion, dispatch }] = contextType
    const { usuario } = sesion
    let textoUsuario = usuario.nombre + " " + usuario.apellido
    if(!usuario.nombre){
        textoUsuario=usuario.telefono;
    }


    return (
        <div>
            <Drawer
                open={state.left}
                onClose={toggleDrawer("left", false)}
                anchor="left"
            >
                <div
                    role="button"
                    onClick={toggleDrawer("left", false)}
                    onKeyDown={toggleDrawer("left", false)}
                >
                    <MenuIzquierda
                        classes={classes}
                    />
                </div>

            </Drawer>

            <Drawer
                open={state.right}
                onClose={toggleDrawer("right", false)}
                anchor="right"
            >
                <div
                    role="button"
                    onClick={toggleDrawer("right", false)}
                    onKeyDown={toggleDrawer("right", false)}
                >
                    <MenuDerecha
                        classes={classes}
                        usuario={usuario}
                        textoUsuario={textoUsuario}
                        fotoUsuario={usuario.foto||fotoUsuarioTemp}
                        salirSesion={salirSesionApp}
                    />
                </div>

            </Drawer>
            <Toolbar>
                <div>
                    <IconButton color="inherit" onClick={toggleDrawer("left", true)}>
                        <i className="material-icons"> menu</i>
                    </IconButton>
                </div>

                <Typography variant="h6">VAXI HOMES</Typography>
                <div className={classes.grow}></div>
                <div className={classes.sectionDesktop}>
                    <IconButton color="inherit" component={Link} to="">
                        <i className="material-icons">mail_outline</i>
                    </IconButton>
                    <Button color="inherit" onClick={salirSesionApp}>
                        Salir
                    </Button>
                    <Button color="inherit" >{textoUsuario}</Button>
                    <Avatar src={usuario.foto||fotoUsuarioTemp}>

                    </Avatar>

                </div>
                <div className={classes.sectionMovil}>
                    <IconButton color="inherit"
                        onClick={toggleDrawer("right", true)}
                    >
                        <i className="material-icons">more_vert</i>
                    </IconButton>
                </div>
            </Toolbar>
        </div>
    )

}
export default compose(
    withRouter,
    consumerFirebase,
    withStyles(styles))
    (BarSesion)