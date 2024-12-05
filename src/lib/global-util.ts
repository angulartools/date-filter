import { Injectable } from '@angular/core';

@Injectable()
export abstract class GlobalUtil {

  static PERIODO_1H = 1;
  static PERIODO_6H = 2;
  static PERIODO_12H = 3;
  static PERIODO_24H = 4;
  static PERIODO_HOJE = 5;
  static PERIODO_ONTEM = 6;
  static PERIODO_SETE_DIAS = 7;
  static PERIODO_QUINZE_DIAS = 8;
  static PERIODO_TRINTA_DIAS = 9;
  static PERIODO_MES = 10;
  static PERIODO_INTERVALO = 11;

  static getMinDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  static getMaxDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 59);
  }

  static getPeriods(data) {
    return [
      { id: this.PERIODO_6H, nickname:'6H', label: 'ULTIMAS_6_HORAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours()-6, data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                             dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
      { id: this.PERIODO_12H, nickname:'12H', label: 'ULTIMAS_12_HORAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours()-12, data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
      { id: this.PERIODO_24H, nickname:'24H', label: 'ULTIMAS_24_HORAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()-1, data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(), data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
      { id: this.PERIODO_HOJE, nickname:'HOJE', label: 'HOJE', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate()+1)},
      { id: this.PERIODO_ONTEM, nickname:'ONTEM', label: 'ONTEM', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()-1),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate())},
      { id: this.PERIODO_SETE_DIAS, nickname:'7DIAS', label: 'ULTIMOS_7_DIAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()-7,  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(),  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
       { id: this.PERIODO_QUINZE_DIAS, nickname:'15DIAS', label: 'ULTIMOS_15_DIAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()-15,  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                             dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(),  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
       { id: this.PERIODO_TRINTA_DIAS, nickname:'30DIAS', label: 'ULTIMOS_30_DIAS', dataInicio: new Date(data.getFullYear(), data.getMonth(), data.getDate()-30,  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds()),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), data.getDate(),  data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds())},
       { id: this.PERIODO_MES, nickname:'MESP', label: 'MES_PASSADO', dataInicio: new Date(data.getFullYear(), data.getMonth()-1, 1),
                              dataFim: new Date(data.getFullYear(), data.getMonth(), 1)},
       { id: this.PERIODO_INTERVALO, nickname:'INT', label: 'INTERVALO', dataInicio: null, dataFim: null },
    ];
  }
}
