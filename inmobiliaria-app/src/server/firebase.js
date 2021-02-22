
import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
import 'firebase/storage'
const config = {
  apiKey: "AIzaSyC2vktw0esGWi6BHCJGepmcMhMCpXoyCN8",
  authDomain: "inmueblesreact01.firebaseapp.com",
  databaseURL: "https://inmueblesreact01-default-rtdb.firebaseio.com",
  projectId: "inmueblesreact01",
  storageBucket: "inmueblesreact01.appspot.com",
  messagingSenderId: "737714457394",
  appId: "1:737714457394:web:fa78691cba2d856b47e52b",
  measurementId: "G-JGZCL102MR"
} 
class Firebase {
    constructor(){
        app.initializeApp(config);
        this.db=app.firestore(); //funcionalidad para usar firestore
        this.auth= app.auth(); //funcionalidad para usar la atuentificacion
        this.storage=app.storage();// funcionalidad para guardar fotos
        this.authorization=app.auth;

        //le esta sobreescribiendo al metodo storage 
        //funcionalidad para guardar multiples fotos 
        this.storage.ref().constructor.prototype.guardarDocumentos= function(documentos, idUser){
          let ref=this;
          return Promise.all(documentos.map(function(file){
            //cuando guarde el arrglo de  documentos en storage, luego retorne una arreglo de urls
            //se guardara en el storague en la carpeta inmuebles/idusuario/[nombre fotos]
            return ref.child("inmuebles/"+idUser).child(file.alias).put(file).then(snapshot =>{
              return ref.child("inmuebles/"+idUser).child(file.alias).getDownloadURL(); 
            })
          }))
        }


    

    }

    estaIniciado(){
      return new Promise(resolve =>{
        this.auth.onAuthStateChanged(resolve)
      })
    }
//metodos para guardar y mostrar fotos
    guardarDocumento=(nombreDocumento, documento)=> this.storage.ref().child("imageUsers").child(nombreDocumento).put(documento);
    devolverDocumento=(documentoUrl)=> this.storage.ref().child("imageUsers").child(documentoUrl).getDownloadURL();
    //recibe un arreglo de Fotos
    guardarDocumentos=(documentos, idUser)=> this.storage.ref().guardarDocumentos(documentos,idUser);

    //metodo pata eliminar un documento 
    //eliminarDocumento de la carpeta del usuario 
    eliminarDocumento = (documento, idUser) => this.storage.ref().child("inmuebles/"+idUser).child(documento).delete();

//
}

export default Firebase;