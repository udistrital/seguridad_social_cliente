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

    var cabecera = ["0110001UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS                                                                                                                                                          NI899999230       7E                    S01                                                14-23"];
    var pagos = [["020000001"],["CC1010225713"],["0100"], ["11001RAMOS"]]

    pagos.forEach(function (infoArray, index) {
      var dataString = infoArray.join(",");
      csvContent += dataString ;
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PlanillaTipoE.csv");
    link.click();
  }
});
