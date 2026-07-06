import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment-timezone';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { TranslationPipe, TranslationService } from '@angulartoolsdr/translation';
import { ControlMaterialDateTimeComponent } from '@angulartoolsdr/control-material';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { GlobalUtil } from './global-util';
import { SnackNotificationService } from '@angulartoolsdr/shared-utils';

@Component({
  selector: 'lib-date-filter',
  templateUrl: './date-filter.html',
  styleUrls: ['./date-filter.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButton, MatMenuTrigger, ControlMaterialDateTimeComponent, FormsModule, MatMenu, MatSelectionList, MatListOption, TranslationPipe]
})
export class DateFilter implements OnInit {

  @Input() filtroSelecionado;
  @Input() loading = false;
  @Input() intervaloMaximo1Mes = false;
  @Input() filtroPeriodos: any[] = GlobalUtil.getPeriods(new Date());
  @Input() disabled = false;

  @Input() minDateInicio;
  @Input() minDateFim;
  @Input() maxDateInicio;
  @Input() maxDateFim;

  @Output() filtrar = new EventEmitter();
  @Output() limpar = new EventEmitter();

  @ViewChild('selectable') selectable: MatSelectionList;

  formGroup: UntypedFormGroup;

  labelDataMaximaPossivel = "PERIODO_MAXIMO_1_ANO";

  PERIODO_INTERVALO = GlobalUtil.PERIODO_INTERVALO;

  filtroPeriodo = null;
  filtroDatasSelecionado;

  toastrService = inject(SnackNotificationService);
  translate = inject(TranslationService);

  dataInicio;
  dataFim;

  constructor(private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      periodo: this.formBuilder.control(null, [Validators.required]),
      dataInicio: this.formBuilder.control(null),
      dataFim: this.formBuilder.control(null)
    });

    this.inicializarValores();
  }

  inicializarValores() {
    if (this.filtroSelecionado?.id != null) {
      this.filtroPeriodo = this.filtroPeriodos.find(item => item.id === this.filtroSelecionado.id);
      if (this.filtroPeriodo != null) {
        this.formGroup.get('periodo')?.setValue(this.filtroPeriodo);
        this.filtroPeriodo.selected = true;
        if (this.filtroPeriodo.id === this.PERIODO_INTERVALO) {
          this.formGroup.get('dataFim')?.setValue(GlobalUtil.getMaxNextDate(new Date()));
        } else {
          this.formGroup.get('dataInicio')?.setValue(this.filtroPeriodo.dataInicio);
          this.formGroup.get('dataFim')?.setValue(this.filtroPeriodo.dataFim);
        }
      }
    }
    if (this.intervaloMaximo1Mes) {
      this.labelDataMaximaPossivel = "PERIODO_MAXIMO_1_MES";
    }
  }

  selectPeriodo(periodo: any, oldValue) {
    for (let i = 0; i < this.filtroPeriodos.length; i++) {
      this.filtroPeriodos[i].selected = false;
    }
    this.selectable.deselectAll();
    if (oldValue) {
      periodo.selected = false;
      this.filtroPeriodo = null;
      this.formGroup.get('periodo')?.setValue(null);
      this.formGroup.get('dataInicio')?.setValue(null);
      this.formGroup.get('dataFim')?.setValue(null);
      this.limpar.emit();
      return;
    } else {
      periodo.selected = true;
    }
    if (this.filtroPeriodo?.id !== periodo.id) {
      this.formGroup.get('periodo')?.setValue(periodo);
      this.filtroPeriodo = periodo;
      if (periodo.id === this.PERIODO_INTERVALO) {
        this.formGroup.get('dataInicio')?.setValue(null);
        this.formGroup.get('dataFim')?.setValue(GlobalUtil.getMaxNextDate(new Date()));
        periodo.dataInicio = this.formGroup.get('dataInicio')?.value;
        periodo.dataFim = this.formGroup.get('dataFim')?.value;
        this.formGroup.get('dataInicio').setValidators([Validators.required]);
        this.formGroup.get('dataFim').setValidators([Validators.required]);
      } else {
        this.formGroup.get('dataInicio').clearValidators();
        this.formGroup.get('dataFim').clearValidators();
        this.filtrar.emit(this.getDatasAtualizadas());
      }
      this.formGroup.get('dataInicio').updateValueAndValidity();
      this.formGroup.get('dataFim').updateValueAndValidity();
    }
  }

  isIntervaloDataValido() {

    if (!this.formGroup.valid) {
      if (this.formGroup.get('periodo')?.invalid) {
        this.toastrService.warning(this.translate.instant('SELECIONE_PERIODO'));
        return false;
      }
      else if (this.formGroup.get('dataInicio')?.invalid) {
        this.toastrService.warning(this.translate.instant('DATA_INICIO_INVALIDA'));
        return false;
      } else if (this.formGroup.get('dataInicio')?.invalid) {
        this.toastrService.warning(this.translate.instant('DATA_FIM_INVALIDA'));
        return false;
      }
      return false;
    }

    if (this?.filtroPeriodo.id === GlobalUtil.PERIODO_INTERVALO) {

      const dataInicio = moment(this.formGroup.get('dataInicio').value).toDate();
      const dataFim = moment(this.formGroup.get('dataFim').value).toDate();

      let dataMaximaPossivel;

      if (this.intervaloMaximo1Mes) {
        dataMaximaPossivel = new Date(dataInicio.getFullYear(), dataInicio.getMonth() + 1, dataInicio.getDate() + 1);
      } else {
        dataMaximaPossivel = new Date(dataInicio.getFullYear() + 1, dataInicio.getMonth(), dataInicio.getDate() + 1);
      }

      if (dataMaximaPossivel < dataFim) {
        this.toastrService.warning(this.translate.instant(this.labelDataMaximaPossivel));
        return false;
      }

      if (dataFim > GlobalUtil.getMaxNextDate(new Date())) {
        this.toastrService.warning(this.translate.instant('DATA_MAIOR_DIA_HOJE'));
        return false;
      }

      if (dataFim <= dataInicio) {
        this.toastrService.warning(this.translate.instant('DATA_FIM_MENOR_DATA_INICIO'));
        return false;
      }

    }

    return true;
  }

  getDatasAtualizadas() {
    if (this.filtroPeriodo?.id !== GlobalUtil.PERIODO_INTERVALO) {
      const periodoAtualizado = GlobalUtil.getPeriods(new Date()).find(item => item.id === this.filtroPeriodo.id);
      this.filtroPeriodo.dataInicio = periodoAtualizado.dataInicio;
      this.filtroPeriodo.dataFim = periodoAtualizado.dataFim;
    }
    return this.filtroPeriodo;
  }

  limparSelecao() {
    this.formGroup.get('periodo').setValue(null);
    this.formGroup.get('dataInicio').setValue(null);
    this.formGroup.get('dataFim').setValue(null);
    this.filtroPeriodo = null;

    for (let i = 0; i < this.filtroPeriodos.length; i++) {
      this.filtroPeriodos[i].selected = false;
    }
    this.selectable.deselectAll();

    this.inicializarValores();
  }

  // Preparando para Refectory
  selecionarDataInicio(event) {
    this.formGroup.get('dataInicio')?.setValue(event);
    this.filtroPeriodo.dataInicio = event;
    this.filtrar.emit(this.filtroPeriodo);
  }

  selecionarDataFim(event) {
    this.formGroup.get('dataFim')?.setValue(event);
    this.filtroPeriodo.dataFim = event;
    this.filtrar.emit(this.filtroPeriodo);
  }

}
