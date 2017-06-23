'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, seguridadSocialCrudService, agoraService, $scope) {
  var self = this;
  var dataDescuentos = [];

  self.novedadesDiv = false;
  self.activosDiv = false;

  self.anioPeriodo = new Date().getFullYear();
  self.mesPeriodo = new Date().getMonth();

  self.anios = [];

  /*
  * Tipos de pago de seguridad social
  var tiposPagoSeguridadSocial = [];
  seguridadSocialCrudService.get('tipo_pago_seguridad_social','limit=0').then(function(response) {
  tiposPagoSeguridadSocial = response.data;
});
*/


var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
self.meses = { 1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
7: "Junio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" };

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
  titanCrudService.get('liquidacion','fields=Nomina,Id&query=EstadoLiquidacion:L,FechaLiquidacion__gt:' + self.anioPeriodo + '-' + self.mesPeriodo + '-01,FechaLiquidacion__lt:' + self.anioPeriodo + '-' + self.mesPeriodo + '-' + maxDias)
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
  seguridadSocialService.getServicio("desc_seguridad_social/CalcularSegSocial",self.nomina).then(function(response) {
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

  self.guardar = function() {
    var desc_seguridad_social =
    {
      Mes: parseInt(self.mesPeriodo),
      Anio: parseInt(self.anioPeriodo),
      idNomina: parseInt(self.nomina)
    };
    seguridadSocialCrudService.post('desc_seguridad_social', desc_seguridad_social).then(function(response) {
      var idDesSeguridadSocial = response.data;
      var desc_seguridad_social = { Id: parseInt(idDesSeguridadSocial.Id) };
      for (var i = 0; i < dataDescuentos.length; i++) {
        guardarValores(dataDescuentos[i], desc_seguridad_social);
      }
    });

  }

  /*
  * Para guardar los valores de pagos seguridad social
  */
  function guardarValores(data, desc_seguridad_social) {

    var desc_seguridad_social_detalle =
    {
      IdDetalleLiquidacion: data.IdDetalleLiquidacion,
      Valor: 0,
      IdDescSeguridadSocial: desc_seguridad_social,
      IdTipoPagoSeguridadSocial: -1
    };

    //Guarda salud
    seguridadSocialCrudService.get('tipo_pago_seguridad_social','limit=1&query=Nombre:Salud').then(function (response) {
      var IdTipoPagoSeguridadSocial = { Id: parseInt(response.data[0].Id) };
      desc_seguridad_social_detalle["Valor"] = data.SaludTotal;
      desc_seguridad_social_detalle["IdTipoPagoSeguridadSocial"] = IdTipoPagoSeguridadSocial;
      seguridadSocialCrudService.post('desc_seguridad_social_detalle',desc_seguridad_social_detalle).then(function(response) {
        if(typeof response.data === 'object') {
          console.log('Salud Registrada');
          return
        } else {
          console.log('Error al registrar Salud ' + response.data);
        }
      });
    });

    //Guarda Pensión
    seguridadSocialCrudService.get('tipo_pago_seguridad_social','?limit=1&query=Nombre:Pension').then(function (response) {
      var IdTipoPagoSeguridadSocial = { Id: parseInt(response.data[0].Id) };
      desc_seguridad_social_detalle["Valor"] = data.PensionTotal;
      desc_seguridad_social_detalle["IdTipoPagoSeguridadSocial"] = IdTipoPagoSeguridadSocial;

      seguridadSocialCrudService.post('desc_seguridad_social_detalle',desc_seguridad_social_detalle).then(function(response) {
        if(typeof response.data === 'object') {
          console.log('Pensión registrada');
        } else {
          console.log('Error al registrar desc_seguridad_social_detalle ' + response.data);
        }
      });
    });

    //Guarda ARL
    seguridadSocialCrudService.get('tipo_pago_seguridad_social','?limit=1&query=Nombre:ARL').then(function (response) {
      var IdTipoPagoSeguridadSocial = { Id: parseInt(response.data[0].Id) };
      desc_seguridad_social_detalle["Valor"] = data.Arl;
      desc_seguridad_social_detalle["IdTipoPagoSeguridadSocial"] = IdTipoPagoSeguridadSocial;

      seguridadSocialCrudService.post('desc_seguridad_social_detalle',desc_seguridad_social_detalle).then(function(response) {
        if(typeof response.data === 'object') {
          console.log('ARL Registrada');
        } else {
          console.log('Error al registrar desc_seguridad_social_detalle ' + response.data);
        }
      });
    });

    //Guarda Caja
    seguridadSocialCrudService.get('tipo_pago_seguridad_social','?limit=1&query=Nombre:Caja').then(function (response) {
      var IdTipoPagoSeguridadSocial = { Id: parseInt(response.data[0].Id) };
      desc_seguridad_social_detalle["Valor"] = data.Caja;
      desc_seguridad_social_detalle["IdTipoPagoSeguridadSocial"] = IdTipoPagoSeguridadSocial;

      seguridadSocialCrudService.post('desc_seguridad_social_detalle',desc_seguridad_social_detalle).then(function(response) {
        if(typeof response.data === 'object') {
          console.log('Caja Registrada');
        } else {
          console.log('Error al registrar desc_seguridad_social_detalle ' + response.data);
        }
      });
    });

    //Guarda ICBF
    seguridadSocialCrudService.get('tipo_pago_seguridad_social','?limit=1&query=Nombre:ICBF').then(function (response) {
      var IdTipoPagoSeguridadSocial = { Id: parseInt(response.data[0].Id) };
      desc_seguridad_social_detalle["Valor"] = data.Icbf;
      desc_seguridad_social_detalle["IdTipoPagoSeguridadSocial"] = IdTipoPagoSeguridadSocial;

      seguridadSocialCrudService.post('desc_seguridad_social_detalle',desc_seguridad_social_detalle).then(function(response) {
        if(typeof response.data === 'object') {
          console.log('Icbf Registrada');
        } else {
          console.log('Error al registrar desc_seguridad_social_detalle ' + response.data);
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
        headerCellTemplate: '<div"><center>Salud<center></div>',
        cellFilter : 'currency',
        cellTemplate: '<div align="right">{{row.entity.SaludTotal | currency}}</div>'
      },
      {
        field: 'PensionTotal', visible: true, displayName : 'Pensión',
        headerCellTemplate: '<div align="center">Pensión</div>',
        cellFilter : 'currency',
        cellTemplate: '<div align="right">{{row.entity.PensionTotal | currency}}</div>'
      },
      {
        field: 'Arl', visible: true, displayName : 'ARL',
        headerCellTemplate: '<div align="center">ARL</div>',
        cellFilter : 'currency',
        cellTemplate: '<div align="right">{{row.entity.Arl | currency}}</div>'
      },
      {
        field: 'Novedades',
        headerCellTemplate: '<div align="center">Novedades</div>',
        cellTemplate: '<center><button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button></center>' }
      ]
    };

    self.novedad = function(row) {
      self.novedadesDiv = false;
      self.novedadesDiv = true;
      self.persona = row.entity;
    };

  });
