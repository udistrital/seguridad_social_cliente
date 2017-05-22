'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:PlanillasCtrl
* @description
* # PlanillasCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('PlanillasCtrl', function () {
  var self = this;

  self.genearArchivo = function(seguridadSocialCrudService) {
    console.log('generar ARchivo ');

    var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
    var csvContent = "data:text/csv;charset=utf-8,";

    /*data.forEach(function(infoArray, index){
      dataString = infoArray.join(",");
      csvContent += index < data.length ? dataString+ "\n" : dataString;
    });*/

    csvContent += '0110001UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS            \n prueba espac';

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PlanillaTipoE.csv");
    link.click();
  }
});
