export const openMensajePantalla=(dispatch, openMensaje)=>{
    // el open tiene el json del sanackbar 
    
    dispatch({
        type:"OPEN_SNACKBAR", 
        openMensaje: openMensaje
    })
}