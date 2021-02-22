export const iniciarSesion = (dispatch, firebase, email, password) => {
    return new Promise((resolve, eject) => {
        firebase.auth
            .signInWithEmailAndPassword(email, password)
            .then(auth => {
                //auth.user.uid  es el id de la  secion
                //consultando la coleccion de Users y me retornara la coleccion x Id
                firebase.db
                    .collection("Users")
                    .doc(auth.user.uid)
                    .get()
                    .then(doc => {
                        const usuarioDb = doc.data(); // doc.data tiene el json del user 

                        //por medio del dispatch paso los datos al reducer de la sesion
                        dispatch({
                            type: "INICIAR_SESION",
                            sesion: usuarioDb,
                            autenticado: true
                        })
                        resolve({status:true}) //es para que pare o cumpla  la promesa 
                    });

            })
            .catch(error=>{
                console.log('error', error)
                resolve({status:false, mensaje:error})
            });
    });
}

export const crearUsuario =(dispatch, firebase, usuario) =>{
    return new Promise((resolve, eject)=>{
        firebase.auth
        .createUserWithEmailAndPassword(usuario.email, usuario.password)
        .then(auth =>{
            firebase.db
            .collection("Users")
            .doc(auth.user.uid)
            .set({
                id: auth.user.uid,
                email: usuario.email,
                nombre: usuario.nombre,
                apellido: usuario.apellido
            }, {merge:true}
            )
            .then(doc => {
                usuario.id= auth.user.uid;
                dispatch({
                    type: "INICIAR_SESION",
                    sesion:usuario,
                    autenticado:true
                });
                resolve({status:true});
            });
        })
        .catch(error =>{
            console.log("error", error)
            resolve({status:true, mensaje:error});
        })

    })
    
}

export const SalirSesion= (dispatch, firebase)=>{
    return new Promise((resolve, eject)=>{
        firebase.auth.signOut().then(salir=>{
            dispatch({
                type:"SALIR_SESION",
                nuevoUsuario:{
                    nombre:"",
                    apellido:"",
                    email:"",
                    foto:"",
                    id:"",
                    telefono:""
                },
                autenticado:false
            });
            resolve();
        })
    })
}