'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:RegistrarTipoUpcCtrl
* @description
* # RegistrarTipoUpcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('RegistrarTipoUpcCtrl', function (seguridadSocialCrudService) {

    var self = this;
    var zonas = {};
    var nuevosValores = { "TipoUpc": [] };
    self.anios = [];

    self.gridOptions = {
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      enableCellEditOnFocus: true
    };

    self.gridOptions.columnDefs = [
      { name: 'Id', visible: false, enableCellEdit: false },
      {
        name: 'EdadMin', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.RANGO_EDAD\' | translate }} </h5></div>', enableCellEdit: false,
        cellTemplate: '<div align="center" style="padding:10px"; >De {{row.entity.EdadMin}} a {{row.entity.EdadMax}} años {{row.entity.AplicaGenero}}</div>'
      },

      {
        name: 'ZonaNormal', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONA_NORMAL\' | translate }} </h5></div>', enableCellEdit: true,
        cellTemplate: '<div align="center" ng-init="row.entity.ZonaNormal=0">{{row.entity.ZonaNormal | currency:undefined:0}}</div>'
      },

      {
        name: 'ZonaEspecial', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONA_ESPECIAL\' | translate }} </h5></div>', enableCellEdit: true,
        cellTemplate: '<div align="center" ng-init="row.entity.ZonaEspecial=0">{{row.entity.ZonaEspecial | currency:undefined:0}}</div>'
      },

      {
        name: 'GrandesCiudades', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.GRANDES_CIUDADES\' | translate }} </h5></div>', enableCellEdit: true,
        cellTemplate: '<div align="center" ng-init="row.entity.GrandesCiudades=0">{{row.entity.GrandesCiudades | currency:undefined:0}}</div>'
      },

      {
        name: 'ZonasAlejadas', headerCellTemplate: '<div align="center"><h5> {{ \'UPC_ADICIONAL.ZONAS_ALEJADAS\' | translate }} </h5></div>', enableCellEdit: true,
        cellTemplate: '<div align="center" ng-init="row.entity.ZonasAlejadas=0">{{row.entity.ZonasAlejadas | currency:undefined:0}}</div>'
      }
    ];

    seguridadSocialCrudService.get('rango_edad_upc', 'limit=-1&sortby=EdadMin&order=asc').then(function (response) {
      self.gridOptions.data = response.data;
    });

    seguridadSocialCrudService.get('zona_upc', '').then(function (response) {
      for (let i = 0; i < response.data.length; i++) {
        zonas[response.data[i].Nombre] = response.data[i].Id;
      }
    });

    self.guardar = function () {
      nuevosValores.TipoUpc = [];

      var valores = self.gridOptions.data;
      var guardar = rectificarValores(valores);

      if (guardar) {
        for (var i = 0; i < valores.length; i++) {
          guardarValores('Zona Normal', valores[i].Id, valores[i].ZonaNormal);
          guardarValores('Zona Especial', valores[i].Id, valores[i].ZonaEspecial);
          guardarValores('Grandes Ciudades', valores[i].Id, valores[i].GrandesCiudades);
          guardarValores('Zonas Alejadas', valores[i].Id, valores[i].ZonasAlejadas);
        }

        seguridadSocialCrudService.post('tipo_upc/registrar_valores', nuevosValores).then(function (response) {
          if (response.data.Type === "success") {
            swal(
              'Registro Correcto',
              'Nuevos Valores Asignados',
              'success'
            );
          } else {
            swal(
              'Ha Ocurrido un error registrando los nuevos valores',
              'Verifique que todos los campos fueron diligenciados de forma adecuada',
              'error'
            );
          }
        });
      }
    };

    //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
    function calcularAnios() {
      for (var i = new Date().getFullYear(); i >= 2000; i--) {
        self.anios.push({ anio: i });
      }
    }
    calcularAnios();

    function guardarValores(zona, edad, valor) {
      // var idZona = zonas[zona];

      var IdEdadUpc = { Id: edad };
      var IdTipoZonaUpc = { Id: zonas[zona] };

      var tipoUpc = {
        Valor: parseInt(valor),
        Vigencia: parseInt(self.vigencia),
        ZonaUpc: IdTipoZonaUpc,
        RangoEdadUpc: IdEdadUpc,
        Resolucion: self.resolucion
      };

      nuevosValores.TipoUpc.push(tipoUpc);
    }

    function rectificarValores(zonas) {
      var error = 0; //si la variable se vuelve 1 entonces existe un error y el mensaje mostrado del swal va a ser de error
      var mensaje = '';
      for (var i = 0; i < zonas.length; i++) {
        if (zonas[i].ZonaNormal === 0) {
          mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zona Normal';
          error = 1;
          break;
        } else if (zonas[i].ZonaEspecial === 0) {
          mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zona Especial';
          error = 1;
          break;
        } else if (zonas[i].GrandesCiudades === 0) {
          mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Grandes Ciudades';
          error = 1;
          break;
        } else if (zonas[i].ZonasAlejadas === 0) {
          mensaje = 'Ingresa los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' para Zonas Alejadas';
          error = 1;
          break;
        } else if (zonas[i].ZonaNormal < 0) {
          mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zona Normal';
          error = 1;
          break;
        } else if (zonas[i].ZonaEspecial < 0) {
          mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zona Especial';
          error = 1;
          break;
        } else if (zonas[i].GrandesCiudades < 0) {
          mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Grandes Ciudades';
          error = 1;
          break;
        } else if (zonas[i].ZonasAlejadas < 0) {
          mensaje = 'Los Valores en el Rango de ' + zonas[i].EdadMin + ' - ' + zonas[i].EdadMax + ' no pueden ser negativos para Zonas Alejadas';
          error = 1;
          break;
        }
      }

      if (error === 0) { //todo salio bien
        return true;
      } else { //hubo un error en el proceso  de rectificación
        swal(
          'Error',
          mensaje,
          'error'
        );
        return false;
      }
    }

  });
