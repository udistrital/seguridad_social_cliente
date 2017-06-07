'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:PlanillasCtrl
* @description
* # PlanillasCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('PlanillasCtrl', function (seguridadSocialCrudService) {
  var self = this;
  var csvContent = "data:text/csv;charset=utf-8,"; //variable para el archivo plano

  self.anios = [];
  //Crea un arreglo de objetos para tener los años desde 1900 hasta el año actual con el metodo getFullYear()
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 1900 ; i--) {
      self.anios.push({ anio: i });
    }
  };
  calcularAnios();

  //json para los meses
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

  self.genearArchivo = function() {
    console.log('generar Archivo');
    csvContent = "data:text/csv;charset=utf-8,";
    escribirArchivo("0110001",7);
    escribirArchivo("UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS",200);
    escribirArchivo("NI899999230",18);
    escribirArchivo("7E",22);
    escribirArchivo("S01",51);
    escribirArchivo("14-23",6);

    seguridadSocialCrudService.get('desc_seguridad_social','limit=1&query=Mes:'+self.mesPeriodo+',Anio:'+self.anioPeriodo).then(function(response) {
      if (response.data !== null && comprobarPeriodo()) {
        self.divError = false;
        console.log("Response: " + response.data);
        var anio = self.anioPeriodo;
        var mes = self.mesPeriodo;
        var mes = (mes < 10 ? "0"+mes : ""+mes); //Si el mes es menor de 10, le agrega un 0 al inicio del número ej: 5 -> 05
        var mesSiguiente = parseInt(self.mesPeriodo) + 1;
        var mesSiguiente = (mesSiguiente < 10 ? "0"+mesSiguiente : ""+mesSiguiente);
        escribirArchivo(anio+"-"+mes+""+anio+"-"+mesSiguiente,94);

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "PlanillaTipoE.csv");
        link.click();
      } else {
        self.divError = true;
        self.errorMensaje = 'El periodo ingresado no tiene información.';
        console.log('Response es null');
      }

    });

  }

  /* Función para escribir en el archivo, hace una iteración sobre la longitud del texto
  *  comenzado desde i (i = 0), y va comprobando si texto en la posición de i tiene añgún Valor
  *  si tiene algún valor le concatena el caracter correspondiente a la posición,
  *  sino concatena un espacio (" ")
  *  @Parámetro 1 texto: El texto que quiere ingresar
  *  @Parámetro 2 longitud: La longitud que debe ocupar esa información en el archivo
  */
  function escribirArchivo(texto,longitud) {
    for (var i = 0; i < longitud; i++) {
      if(texto[i]) {
        csvContent += texto[i];
      } else {
        csvContent += " ";
      }
    }
  };

  function comprobarPeriodo() {
    if (self.anioPeriodo == null) {
      self.divAlerta = true;
      self.errorAlerta = 'Por favor selecciona un año.';
      return false;
    } else if (self.mesPeriodo == null) {
      self.divAlerta = true;
      self.errorAlerta = 'Por favor selecciona un mes.';
      return false;
    } else {
      self.divAlerta = false;
      return true;
    }
  };
});
