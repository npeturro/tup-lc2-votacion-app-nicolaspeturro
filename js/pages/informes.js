let data;
let datos;
let distritoID;

(async () => {
    
    //Verificar si hay datos en el localStorage
    if (localStorage.getItem('INFORMES') !== null) {
        
        // Obtener el array almacenado en el localStorage
        const informes = JSON.parse(localStorage.getItem('INFORMES'));
        
        // Recorrer el array
        informes.forEach(async (datos) => {
        // Separar los datos (suponiendo que son una cadena y necesitan ser divididos)
        //const informesSeparados = datos.split(',');

        // Construir la URL con los datos separados
        const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datos[0]}&tipoRecuento=${datos[1]}&tipoEleccion=${datos[2]}&categoriaId=${datos[3]}&distritoId=${datos[4]}&seccionProvincialId=${datos[5]}&seccionId=${datos[6]}&circuitoId=${datos[7]}&mesaId=${datos[8]}`;

        try {
            // Realizar la consulta a la API
            const response = await fetch(fetchUrl);

            if (response.ok) {
                data = await response.json();
                console.log(data);
                console.log(datos);
                
                distritoID = datos[4];
                mesasEscrutadas = datos[9]
                electores = datos[10]
                participacion = datos[11]
                console.log(distritoID)
                const opcion = document.getElementById("titulo-informe");
                /*datos.forEach((informacion) => {
                  let datosEleccion = `<p class="texto-elecciones-chico" id=""><b>Elecciones ${informacion[0]} | ${informacion[15]}</b></p>
                  <p class="texto-path-chico" id="subtitulo-informe">${informacion[0]} > ${informacion[15]} > ${informacion[14]} > ${informacion[13]}
                      </p>`
                  opcion.innerHTML += datosEleccion;
                });*/

                mostrarProvincia()
                //mostrarDatos()

            } else {
                console.error('Error en la solicitud a la API');
            }

        } catch (error) {
            console.error('Error en la solicitud: ' + error);
        }
    });

} else {
    console.log('No hay datos en el localStorage');
}

})();



function mostrarProvincia(){
    
    let mapa_principal = document.getElementById("provincia-informe");
    //let idMapas = datos[3];
    //console.log(idMapas)
    //ver si se puede cambiar la forma en la qe trae el nombre
    mapa_principal.innerHTML = `${provincias[distritoID]}`;
}
function mostrarEleccion(){
    let titulo = document.getElementById("titulo-informe");
    let subtitulo = document.getElementById("subtitulo-informe");
    titulo.innerHTML = `Elecciones ${datosCompletos.anioEleccion} | Generales`;
    subtitulo.innerHTML = `${datosCompletos.anioEleccion} > ${cargoSeleccionado.options[cargoSeleccionado.selectedIndex].text} > ${distritoSeleccionado.options[distritoSeleccionado.selectedIndex].text} > ${seccionSeleccionada.options[seccionSeleccionada.selectedIndex].text}`;
}
function mostrarDatos(){
    let mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
    let electores = data.estadoRecuento.cantidadElectores;
    let participacion = data.estadoRecuento.participacionPorcentaje;

    const m_escrutadas = document.getElementById("escrutadas-informe");
    m_escrutadas.innerHTML = `Mesas Escrutadas<br>${mesasEscrutadas}`;
    const m_electores = document.getElementById("electores-informe");
    m_electores.innerHTML = `Electores<br>${electores}`;
    const m_participacion = document.getElementById("participacion-informe");
    m_participacion.innerHTML = `Participación sobre escrutados<br>${participacion}%`;
}
function mostrarAgrupacion(){

}












function cartelRojo(){
    const mensajeError = document.getElementById("mensaje-error");
    mensajeError.style.display = "flex";
    setTimeout(cartelRojo_sacar,3000)
  }
  function cartelVerde(){
    const mensajeError = document.getElementById("mensaje-exito");
    mensajeError.style.display = "flex";
    setTimeout(cartelVerde_sacar,3000)
  }
  function cartelAmarillo(){
    const mensajeError = document.getElementById("mensaje-no-completo");
    mensajeError.style.display = "flex";
    mensajeError.innerHTML = "No se encuentran valores que mostrar"
    setTimeout(cartelAmarillo_sacar,5000)
  }
  function cartelRojo_sacar(){
    const mensajeError = document.getElementById("mensaje-error");
    mensajeError.style.display = "none";
  }
  function cartelVerde_sacar(){
    const mensajeError = document.getElementById("mensaje-exito");
    mensajeError.style.display = "none";
  }
  function cartelAmarillo_sacar(){
    const mensajeError = document.getElementById("mensaje-no-completo");
    mensajeError.style.display = "none";
  }