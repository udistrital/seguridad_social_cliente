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

  //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 1900 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

    self.nominaSeleccionada = function() {
      var pagosNombre = [];

      seguridadSocialService.getServicio("desc_seguridad_social/CalcularSegSocial",self.nomina).then(function(response) {
        if (response.data != null) {
          var desc_seguridad_social =
          {
            Mes: parseInt(self.mesPeriodo),
            Anio: parseInt(self.anioPeriodo),
            idNomina: parseInt(self.nomina)
          };
          var pagos = response.data;
          seguridadSocialCrudService.post('desc_seguridad_social', desc_seguridad_social).then(function(response) {
            var idDesSeguridadSocial = response.data;
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
                  var desc_seguridad_social = { Id: parseInt(idDesSeguridadSocial.Id) };

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
                      } else {
                        console.log('Error al registrar desc_seguridad_social_detalle ' + response.data);
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

                  //Guarda Pensión
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

              });
            });
          });
        } else {
          self.gridOptions.data = pagosNombre;
        }
      });
      self.activosDiv = true;
    };


    titanCrudService.get('liquidacion','fields=Nomina,Id').then(function(response) {
      self.nominas = response.data;
    });

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
