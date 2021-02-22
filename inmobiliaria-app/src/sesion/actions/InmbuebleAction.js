
//funcion para implementar la paginacion 
export const obtenerData = (firebase, paginaSize, casaInicial, texto) => {
    //paginaSize es tamaño de imagenes que va a contener cada pagina 
    //casaInicial es el numero desde donde comensara la paginacion
    //texto es el texto que s eintroduce en el cuadro de busqueda 
    return new Promise(async (resolve, eject)=> {
        let inmuebles = firebase.db
            .collection("Inmuebles")
            .where("propietario","==",firebase.auth.currentUser.uid) // se debe crear un index (se crea automatico al ver la consola en el navegador ) 
            .orderBy("direccion")
            .limit(paginaSize);

        if(casaInicial !== null){
            inmuebles = firebase.db
                .collection("Inmuebles")
                .where("propietario","==",firebase.auth.currentUser.uid)
                .orderBy("direccion")
                .startAfter(casaInicial)
                .limit(paginaSize);

            if(texto.trim() !== ""){//si se realiza una busqueda
                inmuebles = firebase.db
                    .collection("Inmuebles")
                    .where("propietario","==",firebase.auth.currentUser.uid)
                    .orderBy("direccion")
                    .where("keywords", "array-contains", texto.toLowerCase())
                    .startAfter(casaInicial)
                    .limit(paginaSize);
            }

        }

        const snapshot = await inmuebles.get(); // se ejecuta caulquera de los 3 querys

            //bucle apara extraer la data
            //la data del inmueble no viene el id de cada inmueble x eso  creo este nuevo arreglo para extraer los datos y el id 
        const arrayInmuebles = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {id, ...data}//me retorna el id y la data
        })

        const inicialValor = snapshot.docs[0];//el primer inmueble
        const finalValor = snapshot.docs[snapshot.docs.length -1];//el ultimo inmueble
        //creamos un objeto para retornar 
        const returnValue = {
            arrayInmuebles,
            inicialValor,
            finalValor
        }

        resolve(returnValue);
    })
    
}

export const obtenerDataAnterior = (firebase, paginaSize, casaInicial, texto) => {
    return new Promise(async (resolve, eject)=> {
        let inmuebles = firebase.db
            .collection("Inmuebles")
            .where("propietario","==",firebase.auth.currentUser.uid)
            .orderBy("direccion")
            .limit(paginaSize);

        if(casaInicial !== null){
            inmuebles = firebase.db
                .collection("Inmuebles")
                .where("propietario","==",firebase.auth.currentUser.uid)
                .orderBy("direccion")
                .startAt(casaInicial)
                .limit(paginaSize);

            if(texto.trim() !== ""){
                inmuebles = firebase.db
                    .collection("Inmuebles")
                    .where("propietario","==",firebase.auth.currentUser.uid)
                    .orderBy("direccion")
                    .where("keywords", "array-contains", texto.toLowerCase())
                    .startAt(casaInicial)
                    .limit(paginaSize);
            }

        }

        const snapshot = await inmuebles.get();

        const arrayInmuebles = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return {id, ...data}
        })

        const inicialValor = snapshot.docs[0];
        const finalValor = snapshot.docs[snapshot.docs.length -1];

        const returnValue = {
            arrayInmuebles,
            inicialValor,
            finalValor
        }

        resolve(returnValue);
    })
    
}

