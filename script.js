// Elementos del DOM
const sliderLongitud = document.getElementById('longitud');
const valorLongitud = document.getElementById('valor-longitud');
const checkMayusculas = document.getElementById('mayusculas');
const checkMinusculas = document.getElementById('minusculas');
const checkNumeros = document.getElementById('numeros');
const checkSimbolos = document.getElementById('simbolos');
const btnGenerar = document.getElementById('generar');
const inputContraseña = document.getElementById('contraseña');
const btnCopiar = document.getElementById('copiar');
const securityLevel = document.getElementById('security-level');
const securityText = document.getElementById('security-text');

// Arrays con los caracteres posibles
const letrasMayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Actualizar el valor mostrado al mover el slider
sliderLongitud.addEventListener('input', () => {
    valorLongitud.textContent = sliderLongitud.value;
    if (inputContraseña.value) {
        evaluarSeguridad(inputContraseña.value);
    }
});

// Función para generar una contraseña aleatoria
function generarContraseña() {
    let caracteresPermitidos = '';
    let contraseña = '';
    const longitud = parseInt(sliderLongitud.value);
    
    // Verificar qué tipos de caracteres están permitidos
    if (checkMayusculas.checked) caracteresPermitidos += letrasMayusculas;
    if (checkMinusculas.checked) caracteresPermitidos += letrasMinusculas;
    if (checkNumeros.checked) caracteresPermitidos += numeros;
    if (checkSimbolos.checked) caracteresPermitidos += simbolos;
    
    // Si no se seleccionó ninguna opción, usar todas por defecto
    if (caracteresPermitidos === '') {
        caracteresPermitidos = letrasMayusculas + letrasMinusculas + numeros + simbolos;
        checkMayusculas.checked = true;
        checkMinusculas.checked = true;
        checkNumeros.checked = true;
        checkSimbolos.checked = true;
    }
    
    // Asegurar que la contraseña tiene al menos un carácter de cada tipo seleccionado
    if (checkMayusculas.checked) {
        contraseña += letrasMayusculas.charAt(Math.floor(Math.random() * letrasMayusculas.length));
    }
    
    if (checkMinusculas.checked) {
        contraseña += letrasMinusculas.charAt(Math.floor(Math.random() * letrasMinusculas.length));
    }
    
    if (checkNumeros.checked) {
        contraseña += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    if (checkSimbolos.checked) {
        contraseña += simbolos.charAt(Math.floor(Math.random() * simbolos.length));
    }
    
    // Completar la contraseña hasta la longitud deseada
    while (contraseña.length < longitud) {
        const caracterAleatorio = caracteresPermitidos.charAt(
            Math.floor(Math.random() * caracteresPermitidos.length)
        );
        contraseña += caracterAleatorio;
    }
    
    // Mezclar los caracteres para que no queden agrupados por tipo
    contraseña = mezclarCadena(contraseña).slice(0, longitud);
    
    return contraseña;
}

// Función para mezclar una cadena de texto aleatoriamente
function mezclarCadena(cadena) {
    const array = cadena.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio de posiciones
    }
    return array.join('');
}

// Evaluar la seguridad de la contraseña
function evaluarSeguridad(contraseña) {
    const longitud = contraseña.length;
    const tieneMayusculas = /[A-Z]/.test(contraseña);
    const tieneMinusculas = /[a-z]/.test(contraseña);
    const tieneNumeros = /[0-9]/.test(contraseña);
    const tieneSimbolos = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(contraseña);
    
    let puntuacion = 0;
    
    // Evaluar longitud
    if (longitud > 12) {
        puntuacion += 40;
    } else if (longitud > 8) {
        puntuacion += 30;
    } else if (longitud > 5) {
        puntuacion += 20;
    } else {
        puntuacion += 10;
    }
    
    // Evaluar complejidad
    let complejidad = 0;
    if (tieneMayusculas) complejidad++;
    if (tieneMinusculas) complejidad++;
    if (tieneNumeros) complejidad++;
    if (tieneSimbolos) complejidad++;
    
    puntuacion += complejidad * 15;
    
    // Limitar puntuación máxima a 100
    puntuacion = Math.min(puntuacion, 100);
    
    // Actualizar la barra de seguridad
    securityLevel.style.width = puntuacion + '%';
    
    // Determinar el texto de seguridad basado en la puntuación
    if (puntuacion >= 80) {
        securityText.textContent = 'Seguridad: Alta';
        securityLevel.style.background = 'linear-gradient(90deg, #00cc00, #33ff33)';
    } else if (puntuacion >= 50) {
        securityText.textContent = 'Seguridad: Media';
        securityLevel.style.background = 'linear-gradient(90deg, #ffcc00, #ffff00)';
    } else {
        securityText.textContent = 'Seguridad: Baja';
        securityLevel.style.background = 'linear-gradient(90deg, #ff0000, #ff6666)';
    }
}

// Generar contraseña al hacer clic en el botón
btnGenerar.addEventListener('click', () => {
    const nuevaContraseña = generarContraseña();
    inputContraseña.value = nuevaContraseña;
    evaluarSeguridad(nuevaContraseña);
    
    // Efecto visual al generar la contraseña
    btnGenerar.classList.add('active');
    setTimeout(() => {
        btnGenerar.classList.remove('active');
    }, 200);
    
    // Efecto de glitch para la contraseña
    inputContraseña.classList.add('glitch-effect');
    setTimeout(() => {
        inputContraseña.classList.remove('glitch-effect');
    }, 500);
});

// Copiar la contraseña al portapapeles
btnCopiar.addEventListener('click', () => {
    if (!inputContraseña.value) return;
    
    inputContraseña.select();
    document.execCommand('copy');
    
    // Cambiar temporalmente el texto del botón para indicar que se copió
    const textoOriginal = btnCopiar.textContent;
    btnCopiar.textContent = 'Copiado!';
    
    setTimeout(() => {
        btnCopiar.textContent = textoOriginal;
        // Deseleccionar el texto
        window.getSelection().removeAllRanges();
    }, 1500);
});

// Generar una contraseña inicial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const contraseñaInicial = generarContraseña();
    inputContraseña.value = contraseñaInicial;
    evaluarSeguridad(contraseñaInicial);
});
