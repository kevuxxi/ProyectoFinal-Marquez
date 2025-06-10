let contenedorimc = document.getElementById("container");
let entradapeso = document.getElementById("peso-input");
let entradaaaltura = document.getElementById("altura-input");
let botoncalcular = document.getElementById("calcular-boton");
let valorimc = document.getElementById("imc-valor-display");
let clasificacionimc = document.getElementById("imc-clasificacion-display");
let botonreiniciar = document.getElementById("reiniciar-boton");

let categoriasimc = [];

/**
 Carga las categorías de IMC desde un archivo JSON externo.
 Esta función es asíncrona porque utiliza 'fetch' para obtener datos.
 */

async function cargarcategoria() {

    try {
        let resp = await fetch('./data/categorias_imc.json');
        let data = await resp.json();
        categoriasimc = data;

    } catch {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'ocurrio un error, no se puede cargar',
            footer: '<a href="#">porque ocurre este error??</a>'
        });
        return;
    }

}


/**Calcula el Índice de Masa Corporal (IMC) y actualiza la interfaz de usuario
 con el valor y su clasificación, además de guardar los datos en localStorage.
 */

function calcularimc() {
    const peso = parseFloat(entradapeso.value);
    const altura = parseFloat(entradaaaltura.value);

    if (isNaN(peso) || isNaN(altura)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'ingrese un valor numerico',
            footer: '<a href="#">porque ocurre este error??</a>'
        });
        return;

    }

    if (peso <= 0 || altura <= 0) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: 'ingrese un valor valido',
            footer: '<a href="#">porque ocurre este error??</a>'
        });
        return;
    }


    let imc = peso / (altura * altura);
    let imcformateado = imc.toFixed(1);



    let clasificacionencontrada = 'desconocida';
    let colorencontrado = 'black';


    for (const categoria of categoriasimc) {
        if (imc >= categoria.minimo && imc <= categoria.maximo) {
            clasificacionencontrada = categoria.nombre;
            if (categoria.color) {
                colorencontrado = categoria.color;
            }
            break;
        }
    }



    valorimc.textContent = `Tu IMC: ${imcformateado}`;
    clasificacionimc.textContent = `Clasificación: ${clasificacionencontrada}`;
    clasificacionimc.style.color = colorencontrado;

    localStorage.setItem('ultimoPesoIMC', peso);
    localStorage.setItem('ultimaAlturaIMC', altura);
}

// Cuando el botón 'Calcular IMC' es clicado, se ejecuta la función 'calcularimc'.
botoncalcular.addEventListener('click', () => {

    calcularimc();


})

/** Restablece los campos de entrada y los resultados mostrados a sus valores iniciales,
      además de limpiar los datos guardados en localStorage.
     */
function reiniciarCalculadora() {
    entradapeso.value = '';
    entradaaaltura.value = '';
    valorimc.textContent = 'Tu IMC: --';
    clasificacionimc.textContent = 'Clasificación: --';
    clasificacionimc.style.color = 'white';

    localStorage.removeItem('ultimoPesoIMC');
    localStorage.removeItem('ultimaAlturaIMC')
}


// Cuando el botón 'Reiniciar' es clicado, se ejecuta la función 'reiniciarCalculadora'.
botonreiniciar.addEventListener('click', () => {
    reiniciarCalculadora();

})


/** Función de inicialización que se ejecuta al cargar la página.
  Carga las categorías de IMC y precarga los datos del usuario si existen.
 */

async function iniciar() {
    await cargarcategoria();
    let ultimopeso = localStorage.getItem('ultimoPesoIMC');
    let ultimaaltura = localStorage.getItem('ultimaAlturaIMC');
    if (ultimopeso && ultimaaltura) {
        entradapeso.value = parseFloat(ultimopeso);
        entradaaaltura.value = parseFloat(ultimaaltura);

    }

    // Llama a calcularimc() al iniciar. Esto mostrará el IMC si los datos se precargaron
    calcularimc();
}

// Llama a la función 'iniciar' para poner en marcha la calculadora cuando el script se carga.
iniciar();















