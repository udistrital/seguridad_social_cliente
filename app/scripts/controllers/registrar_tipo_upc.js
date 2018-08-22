'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:RegistrarTipoUpcCtrl
* @description
* # RegistrarTipoUpcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('RegistrarTipoUpcCtrl', function (seguridadSocialCrudService, $scope) {

  var self = this;
  self.anios = [];

  self.gridOptions = {
    enableRowHeaderSelection: false,
    enableRowSelection: true,
    multiSelect: false,
    enableCellEditOnFocus: true
  };

  self.gridOptions.columnDefs = [
    { name: 'Id', visible: false, enableCellEdit: false },
    { name: 'EdadMin', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.RANGO_EDAD\' | translate }} </h5></div>', enableCellEdit: false,
    cellTemplate: '<div align="center">De {{row.entity.EdadMin}} a {{row.entity.EdadMax}} años {{row.entity.AplicaGenero}}</div>' },

    { name: 'ZonaNormal', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONA_NORMAL\' | translate }} </h5></div>', enableCellEdit: true ,
    cellTemplate: '<div align="center" style="padding:10px"; ng-init="row.entity.ZonaNormal=0">{{row.entity.ZonaNormal | currency:undefined:0}}</div>' },

    { name: 'ZonaEspecial', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONA_ESPECIAL\' | translate }} </h5></div>', enableCellEdit: true,
    cellTemplate: '<div align="center" ng-init="row.entity.ZonaEspecial=0">{{row.entity.ZonaEspecial | currency:undefined:0}}</div>' },

    { name: 'GrandesCiudades', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.GRANDES_CIUDADES\' | translate }} </h5></div>', enableCellEdit: true,
    cellTemplate: '<div align="center" ng-init="row.entity.GrandesCiudades=0">{{row.entity.GrandesCiudades | currency:undefined:0}}</div>' },

    { name: 'ZonasAlejadas', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONAS_ALEJADAS\' | translate }} </h5></div>', enableCellEdit: true,
    cellTemplate: '<div align="center" ng-init="row.entity.ZonasAlejadas=0">{{row.entity.ZonasAlejadas | currency:undefined:0}}</div>' }
  ];

  seguridadSocialCrudService.get('rango_edad_upc','limit=-1&sortby=EdadMin&order=asc').then(function(response) {
    self.gridOptions.data = response.data;
  });

  self.guardar = function() {
    console.log(self.gridOptions.data);
    var zonas = self.gridOptions.data;
    var guardar = rectificarValores(zonas);
    if (guardar) {
      for (var i = 0; i < zonas.length; i++) {
        guardarValores('Zona Normal', zonas[i].Id, zonas[i].ZonaNormal);
        guardarValores('Zona Especial', zonas[i].Id, zonas[i].ZonaEspecial);
        guardarValores('Grandes Ciudades', zonas[i].Id, zonas[i].GrandesCiudades);
        guardarValores('Zonas Alejadas', zonas[i].Id, zonas[i].ZonasAlejadas);
      }
      swal (
        'Registro Correcto',
        'Nuevos Valores Asignados',
        'success'
      );
    }
  }

   //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
   function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 2000 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  function guardarValores(zona, edad, valor) {
    seguridadSocialCrudService.get('zona_upc','limit=1&fields=Id&query=Nombre:' + zona).then(function(response) {
      var idZona = response.data[0];

      var IdEdadUpc = { Id: edad };
      var IdTipoZonaUpc = { Id: idZona.Id };

      var tipoUpc = {
        Valor: parseInt(valor),
        Vigencia: parseInt(self.vigencia),
        ZonaUpc: IdTipoZonaUpc,
        RangoEdadUpc: IdEdadUpc,
        Resolucion: self.resolucion
      };

      seguridadSocialCrudService.post('tipo_upc',tipoUpc).then(function(response) {
        console.log(response.data)
      });
    });
  }


  function rectificarValores(zonas) {
    var error = 0 //si la variable se vuelve 1 entonces existe un error y el mensaje mostrado del swal va a ser de error
    var mensaje = '';
    for (var i = 0; i < zonas.length; i++) {
      if (zonas[i].ZonaNormal === 0) {
        mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zona Normal';
        error = 1;
        break;
      } else if(zonas[i].ZonaEspecial === 0) {
        mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zona Especial';
        error = 1;
        break;
      } else if(zonas[i].GrandesCiudades === 0) {
        mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Grandes Ciudades';
        error = 1;
        break;
      } else if(zonas[i].ZonasAlejadas === 0) {
        mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zonas Alejadas';
        error = 1;
        break;
      } else if(zonas[i].ZonaNormal < 0) {
        mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zona Normal';
        error = 1;
        break;
      } else if(zonas[i].ZonaEspecial < 0) {
        mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zona Especial';
        error = 1;
        break;
      } else if(zonas[i].GrandesCiudades < 0) {
        mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Grandes Ciudades';
        error = 1;
        break;
      } else if(zonas[i].ZonasAlejadas < 0) {
        mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zonas Alejadas';
        error = 1;
        break;
      }
    }

    if (error == 0) { //todo salio bien
      return true;
    } else { //hubo un error en el proceso  de rectificación
      swal(
        'Error',
        mensaje,
        'error'
      )
      return false;
    }
  };

});
