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
  CALCULO: {
    TITULO_PARAMETROS: "Parámetros de Cálculo",
    PARAMETROS_CALCULO: "Establecer Parámetros de Cálculo",
    RESOLUCION: "Nombre de Resolución",
    APORTE_SALUD: "Aporte Salud",
    APORTE_PENSION: "Aporte Pensión",
    TARIFA_ARL: "Tarifa ARL",
    COMISION_NO_REMUNERADA: "Comisión no Remunerada",
    LICENCIA_NO_REMUNERADA: "Licencia no Remunerada",
    TARIFA_CCF: "Tarifa de Caja de Compensación Familiar",
    APORTE_ICBF: "Aporte ICBF"
  },
  INCAPACIDADES: {
    TITULO: "Incapacidades",
    NOMBRE: "Nombre",
    TIPO: "Tipo de Incapacidad",
    FECHA_INCIO: "Fecha de Inicio",
    FECHA_FIN: "Fecha de Finalización",
    SIN_RESULTADOS: "No se encontraron resultados de ",
    SELECCIONE_OPCION: "Seleccione una opción"
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
  },
  CALCULO: {
    TITULO_PARAMETROS: "Calculation Parameters",
    ESTABLECER_PARAMETROS_CALCULO: "Set Calculation Parameters",
    RESOLUCION: "Resolution Name",
    APORTE_SALUD: "Health",
    APORTE_PENSION: "Pension",
    TARIFA_ARL: "ARL Rate",
    COMISION_NO_REMUNERADA: "Unpaid commission",
    LICENCIA_NO_REMUNERADA: "Unpaid License",
    TARIFA_CCF: "Family Compensation Fund Rate",
    APORTE_ICBF: "ICBF Rate"
  },
  INCAPACIDADES: {
    TITULO: "Disabilities",
    NOMBRE: "Name",
    TIPO: "Disabilities Type",
    FECHA_INCIO: "Start date",
    FECHA_FIN: "Finish date",
    SIN_RESULTADOS: "No result found ",
    SELECCIONE_OPCION: "Select one"
  },
  ACTIVO: {
    ANIO: "Year",
    MES: "Month"
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
