'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:PlanillasCtrl
* @description
* # PlanillasCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('PlanillasCtrl', function (seguridadSocialCrudService, seguridadSocialService, titanCrudService) {
  var self = this;
  var csvContent = '';     // variable para generar el archivo plano
  var descuento = {};      // Corresponde a un periodo_pago
  var periodoPago = {};

  self.anios = [];
  self.proveedores = [];

  titanCrudService.get('tipo_nomina', '').then(function(response) {
    self.tiposLiquidacion = response.data;
  });

  /*  Función para validar los datos ingresados en el formulario
  *   validando que anioPeriodo y mesPeriodo tengan un valor
  */
  function comprobarDatosIngresados() {
    var mensaje = '';
    var estado = false;
    var alerta = false;

    if (self.tipoLiquidacion === undefined) {
      alerta = true;
      mensaje = 'Por favor selecciona un tipo de nómina';
    } else if (self.anioPeriodo === undefined) {
      alerta = true;
      mensaje = 'Por favor selecciona un año';
    } else if (self.mesPeriodo === undefined) {
      alerta = true;
      mensaje = 'Por favor selecciona un mes';
    } else {
      estado = true;
    }
    self.divAlerta = alerta;
    self.errorAlerta = mensaje;
    return estado;
  }

  // se encarga de generar el archivo 
  self.buscarPagos = function() {
    self.divError = false;
    if (comprobarDatosIngresados()) {
      seguridadSocialCrudService.get('periodo_pago','query=Mes:'+parseInt(self.mesPeriodo.value)+',Anio:'+parseInt(self.anioPeriodo)+',tipo_liquidacion:'+self.tipoLiquidacion+'&liimit=1').then(function(response) {
        periodoPago = response.data[0];
        if (periodoPago === null) {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
        } else {
          seguridadSocialService.getServicio('planillas','GenerarPlanillaActivos/'+periodoPago.Id).then(function(response) {
            crearCabecera(self.mesPeriodo.value, self.anioPeriodo);
            csvContent += "\n";
            csvContent += response.data;
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "PlanillaTipoE.csv");
            link.click();
          });
        }
      });
    }
  };

  /*  Modifica el arreglo self.anios para tener los años desde 2016 hasta el año actual
  *   con el metodo getFullYear()
  */
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 2016 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  //json para los meses
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

    /* Función para crear la cabecera del archivo plano
    */
    function crearCabecera(mes,anio) {
      escribirArchivo("0110001",7);
      escribirArchivo("UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS",200);
      escribirArchivo("NI899999230",18);
      escribirArchivo("7E",22);
      escribirArchivo("S01",51);
      escribirArchivo("14-23",6);

      seguridadSocialCrudService.get('periodo_pago','limit=1&query=Mes:'+self.mesPeriodo.value+',Anio:'+self.anioPeriodo).then(function(response) {
        if (response.data !== null) {
          self.divError = false;
          var anio = self.anioPeriodo;
          var mes = self.mesPeriodo.value;
          var mesSiguiente = parseInt(self.mesPeriodo.value) + 1;
          mes = (mes < 10 ? "0"+mes : ""+mes); //Si el mes es menor de 10, le agrega un 0 al inicio del número. ej: 5 -> 05
          mesSiguiente = (mesSiguiente < 10 ? "0"+mesSiguiente : ""+mesSiguiente);
          escribirArchivo(anio+"-"+mes+""+anio+"-"+mesSiguiente,94);
        } else {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
        }
      });
    }

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
    }

    self.setSeleccionado = function(item, op) {
      switch (op) {
        case 1:
        self.anioPeriodo = item;
        break;
        case 2:
        self.mesPeriodo = item;
        break;
        default:
        self.anioPeriodo = null;
        self.mesPeriodo = null;
        break;
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
      var tamanioNum = numero.toString().length;
      for (var i = 0; i < 5 - tamanioNum; i++) {
        secuencia += '0';
      }
      secuencia += numero.toString();
      return secuencia;
    }
  });
