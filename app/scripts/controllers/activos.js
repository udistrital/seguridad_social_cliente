'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, seguridadSocialCrudService, agoraService, $scope, $translate) {
  var self = this;
  var dataDescuentos = [];
  var nominaObj;   // Objeto json con la nómina seleccionada

  self.novedadesDiv = false;
  self.activosDiv = false;

  self.anioPeriodo = new Date().getFullYear();
  self.mesPeriodo = new Date().getMonth();

  self.anios = [];


  var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
  self.meses = { 1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
  7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" };

  //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 1900 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  //Trae las nóminas liquidadas de acuerdo al mes y año seleccionado
  self.buscarNomina = function() {
    function daysInMonth(humanMonth, year) {
      return new Date(year || new Date().getFullYear(), humanMonth, 0).getDate();
    }
    var maxDias = daysInMonth(self.mesPeriodo, self.anioPeriodo).toString();
    titanCrudService.get('preliquidacion', 'query=EstadoPreliquidacion.Nombre:Cerrada,Mes:'+self.mesPeriodo+',Ano:'+self.anioPeriodo)
    .then(function(response) {
      if (response.data != null) {
        self.nominas = response.data;
        self.divNominas = true;
        self.divError = false;
      } else {
        self.divNominas = false;
        self.nominas = null;
        self.divError = true;
        self.errorMensaje = "No se encontrarón nóminas liquidadas para " + self.meses[self.mesPeriodo] + " de " + self.anioPeriodo
      }
    });
  }

  self.nominaSeleccionada = function() {
    var pagosNombre = [];
    nominaObj = JSON.parse(self.nomina);  // Conviente el string de self.nomina a un objetso json
    console.log(nominaObj.Id);
    seguridadSocialService.getServicio("pago/CalcularSegSocial",nominaObj.Id).then(function(response) {
      if (response.data != null) {
        var pagos = response.data;
        //Aquí se va llenando el ui-grid con la información que viene en el arreglo pagos
        angular.forEach(pagos,function(data){
          titanCrudService.get('informacion_proveedor', 'limit=-1&fields=Id,NomProveedor&query=Id:' + data.Persona).then(function(response) {
            self.nombre = response.data[0].NomProveedor;
            pagosNombre.push({
              Persona: data.Persona,
              Nombre: self.nombre,
              PensionUd: data.PensionUd,
              SaludUd: data.SaludUd,
              SaludTotal: data.SaludTotal,
              PensionTotal: data.PensionTotal,
              Arl: data.Arl,
              Caja: data.Caja,
              Icbf: data.Icbf });
              self.gridOptions.data = pagosNombre;
              dataDescuentos.push(data)
            });
          });
        } else {
          self.gridOptions.data = pagosNombre;
        }
      });
      self.activosDiv = true;
    };

    //Función para registrar un nuevo periodo de pago
    self.guardar = function() {

      var periodo_pago =
      {
        Mes: parseInt(self.mesPeriodo),
        Anio: parseInt(self.anioPeriodo),
        TipoLiquidacion: nominaObj.Nomina.Nombre
      };
      seguridadSocialCrudService.post('periodo_pago', periodo_pago).then(function(response) {
        var periodo_pago = { Id: parseInt(response.data.Id) };
        for (var i = 0; i < dataDescuentos.length; i++) {
          guardarValores(dataDescuentos[i], periodo_pago);
        }
      });

    }

    //Función para guardar los valores de cada uno de los pagos
    function guardarValores(data, periodo_pago) {

      var pago =
      {
        DetalleLiquidacion: data.IdDetalleLiquidacion,
        Valor: 0,
        TipoPago: -1,
        EntidadPago: 0,
        PeriodoPago: periodo_pago
      };

      //Guarda salud UD
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:saludUd').then(function (response) {
        pago["Valor"] = data.SaludUd;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Salud UD Registrada');
            return
          } else {
            console.log('Error al registrar salud ud ' + response.data);
          }
        });
      });

      //Guarda salud Total
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:saludTotal').then(function (response) {
        pago["Valor"] = data.SaludTotal;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Salud Total Registrada');
            return
          } else {
            console.log('Error al registrar salud total ' + response.data);
          }
        });
      });

      //Guarda Pensión UD
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:pensionUd').then(function (response) {
        pago["Valor"] = data.PensionUd;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Pensión Ud registrada');
          } else {
            console.log('Error al registrar pension ud ' + response.data);
          }
        });
      });

      //Guarda Pensión Total
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:pensionTotal').then(function (response) {
        pago["Valor"] = data.PensionTotal;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Pensión Total registrada');
          } else {
            console.log('Error al registrar pension total ' + response.data);
          }
        });
      });

      //Guarda ARL
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:arl').then(function (response) {
        pago["Valor"] = data.Arl;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('ARL Registrada');
          } else {
            console.log('Error al registrar arl ' + response.data);
          }
        });
      });

      //Guarda Caja
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:caja').then(function (response) {
        pago["Valor"] = data.Caja;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Caja Registrada');
          } else {
            console.log('Error al registrar caja ' + response.data);
          }
        });
      });

      //Guarda ICBF
      titanCrudService.get('concepto','limit=1&query=Naturaleza:seguridad_social,NombreConcepto:icbf').then(function (response) {
        pago["Valor"] = data.Icbf;
        pago["TipoPago"] = parseInt(response.data[0].Id);
        seguridadSocialCrudService.post('pago',pago).then(function(response) {
          if(typeof response.data === 'object') {
            console.log('Icbf Registrada');
          } else {
            console.log('Error al registrar ICBF ' + response.data);
          }
        });
      });
    }

    self.gridOptions = {
      enableFiltering : true,
      enableSorting : false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren : false,

      columnDefs : [
        {field: 'Persona', visible : false},
        {field: 'Nombre', visible: true, width: '30%', headerCellTemplate: '<div align="center">Nombre</div>'},
        {
          field: 'SaludTotal', visible: true, displayName : 'Salud' ,
          headerCellTemplate: '<div"><center> {{ \'ACTIVOS.SALUD\' | translate }} <center></div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.SaludTotal | currency}}</div>'
        },
        {
          field: 'PensionTotal', visible: true, displayName : $translate.instant('PENSION'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.PENSION\' | translate }} </div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.PensionTotal | currency}}</div>'
        },
        {
          field: 'Arl', visible: true, displayName : 'ARL',
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.ARL\' | translate }} </div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.Arl | currency}}</div>'
        },
        {
          field: 'Novedades',
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.NOVEDADES\' | translate }} </div>',
          cellTemplate: '<center><button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button></center>' }
        ]
      };

      self.novedad = function(row) {
        self.novedadesDiv = false;
        self.novedadesDiv = true;
        self.persona = row.entity;
      };

    });
