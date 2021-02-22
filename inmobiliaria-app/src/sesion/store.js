import React,{createContext, useContext, useReducer } from 'react'

//estamos creando una variable global con create Context

export const StateContext = createContext();

//el children representa cualquier componente creado
//el initialState es el valor inicial de la variable global
//el reducer es la funcion que pude cambiar esas valores iniciales 
export const StateProvider =({reducer, initialState, children})=>(
    //el provider se usa para poder definir los valores iniciales o las varibales que se van a almacenar de manera global
    <StateContext.Provider value={useReducer(reducer,initialState)}>
        {children}
    </StateContext.Provider>
)
//usecontext para poder acceder al valor global (de sesion y snackbar ) 
export const useStateValue =() => useContext(StateContext);