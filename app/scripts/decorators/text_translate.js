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
  ERROR: "Error!",
  ALERTA: "Alerta!",
  BTN: {
    GUARDAR: "Guardar",
    BUSCAR: "Buscar",
    VER_REGISTROS: "Ver Registros",
    GENERAR_PLANILLA: "Generar Planilla",
    CERRAR: "Cerrar",
    EDITAR: "Editar",
    REGISTRAR: "Registrar"
  },
  VALIDACION: {
    NOMBRE: "El nombre es requerido",
    IDENTIFICACION: "El número de identificación es requerido",
    COD_ARL: "El código de ARL es requerido",
    COD_DEPARTAMENTO: "El código del departamento es requerido",
    COD_MUNICIPIO: "El código del municipio es requerido",
    CAMPO_REQUERIDO: "El campo es requerido",
    ALERTA: "Alerta",
    ERROR: "Error",
    PERSONA: "Información del tercero no valida",
    PRIMER_NOMBRE: "El primer nombre es requerido",
    PRIMER_APELLIDO: "El primer apellido es requerido",
    FECHA_NACIMIENTO: "La fecha de nacimiento es requerida",
    PERSONA_INVALIDA: "Persona no valida",
    TIPO_IDENTIFICACION: "Selecciona un tipo de identificación",
    FECHA_INCIO: "Selecciona una fecha de inicio",
    FECHA_FIN: "Selecciona una fecha de finaización"
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
    SELECCIONE_OPCION: "Seleccione una opción",
    REGISTRADA: "Incapacidad registrada",
    ERROR_REGISTRO: "No se ha logrado registrar la incapacidad"
  },
  ACTIVOS: {
    TITULO: "Activos",
    ANIO: "Año",
    MES: "Mes",
    SELECCION_NOMINA: "Selección Nómina",
    PENSION: "Pensión",
    SALUD: "Salud",
    ARL: "ARL",
    CAJA: "Caja de Compensación",
    ICBF: "ICBF",
    NOVEDADES: "Novedades",
    SELECCION_MES: "Selecciona un mes",
    SELECCION_ANIO: "Selecciona un año",
    REGISTRO: "Registrada seguridad social del mes de"
  },
  UPC_ADICIONAL: {
    TITULO_REGISTRO: "Registrar Nueva UPC",
    TIPO_DOCUMENTO: "Tipo de Documento",
    NUM_DOCUMENTO: "Número de Documento",
    INFO_UPC: "Información de la UPC",
    PRIMER_NOMBRE: "Primer Nombre",
    SEGUNDO_NOMBRE: "Segundo Nombre",
    PRIMER_APELLIDO: "Primer Apellido",
    SEGUNDO_APELLIDO: "Segundo Apellido",
    FECHA_NACIMIENTO: "Fecha de Nacimiento",
    TIPO_ZONA: "Tipo de Zona",
    RANGO_EDAD: "Rango de Edad",
    VALOR_UPC: "Valor UPC",
    RESPONSABLE: "Responsable",
    SELECCIONE_OPCION: "Seleccione una opción",
    SIN_RESULTADOS: "No se encontraron resultados de ",
    DOCUMENTO: "Documento",
    NOMBRE: "Nombre",
    APELLIDO: "Apellido",
    LISTA_UPC: "Lista de UPC Adicional",
    TITULO_LISTAR_VALORES: "Valor UPC Adicional",
    VALORES_ACTUALES: "Valores Actuales",
    ZONAS: "Zonas",
    VALOR: "Valor",
    EDAD_MINIMA: "Edad Miníma",
    EDAD_MAXIMA: "Edad Máxima",
    APLICA_GENERO: "Aplica Genero",
    ZONA_NORMAL: "Zona Normal",
    ZONA_ESPECIAL: "Zona Especial",
    GRANDES_CIUDADES: "Grandes Ciudades",
    ZONAS_ALEJADAS: "Zonas Alejadas",
    TITULO_REGISTRAR_TIPO: "Registrar Valores",
    TITULO_TIPO_UPC: "Valor UPC Adicional",
    REGISTRAR_VALORES: "Registrar Nuevos Valores",
    SIN_UPC: "No existen UPC asociadas a esta persona"
  },
  PLANILLAS: {
    TITULO: "Planillas",
    ANIO: "Año",
    MES: "Mes",
    TIPO_NOMINA: "Tipo de Nómina",
    VIGENCIA: "Vigencia"
  },
  IBC: {
    TITULO: "Ingreso Base de Cotización",
    SELECCION_CONCEPTOS: "Seleccione los conceptos para establecer el Ingreso Base de Cotiazción",
    CONCEPTOS_SELECCIONADOS: "Conceptos Seleccionados"
  },
  CONCEPTO_PERSONA: {
    VALOR_NOVEDAD: "Valor",
    FECHA_DESDE: "Fecha inicio",
    FECHA_HASTA: "Fecha finalización"
  },
  ALERTAS: {
    CONTINUAR: "Continuar",
    REGISTRADO: "Registrado",
    GUARDAR: "Guardar",
    CANCELAR: "Cancelar"
  }
};

var text_en = {
  TITULO: "GENERATOR-OAS",
  MENSAJE_INICIAL: "Now get to start to develop ...",
  ACTIVO: "Active",
  ERROR: "Error!",
  ALERTA: "Alert!",
  BTN: {
    GUARDAR: "Save",
    BUSCAR: "Search",
    VER_REGISTROS: "Register View",
    GENERAR_PLANILLA: "Generate Form",
    CERRAR: "Clonse",
    EDITAR: "Edit",
    REGISTRAR: "Register"
  },
  VALIDACION: {
    NOMBRE: "Name is required",
    IDENTIFICACION: "Identification number is required",
    COD_ARL: "ARL code is required",
    COD_DEPARTAMENTO: "Departament code is required",
    COD_MUNICIPIO: "Municipality code is required",
    CAMPO_REQUERIDO: "Value required",
    ALERTA: "Warning",
    ERROR: "Error",
    PERSONA: "Invalid information",
    PRIMER_NOMBRE: "Firts name is required",
    PRIMER_APELLIDO: "Firts lastname is reequired",
    FECHA_NACIMIENTO: "Date birth is required",
    PERSONA_INVALIDA: "Invalid person",
    TIPO_IDENTIFICACION: "Select an id type",
    FECHA_INCIO: "Select an start date",
    FECHA_FIN: "Select an end date"
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
    SELECCIONE_OPCION: "Select one",
    REGISTRADA: "Registered disability",
    ERROR_REGISTRO: "Unregistered disability"
  },
  ACTIVOS: {
    TITULO: "Title",
    ANIO: "Year",
    MES: "Month",
    SELECCION_NOMINA: "Choose a pyroll",
    PENSION: "Pensión",
    SALUD: "Health",
    ARL: "ARL",
    CAJA: "Compensation Box",
    ICBF: "ICBF",
    NOVEDADES: "News",
    SELECCION_MES: "Choose a month",
    SELECCION_ANIO: "Choose a year",
    REGISTRO: "Registered social security of the month of"
  },
  UPC_ADICIONAL: {
    TITULO_REGISTRO: "New UPC Register",
    TIPO_DOCUMENTO: "Document Type",
    NUM_DOCUMENTO: "Document Id",
    INFO_UPC: "UPC Information",
    PRIMER_NOMBRE: "Fist Name",
    SEGUNDO_NOMBRE: "Second Name",
    PRIMER_APELLIDO: "Surname",
    SEGUNDO_APELLIDO: "Second Surname",
    FECHA_NACIMIENTO: "Birthdate",
    TIPO_ZONA: "Zone Type",
    RANGO_EDAD: "Age Range",
    VALOR_UPC: "UPC Cost",
    RESPONSABLE: "Responsable",
    SELECCIONE_OPCION: "Select one",
    SIN_RESULTADOS: "No result found ",
    DOCUMENTO: "Document",
    NOMBRE: "Name",
    APELLIDO: "Lastname",
    LISTA_UPC: "UPC List",
    TITULO_LISTAR_VALORES: "UPC Values",
    VALORES_ACTUALES: "Today Values",
    ZONAS: "Zones",
    VALOR: "Value",
    EDAD_MINIMA: "Min Age",
    EDAD_MAXIMA: "Max Age",
    APLICA_GENERO: "Gener",
    ZONA_NORMAL: "Normal Zone",
    ZONA_ESPECIAL: "Special Zone",
    GRANDES_CIUDADES: "Citys",
    ZONAS_ALEJADAS: "Far Away Zones",
    TITULO_REGISTRAR_TIPO: "Values Register",
    TITULO_TIPO_UPC: "UPC Cost",
    REGISTRAR_VALORES: "Register New Values",
    SIN_UPC: "There is not UPC associated to this person"
  },
  PLANILLAS: {
    TITULO: "Forms",
    ANIO: "Year",
    MES: "Month",
    TIPO_NOMINA: "Pyroll type",
    VIGENCIA: "Validity",
    ALERTA: "Alert!",
    ERROR: "Error!"
  },
  IBC: {
    TITULO: "IBC",
    SELECCION_CONCEPTOS: "Select the IBC Concepts",
    CONCEPTOS_SELECCIONADOS: "Selectd Concepts"
  },
  CONCEPTO_PERSONA: {
    VALOR_NOVEDAD: "Value",
    FECHA_DESDE: "Start",
    FECHA_HASTA: "Finish date"
  },
  ALERTAS: {
    CONTINUAR: "Continue",
    REGISTRADO: "Registered",
    GUARDAR: "Save",
    CANCELAR: "Cancel"
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