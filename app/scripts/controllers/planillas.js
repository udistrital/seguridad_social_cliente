'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:PlanillasCtrl
* @description
* # PlanillasCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('PlanillasCtrl', function (seguridadSocialCrudService, seguridadSocialService) {
  var self = this;
  var csvContent = '';     //variable para generar el archivo plano
  var descuentos = []     //Tendrá todos los decuentos de desc_seguridad_social
  var descuento = {}      //Tendrá un descuento de desc_seguridad_social

  seguridadSocialCrudService.get('periodo_pago','').then(function(response) {
    descuentos = response.data;
  });

  self.anios = [];
  self.proveedores = [];

  /*  Modifica el arreglo self.anios para tener los años desde 2016 hasta el año actual
  *   con el metodo getFullYear()
  */
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 2016 ; i--) {
      self.anios.push({ anio: i });
    }
  };
  calcularAnios();

  //json para los meses
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

    /* Función para generar el archivo, llamada desde el ng-click de la vista
    */
    self.genearArchivo = function() {
      if (comprobarPeriodo() && comprobarDescuentos()) {
        console.log('generar Archivo');
        csvContent = "data:text/csv;charset=utf-8,"; //Se inicializa para que no se concatene la información en case de generar varios archivos seguidos
        seguridadSocialService.getServicio('planillas','GenerarPlanillaActivos/'+descuento.Id).then(function(response) {
          crearCabecera(self.mesPeriodo, self.anioPeriodo)
          csvContent += "\n"
          csvContent += response.data;
          var encodedUri = encodeURI(csvContent);
          var link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "PlanillaTipoE.csv");
          link.click();
          console.log('Descargo el archivo');
        });
      }
    }

    function comprobarDescuentos() {
      if (descuentos == null) {
        self.divError = true;
        self.errorMensaje = 'No se encontraron registros de descuentos';
        return false
      } else {
        for (var i = 0; i < descuentos.length; i++) {
          if (descuentos[i].Mes === parseInt(self.mesPeriodo) && descuentos[i].Anio === parseInt(self.anioPeriodo)) {
            self.divError = false;
            descuento = descuentos[i];
            return true
          } else {
            self.divError = true;
            self.errorMensaje = 'El periodo ingresado no tiene información.';
            return false
          }
        }
      }

    };

    /* Función para crear la cabecera del archivo plano
    */
    function crearCabecera(mes,anio) {
      escribirArchivo("0110001",7);
      escribirArchivo("UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS",200);
      escribirArchivo("NI899999230",18);
      escribirArchivo("7E",22);
      escribirArchivo("S01",51);
      escribirArchivo("14-23",6);

      seguridadSocialCrudService.get('periodo_pago','limit=1&query=Mes:'+self.mesPeriodo+',Anio:'+self.anioPeriodo).then(function(response) {
        if (response.data !== null) {
          self.divError = false;
          console.log("Response: " + response.data);
          var anio = self.anioPeriodo;
          var mes = self.mesPeriodo;
          var mes = (mes < 10 ? "0"+mes : ""+mes); //Si el mes es menor de 10, le agrega un 0 al inicio del número ej: 5 -> 05
          var mesSiguiente = parseInt(self.mesPeriodo) + 1;
          var mesSiguiente = (mesSiguiente < 10 ? "0"+mesSiguiente : ""+mesSiguiente);
          escribirArchivo(anio+"-"+mes+""+anio+"-"+mesSiguiente,94);
        } else {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
          console.log('Response es null');
        }
      });
    };

    /* Función para escribir en el archivo, hace una iteración sobre la longitud del texto
    *  comenzado desde i (i = 0), y va comprobando si texto en la posición de i tiene algún valor
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

    /*  Función validar el periodo de la vista
    *   validando que anioPeriodo y mesPeriodo tengan un valor
    */
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

    /*  Función para completar la secuencia de los registros
    *   Completa la secuencia del registro, que debe tener una longitud de 5
    *   y debe guardarse de forma en que se complete el tamaño con 0 a la derecha
    *   ej: 9 -> 00009, 123 -> 00123
    *   @Param numero: el número que debe completar
    *   @return secuencia: la secuencia en que debe estar el registro
    */
    function completarSecuencia(numero) {
      var secuencia = '';
      var tamanioNum = numero.toString().length
      for (var i = 0; i < 5 - tamanioNum; i++) {
        secuencia += '0';
      }
      secuencia += numero.toString();
      return secuencia
    };
  });
