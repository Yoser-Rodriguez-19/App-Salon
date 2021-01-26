// creamos una variable global para que este disponible en todas las funciones
let pagina = 1;


// creamos la constante para las citas y empezar a hacer validaciones

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: [] // este es un arreglo por que son varios servicios
}
// creamos estas variables de forma gloval para usarlas en todas las funciones


// esto es para escuchar a todo el DOM
// para no cargar esto se puede mandar a llamar funciones por medio de otras funciones que esten enlazadas
document.addEventListener('DOMContentLoaded', function() {
    iniciarApp(); // declaramos la funcion
    
});

// especificamos la funcion 
function iniciarApp() {
    mosntrarServicios();
    // resalta el div actual segun el tab al que se preciona
    mostrarSeccion();
    // Oculta o muestra una seccion segun el tag al que se preciona
    cambiarSeccion(); // llamamos la funcion
    // llamando la funcion de "paginacion" --siguiente y anterior--
    paginaSiguiente();
    paginaAnterior();
    //comprueba la pagina actual para ocultar o mostrar la paginacion
    // definimos una funcion para que navege solamente de la pagina 1 a la 3 si pasarse
    botonesPaginador();
    // Muestra el resumen de la cita (o mensaje de error en caso de no pasar la validacion )
    mostrarResumen();
    // Almacena el nombre de la cita en el objeto
    nombreCita();
    // almacena la fecha de la cita en el objeto
    fechaCita();
    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    // validar horas
    // almacena la hora de la cita en el objeto
    horaCita();
}

// resalta el div actual segun el tab al que se preciona

function mostrarSeccion() {

    //-------eliminar mostrar-seccion de la seccion anterior-------
    // en resumen, a entrar a la app muestra la primera seccion que esta definida arriba, luego para cambiar de seccion al dar click en otra seccion, busca la seccion anterior y le remueve la clase y se la adiciona a la seccion donde le estas dando click, qeu esta definida en lo siguiente
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) { // si existe la seccionAnterior entonces quitale la clase
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');
    
    const tabAnterior =  document.querySelector('.tabs .actual');
    if( tabAnterior ) {
        tabAnterior.classList.remove('actual'); // si existe el tabAnterior entonces elimina la clase "actual"
    }

    //----- Eliminar la clase de "actual" en el tab anterior
   


    // ----RESALTAR EL TABS ACTUAL----
    const tab = document.querySelector(`[data-paso="${pagina}"]`) // seleccionar el boton donde se esta haciendo click con el atributo, se usa corchete por que es un atributo que se le esta dando no un ID
    tab.classList.add('actual'); // le agregamos la clase para darle estilos en _tabs.scss
}

// Oculta o muestra una seccion segun el tag al que se preciona

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    // tenemos que agregarle un addeventlistener pero eso es sobre un elemento, y tenemos 3 elementos.
    // entonces tenemos que recorrer cada uno de los elementos primero y luego aplicarle a cada elemento
    enlaces.forEach( (enlace) => {
        enlace.addEventListener('click', (e) => { // recorremos cada elemento y le agregamos un addeventlistener que va a funcionar a travez de un click al evento que queremos escuchar
            e.preventDefault(); //Cancela el evento si este es cancelable, sin detener el resto del funcionamiento del evento, es decir, puede ser llamado de nuevo.
       
            // se le coloca pagina por que asi se llama la variable  let que definimos
            pagina = parseInt(e.target.dataset.paso);  // esto es para el numero que sale como un string pasarlo a numero ya que la variable let que definimos es un numero
            // console.log(e.target.dataset.paso); // paso es por que asi se nombro el boton en el index 
            
            // llamar la funcion de "mostrarSeccion" en los tabs para que haga la misma funcion cuando se precione cada tabs

            mostrarSeccion();


            // tenemos que llamar aqui tambien a "botonesPaginador" debido a que cuando se cambia la pagina por los tab los bonotes no funcionan como deberian
            botonesPaginador();
        })
    })
}

// consultar base de datos
// untilizamos "try catch" debido a que es una buena parte para utilizarlo  por que es una consulta a una base de datos en donde puede fallar el servidor
// ya que se utiliza cuando haya una parte critica en la app por si falla esa parte  el resto de la app sigue funcionando
// solo la parte donde cause el error no funciona pero el resto si.
// primero hacemos esta funcion asincrona para usar el "fetch api" para que sea mas corto por que tambien se puede con promises
async function mosntrarServicios() {
    try {                        //fetch es una api que te permite indagar y buscar cualquier documento en tu proyecto y mostrarlo en consola, es como que llamar cualquier informacion que quieras llamar
        const resultado = await fetch('./servicios.json'); // fetch es parte de JS no se necesita importar nada
        
        const db = await resultado.json();

        // const servicios = db.servicios; // db es el resultado pero arroja un elemento llamado servicios (servicios.json) que contiene los servicios, entonces colocamos db.servicios para acceder a cada uno de los servicios 
       
        const {servicios} = db; // esta es una manera mas corta y es desectrctuirando y asignandolo de una vez en una variable, se extrae ese elemento de DB y se asigna la variable al tiempo
       
        //---GENERAR EL HTML----
        // foreach es para ir interanto entre cada uno de ellos. donde va iterando cada elemento en la variable de "servicio"
        servicios.forEach( (servicio) => { // asi accedemos a cada uno de ellos y se llamarian servicio
            const { id, nombre, precio } = servicio; // extraemos de cada servicio el id, nombre, precio y todo se lo asignamos a la variable de "servicio"
            
            //recuerda que gracias al foreach estamos recorriendo TODOS los elementos
            //DOM SCRIPTING
            // vamos a sacar el servicios.json y lo vamos a mostrar en pantalla (HTML) con JS
            //---- Generar nombre de servicio
            const nombreServicio = document.createElement('P'); //creamos el primer elemento que es un parrafo
            nombreServicio.textContent = nombre;  // le añadimos al parrafo el nombre de el servicio   
            nombreServicio.classList.add('nombre-servicio');

            //--- Generar precio de el servicio

            const precioServicio = document.createElement('P'); // creamos el elemento que en este caso es un P
            precioServicio.textContent = `$ ${precio}`; // debido a que en el diseño tiene un signo de dolar
            precioServicio.classList.add('precio-servicio');

            //--- Generar DIV contenedor de CADA servicio

            const servicioDiv = document.createElement('DIV'); // creamos el elemento que es un div en este caso
            servicioDiv.classList.add('servicio'); // le damos una clase para darle estilos
            servicioDiv.dataset.idServicio = id; // le estamos agregando tambien qel id que estamos extrayendo a cada servicio

            // --- Selecciona un servicio para la cita

            servicioDiv.onclick = seleccionarServicio;


            //-- Inyectar precio y nombre al div de servicio

            servicioDiv.appendChild(nombreServicio);   //appenChild es para agregarle un hijo a este div
            servicioDiv.appendChild(precioServicio); 


            // -- Inyectarlo en el HTML
            // selecciono el ID ya definido en el html y el servicioDiv se le agrega como hijo a todo ese ID que esta definido para que se muestre en pantalla
            document.querySelector('#servicios').appendChild(servicioDiv);

            // console.log(servicioDiv)

            // TODO ESTO SE ESTA GENERANDO A CADA SERVICIO DEVIDO AL FOREACH de manera como un ciclo
        } );
    
    } catch (error) {
        console.log(error);
    }
}


// creamos la funcion de SELECCIONAR SERVICIOS seleccionarServicios que estamos definiendo arriba

function seleccionarServicio(e) {
    // console.log(e.target.tagName); // esto es para saber a que le estamos dando click en consola

    let elemento;

    // FORZAR QUE E ELEMENTO AL CUAL LE DAMOS CLICK SEA EL DIV

    if(e.target.tagName === 'P' ) {

        // console.log(e.target.parentElement); // esto lo que hace es mandar a la consola el div completo con el id definido
        elemento = e.target.parentElement; // si doy click en el parrafo entonces forza a JS para que vaya hacia el padre que seria el div y ese ya contiene el ID


    } else {
        elemento = e.target; // pero si doy click en el div no es necesario ir a elemento padre por que ya contiene el id
    }
    // en ambos casos te lleva al id

    // console.log(elemento.dataset.idServicio); // aqui vemos que donde uno haga click te lleva al id


    // -----para seleccionar y deseleccionar cada servicio-----
    // el contains es para saber si un elemento contiene una clase por ejemplo
    // si el div tiene la clase seleccionada al dar click se le quita, si no la tiene seleccionada al darle click se le coloca
    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        //vamos a eliminar el servicio completo

        // console.log(elemento.dataset.idServicio) // si te fijas.. al desemarcar el elemento"servicio" te arroja el id entonces esto nos sirve para eliminarlo por el id
        const id = parseInt( elemento.dataset.idServicio );


        eliminarServicio(id); 
    } else {
        elemento.classList.add('seleccionado');
        
        // console.log(elemento.dataset.idServicio); // esto es para conocer cual es el id de "elemento"
        // console.log(elemento.firstElementChild.textContent); // para seleccionar el primero hijo de ese elemento y leer lo que esta adentro que es el nombre
        // console.log(elemento.firstElementChild.nextElementSibling.textContent); // para seleccionar el siguiente elemento que esten en el mismo nivel y en este caso poder leer el precio
        
        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio ), // para cambiarlo de string a numero
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        // console.log(servicioObj)


        agregarServicio(servicioObj);
        // pero aqui no sale servicios entonces vamos a la funcion de agergarServicio
    }

};
//funcion para alimnar servicio (iria como enlazado a el resumen) // le agregamos el id que definimos en las const = id 
function eliminarServicio(id) {
    // console.log('eliminando...', id)

    const { servicios } = cita // extraemos los servicios de la "cita"
    // filter es filtrar cada servicio y se le asigna a el servicio nuevo que estamos definiendo con filter, el filter itera en cada servicio y vamos a decirle que nos traiga todos los servicios cuyos id sean diferentes al que estoy eliminando
    cita.servicios = servicios.filter( servicio => servicio.id !== id );

    console.log(cita)

}
//funcion para agregar servicio (iria como enlazado a el resumen)
function agregarServicio(servicioObj) {
    const { servicios } = cita;
    // esto es para agregarle los servicios de la cita que ya definimos como constante en un objeto, y lo agregamos al servicioObj
    cita.servicios = [...servicios, servicioObj] // esa sintaxis de 3 puntos es copiar ese objeto o arreglo de servicios y luego dice que le agregue e "servicioObj"

    console.log(cita)

}
//-----------------importante--------
// estas 2 ultimas funciones de eliminar y agregar serivios terminan en conclucion que cuando aprieto un servicio lo agrega completo, si apreto 2 agrega los 2, si apreto 3 los agrega los 3 PEEEEERO al desmarcara uno lo elimina y se trae los otros 2 diferentes que siguen quedando
//-----------------------






//---------definiendo las funciones de "paginacion" ----------------

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => { // le agregamos el evento al hacer click, que es que aumente el valor de la variable "let pagina = 1" mas 1 y asi cambia a 2
        pagina++;

 

        botonesPaginador(); // esto se hace para que cuando cambie el valor de la pagina, que vuelva a comprobar los botones del paginador.. cada vez que se incremente
    }) 
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => { // le agregamos el evento al hacer click, que es que decremente el valor de la variable "let pagina" menos 1 y asi si esta en 2 o 3 disminulle al numero anterior
        pagina--;


        botonesPaginador();
    }) 
}


//comprueba la pagina actual para ocultar o mostrar la paginacion
// definimos una funcion para que navege solamente de la pagina 1 a la 3 si pasarse

function botonesPaginador() {
    // seleccionamos los 2 botones
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar'); // si la pagina es 1 entonces no mostrar e boton "anterior" con una clase llamada ocultar    

        
        
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar'); // si estamos en la pagina 3 entonces el boton de siguiente de paginaSiguiente hay que ocultarlo
        paginaAnterior.classList.remove('ocultar');

        // estamos en la pagina 3, carga el resumen de la cita.
        mostrarResumen(); // hay que volverla a llamar en esta pagina debido a que aqui es donde se muestra el resumen..

    } else  { // esto es en caso contrario, si no esta en la 1 ni en la 3 es por que esta en la 2
        paginaAnterior.classList.remove('ocultar'); // si estamos en la pagina 2, el boton de pagina anterior tiene que volver asi que le quitamos la clase
        paginaSiguiente.classList.remove('ocultar'); // si estamos en la pagina 2, el boton de paginaSiguiente tienen que mostrarse tambien cuando vuelvan de la pagina 3 a la 2
    } 
    // esto cambia los botones depende de la pagina pero no la seccion.. entonces llamaremos aqui la funcion de "mostrarSeccion" que esta arriba

    mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
    // pero ahora se agrega, pero no se quita la seccion anterior
}





// definimos la funcion de mostrarResumen

function mostrarResumen() {
    
    // Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen

    const resumenDiv = document.querySelector('.contenido-resumen'); // seleccionamos el resumen con la clase que se le dio en el index


    // limpia el HTML de la pagina 3 previo
    // mientras esta condicion se cumpla osea mientras contenido-resumen tenga HTML se cumplira este while se estara ejecutando
    while ( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }


    console.log('Mostrar Resumen')
    // validacion de objeto
    // aqui veo los valores de el objeto "cita"
    if(Object.values(cita).includes('')) { // esto es para ver valor por valor, y si uno esta vacio entonces hacer lo siguiente
        const noServicios = document.createElement('P')
        noServicios.textContent = 'Faltan datos de Servicios, Hora, Fecha o Nombre';


        noServicios.classList.add('invalidar-cita'); // le damos estilos en _resumen.scss

        console.log('mostrar if')
        // agregar a resumenDiv que definimos la constante arriba, le agregamos un hijo
        resumenDiv.appendChild(noServicios);
        // pero no le estamos pasando los valores del objeto que se escribe en la app web. solamente le estamos pasando que no tiene nada y muestre el error.
        return; //para que al ejecutarse este codigo no se ejecute lo siguiente codigo de la funcion
    }

    //------------MOSTRAR EL RESUMEN-----------------
    const headingCita = document.createElement('H3'); //creamos un texto
    headingCita.textContent ='Resumen de Cita';

    const nombreCita = document.createElement('P');
    // nombreCita.textContent = `<span>Nombre:</span> ${nombre}`; // esto agrega el span como un texto
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`; // esto si trata las etiquetas html como codigo html

    
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    // --- iterar sobre el arreglo de servicios (reflejar los servicios en pantalla)

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3'); //creamos un texto
    headingServicios.textContent ='Resumen de servicios';

    serviciosCita.appendChild(headingServicios); // se lo agregamos al serviciosCita para que se mustre en pantalla

    //creamos esta constante para agregarle un hijo  de contenedorServicios que esta definido abajo

    let cantidad = 0; // aqui definimos esta variable para la sumatoria de el total la cual empieza en 0

    servicios.forEach( (servicio) => { // usamos el forEach para ir recorriendo cada uno de los servicios y asignarlos por individual a servicio
        
        const { nombre, precio } = servicio // extraemos los valores de el servicio
        
        const contenedorServicio = document.createElement('DIV'); // entonces se crea un div para cada servicio

        contenedorServicio.classList.add('contenedor-servicio'); // le agregamos una clase para darle estilos

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre; // para mostrar el nombre de el servicio
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');


        //definiendo para quitarle el signo de el dolar al precio y asi poder empezar a hacer la funcion para el total
        const totalServicio = precio.split('$'); // esto separa el signo de el dolar con el precio
        // console.log(parseInt(totalServicio[1].trim())); // el trim es para eliminar espacios en blanco, el parseInt es para volverlo numero y que pueda sumar

        cantidad += parseInt(totalServicio[1].trim());


        // console.log(textoServicio)
        // console.log(precioServicio)

        // COLOCAR TEXTO Y PRECIO EN EL DIV

        contenedorServicio.appendChild(textoServicio); // se los agregamos como hijos a contenedorServicio
        contenedorServicio.appendChild(precioServicio); // se los agregamos como hijos a contenedorServicio


        serviciosCita.appendChild(contenedorServicio); // servicioCita se definio fuera de la funcion para poder agregarselo al resumenDiv que esta por fuera de esta funcion tambien
        // ahora ese contenedorServicio tenemos que agregarlo a un elemento ya existente en el HTML para que se muestre
        // creamos una variable que este por fuera de los servicios
    } );

    // console.log(cantidad)
    
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> $ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}


function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    // ese evento de input es para escuchar todas las veces que se esta escribiendo en un input
    nombreInput.addEventListener('input', (e) => {

        const nombreTexto = e.target.value.trim(); // el trim elimina que el espacio al inicio y al final para que no coloquen solo espacios

        // validacion de que nombreTexto debe tener contenido

        if ( nombreTexto === '' || nombreTexto.length < 3 ) { // recuerda que length es para saber la extencion de una cadena de texto
            mostrarAlerta('nombre no vaido', 'error')
        }else {
            // para eliminar la alerta en caso que este bien el nombre, perimero se selecciona y luego se dice que si existe una alerta entonces eliminala
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }

            // en caso que sea un objeto valido
            cita.nombre = nombreTexto

            console.log(cita)
        }


        // console.log(e.target.value) // saber lo que el usuario esta escribiendo
    })
}


// creamos una funcion para mostrar una alerta cuando el input no es valido
// la alerta va a tomar un mensaje
function mostrarAlerta(mensaje, tipo){
    // console.log('el mensaje es', mensaje)

    // si hay una alerta previa, entonces no crear otra (esto es para que no se repitan las alertas)
    const alertaPrevia = document.querySelector('.alerta')
    if ( alertaPrevia ) {
        return;  // si existe una alertaPrevia entonces deten la ejecucion de el codigo con el return
    }


    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    // console.log(alerta);

    //creamos una const alerta y le creamos un div, le decimos que la alerta sera un mensaje, y le agregamos una clase de alerta, pero si es un error le agregamos la clase de error y es para darle estilos
    // le damos estilos en _formulario.scss

    // insertar en el HTML en donde esta la clase de "formulario"

    const formulario = document.querySelector('.formulario'); // seleccionamos la clase
    formulario.appendChild( alerta ); // le agregamos hijo de alerta que se esta creandoa ese formulario
    // pero aparece en pantalla repedidas veces



    //---- eliminar alerta despues de 3sg
    setTimeout(() => {
        alerta.remove();    
    }, 3000);

}



// vamos con la FECHA

function fechaCita() {
    const fechaInput = document.querySelector('#fecha'); // seleccionamos la fecha con el id de fecha establecido en el index
    fechaInput.addEventListener('input', (e)=>{  // input es para escuchar cada inf. que ocura en el campo input
        // console.log(e.target.value) // acceder al valor exacto de el evento de la fechaInput
        // pero lo arroja como un estring entonces lo tenemos que cambiar:
        //"getUTCDay" lo que hace es retornarnos los dias en numeros de el 0 al 6 donde 0 es domingo
        const dia = new Date(e.target.value).getUTCDay(); // esto ya nos va a permitir tener acceso a las funciones de fecha

        if ([0, 6].includes(dia)) { // si selecciona un domingo o sabado de la const dia entonces no es valido
            // console.log('seleccionaste domingo lo cual no es valido')
            e.preventDefault(); // esto es para prevenir la accion que se esta haciendo, por que si no, se muestra como error pero no se elimina la fecha
            fechaInput.value = '', // esto es para digamos que resetear el valor a nada
            mostrarAlerta('Fines de Semana no son permitidos', 'error'); // se le pasa el segundo parametro para decirle que es de tipo error
        }else { // de lo contrario si es valido
            // console.log('dia valido')

            cita.fecha = fechaInput.value;  // si es valido entonces esto para que se agregue. 
            console.log(cita)
        }



        // -.-----esto a continuacion es para que nos de solo los valores que queremos-------
        // y "toLocaleDateString" es para cambiar a español cada una de las opciones que estoy definiendo de la fecha
        // const opciones = {
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // }

        // console.log(dia.toLocaleDateString('es-ES', opciones))
    })    
}

// creando la funcion para que no se muestren dias pasados en la fecha

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date(); // esto hace que veas la fecha actual
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1; // se le suma uno por que en los meses en JS va de 0 a 11
    const dia = fechaAhora.getDate() + 1; // para que el cliente no pueda agendar cita para el mismo dia, si no que a partir de el dia siguiente

    // Formato deseado: AAAA-MM-DD

    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia}`;
    // el año, el mes de ser menor a 10 muestrame el mes como 01,02,02,04.... si es mayor o igual que 10 entonces muestrame solo el mes que seria 10, 11, 12

    inputFecha.min = fechaDeshabilitar;  // el min es para que ese sea el valor minimo que se puede mostrar

    // console.log(fechaDeshabilitar); // ver la fecha
    // console.log(fechaAhora.getUTCFullYear()); // ver el año actual
    // console.log(fechaAhora.getDate());  // ver dia en nombre
    // console.log(fechaAhora.getDay());  // para ver el dia en numero del 0 al 6 donde 0 es domingo
    // console.log(fechaAhora.getMonth()); // ver mes.. donde el mes 0 es enero
}


// definiendo la funcion de horaCita
function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', (e)=> { // le pasamos el evento
        console.log(e.target.value)

        const horaCita = e.target.value
        const hora = horaCita.split(':') // split me va a permitir que va a evauar el estring y podemos buscar una letra o un espacio y cuando a encuetre la va a dividir.. por ejemplo si se le coloca ":" cuando lo encuentre ahi es donde la divide en un arreglo donde el primer valor toma la posicion de creo y la segunda posicion toma el valor de 1
        
        if ( hora[0] < 10 || hora[0] > 18 ) {

            mostrarAlerta('Hora no valida', 'error');

            setTimeout(() => { // para que se vea mejor
                
                inputHora.value= '';  // para que al no ser valido se reinicie el valor a un string vacio
                
            }, 1000);
            // console.log('hora no valida');

        } else {

            cita.hora = horaCita;
            // console.log('hora valida')
        }
        
        
        // console.log(hora)
    })
}