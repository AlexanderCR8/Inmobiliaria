
//metodo para crear un alias al inmueble para realizar la busqueda por palabra clave
//es decir al escribir x ejemplo (Al)   va a busacr todos los nomrbes que comienzen por Al
export const crearKeyword = text => {
    const arregloKeywords = [];
    const arregloPalabras = text.match(/("[^"]+"|[^"\s]+)/g); //separar palabras por espacios en blanco
  
    arregloPalabras.forEach(palabra => {
      let palabraResumida = "";
      palabra.split("").forEach(letra => {
        palabraResumida += letra;
        arregloKeywords.push(palabraResumida.toLowerCase());
      });
    });
  
    let letraResumida = "";
    text.split("").forEach(letra => {
      letraResumida += letra;
      arregloKeywords.push(letraResumida);
    });
  
    return arregloKeywords;
  };
  