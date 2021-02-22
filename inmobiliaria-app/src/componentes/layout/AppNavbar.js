import React, { useEffect, useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import BarSession from './bar/BarSesion'
import { withStyles } from '@material-ui/styles'
import { compose } from 'recompose'
import { consumerFirebase } from '../../server'

import { StateContext } from '../../sesion/store'

const styles = theme => ({
    //solo va a apracer cuando la pantalla es md 
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    sectionMobile: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    }
})

function AppNavbar(props) {
   
    const firebase = props.firebase
    const contextType = useContext(StateContext);

    useEffect(() => {
        const [{ sesion }, dispatch] = contextType
        if (firebase.auth.currentUser !== null && !sesion) {
                firebase.db
                .collection("Users")
                .doc(firebase.auth.currentUser.uid)//buscando ese usuario
                .get()
                .then(doc => {
                    const usuarioDb = doc.data();
                    dispatch({
                        type: "INICIAR_SESION",
                        sesion: usuarioDb,
                        autenticado:true
                    })
                })
        }
        
    }, [contextType,firebase])


    const [{sesion}, dispatch] =contextType
    
    //solo los usuaruis logeados pueden ver la barra de navegacion 
    return sesion ?(sesion.autenticado ?(
        <div>
            <AppBar position="static">
                <BarSession />
            </AppBar>
        </div>
    )
    : null
    ) 
    :null

}

export default compose(withStyles(styles), consumerFirebase)(AppNavbar)
