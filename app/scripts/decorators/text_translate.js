"use strict";

/**
* @ngdoc function
* @name ssClienteApp.decorator:TextTranslate
* @description
* # TextTranslate
* Decorator of the ssClienteApp
*/
var text_es = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Ahora puede comenzar con el desarrollo ...",
  ACTIVO: "Activo",
  PENSION: "Pensión",
  BTN: {
    GUARDAR: "Guardar",
    BUSCAR: "Buscar"
  },
  APORTANTE: {
    INFORMACION_APORTANTE: "Información del Aportate",
    NOMBRE: "Nombre",
    IDENTIFICACION: "Identificación",
    COD_ARL: "Código de ARL",
    COD_DEPARTAMENTO: "Código Departamento",
    COD_MUNICIPIO: "Código Municipio"
  },
  ACTIVO: {
    ANIO: "Año",
    MES: "Mes"
  }

};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  ACTIVO: "Active",
  BTN: {
    GUARDAR: "Save"
  },
  APORTANTE: {
    INFORMACION_APORTANTE: "Contributor information",
    NOMBRE: "Name",
    IDENTIFICACION: "Identification Number",
    COD_ARL: "ARL Code",
    COD_DEPARTAMENTO: "Departament Code",
    COD_MUNICIPIO: "Municipality Code"
  }
};

angular.module('ssClienteApp')
.config(function($translateProvider) {
  $translateProvider
  .translations("es", text_es)
  .translations("en", text_en);
  $translateProvider.preferredLanguage("es");
  $translateProvider.useSanitizeValueStrategy("sanitizeParameters");
});
