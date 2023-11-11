(async () => {
    
    //Verificar si hay datos en el localStorage
    if (localStorage.getItem('INFORMES') !== null) {
        
        // Obtener el array almacenado en el localStorage
        const informes = JSON.parse(localStorage.getItem('INFORMES'));
        
        // Recorrer el array
        informes.forEach(async (datos) => {
        // Separar los datos (suponiendo que son una cadena y necesitan ser divididos)
        const informesSeparados = datos.split(',');

        // Construir la URL con los datos separados
        const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${informesSeparados[0]}&tipoRecuento=${informesSeparados[1]}&tipoEleccion=${informesSeparados[2]}&categoriaId=${informesSeparados[3]}&distritoId=${informesSeparados[4]}&seccionProvincialId=${informesSeparados[5]}&seccionId=${informesSeparados[6]}&circuitoId=${informesSeparados[7]}&mesaId=${informesSeparados[8]}`;

        try {
            // Realizar la consulta a la API
            const response = await fetch(fetchUrl);

            if (response.ok) {
                const data = await response.json();
                console.log(data);

                


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