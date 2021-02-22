import { createMuiTheme} from '@material-ui/core/styles';
const theme =createMuiTheme({
    typography:{
        useNextVariants:true
    },
    // ver material color en google  para cambiar de colores 
   /*  palette:{
        primary:{
            main:'#10A75F'
        },
        common:{
            white:'white'
        },
        secondary:{
            main:'#FB8358 '
        }
    }, */
    palette: {
        primary: {
          light: '#a7c0cd',
          main: '#78909c',
          dark: '#4b636e',
          contrastText: '#ECFAD8',
        }
    },

    // palette: {
    //     primary: {
    //       light: '#63a4ff',
    //       main: '#1976d2',
    //       dark: '#004ba0',
    //       contrastText: '#bbdefb',
    //     }
    // },
    spacing : 10
});

export default theme