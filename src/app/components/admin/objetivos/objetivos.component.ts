import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

import { ObjetivosService } from '../../../services/admin/catalogos/objetivos.service';

import {ConfirmationService} from 'primeng/api';

//forms
//import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {
  titulo:string;
  numberData;//variable para el numero de registros que queremos obtener
  token;

  //variables para la tablita de resultados
  infoPaginacion;
  dataobjetc;
  paginacion;
  pages;
  pageCurrent;
  pagePrev;
  pNext;
  pageNext;
  currentPage;
  loader;
  page;
  dataForm;

  //formulario
  objetivos;
  statusForm;
  titleForm;
  btnForm;
  //form: FormGroup;
  displayForm;

  export;
  constructor(
    private _commonService: CommonService,
    private _objetivosService: ObjetivosService,
    //private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
  ) {
    this.titulo = "Objetivos";
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.objetivos = {
     id:"",
     descripcion:"",
     notas:"",
     status:0
    }

    this.page = null;//para el numero de pagina de la paginacion
    this.numberData = 10; //select para seleccionar el numero de registros de ver por pagina
    this.statusForm = false; //status del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      status:"",
      per_page: this.numberData ,
    }


    //reglas de validacion
    /*this.form = this.formBuilder.group();*/


    this.getData(this.token, this.page, this.dataForm);

  }//end ngOnInit


  //validar espacios en blanco
 /* noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }*/


 //buscar ---
 onSearch() {
    this.loader = '';
    this.getData(this.token, this.page = null, this.dataForm);
  }

  getData(token, page, data) {
    this._objetivosService.getData(token, page, data).subscribe(
      response => {
        console.log(response);
        if(this.export === false){
          this.infoPaginacion = `Mostrando registros del ${response.data.from} al ${response.data.to} de un total de ${response.data.total} registros`;
          this.dataobjetc = response.data.data;
          this.paginacion = this._commonService.paginacion(response);
          this.pages = this.paginacion[0].pages;
          this.pageCurrent = this.paginacion[0].pageCurrent;
          this.pagePrev = this.paginacion[0].pagePrev;
          this.pNext = this.paginacion[0].pNext;
          this.pageNext = this.paginacion[0].pageNext;
          this.currentPage = this.paginacion[0].currentPage;
          this.loader = 'hidden';
        } else {
          this.confirmexportdata(response.data.data);
        }

      }, error => {
        if (error.statusText == 'Unauthorized') {
          this._commonService.token_expired();
        } else {
          console.log('Error 500');
          console.log(<any>error);
          this._commonService.msj('error', 'Erro interno del servidor');
        }
      }
    );

  }


  nPage(page) {
    if (page != 'null') {
      this.loader = '';
      this.page = page;
      this.getData(this.token, page, this.dataForm);
    }

  }

  //Mostrar numero de paginas
  onChange() {
    this.loader = '';
    console.log(this.numberData);
    this.dataForm.per_page = this.numberData;
    this.getData(this.token, this.page = null, this.dataForm);
  }


  //Refrescar tabla
  refresh() {
    this.loader = '';
    this.numberData = 10;
    this.page = null;
    this.dataForm = {
      search: "",
      order: "desc",
      status: "",
      per_page: this.numberData,
    }
    this.getData(this.token, this.page, this.dataForm);

  }

  //limpiar formulario
  onResetForm(){
    console.log("Limpiar formulario");
    //this.form.reset();
    this.objetivos = {
      id:"",
      descripcion:"",
      notas:"",
      status:0
     }
    this.statusForm = false;
  }

  //export
  exportData(){
    this.displayForm = 0;
    this.onResetForm();
    this.display = true;
    this.titleForm = "Exportar";
  }


getAll(token) {
  this._objetivosService.getAll(token).subscribe(
    response => {
      this._commonService.exportdata(response.data, ["Id", "Descripción", "Comentarios", "Estatus", "Fecha"], "Objetivo_");
    }, error => {
      if (error.statusText == 'Unauthorized') {
        this._commonService.token_expired();
      } else {
        console.log('Error 500');
        console.log(<any>error);
        this._commonService.msj('error', 'Erro interno del servidor');
      }
    }
  );

}

exportdata(d){
  if(d === 1){
    this.getAll(this.token);
  } else {
    this.confirmexportdata(undefined);
  }
  this.display = false;
}



confirmexportdata(data){
  if(data === undefined){
    this.export = true;
    this.getData(this.token, this.page, this.dataForm);
  } else {
    this._commonService.exportdata(data, ["Id", "Descripción", "Comentarios", "Estatus", "Fecha"], "Objetivo_");
    this.export = false;
  }


}

  //modal add new
  showDialog(){
    this.displayForm = 1;
    this.statusForm = false;
    this.display = true;
    this.titleForm = "Agregar Objetivo";
    this.btnForm = "Agregar";
  }

  //cerrar modal
  close(event){
    if(this.displayForm == 0){
      return false;
    }
    console.log(event.target);
    if (event.target.className === "pi pi-times") {
      this.clearForm();
      this.closeModal();
    }
}

  closeModal(){
    this.onResetForm();
    this.clearForm();
    this.display = false;
  }

  //limpiamos los msjs de error oh de success
  clearForm(){
    document.getElementById("descripcion").className = "form-group";
    document.getElementById("icon_descripcion").className = "";
  }

  //cambiar status
  changeStatusForm(status){
    console.log(status);
    this.statusForm = !status;
    console.log(this.statusForm);
  }


  //add and update
  submit(formValue: any, action){
    console.log("action: ", action);
    if(action === 'Agregar'){
      this.add(formValue);
    } else {
      this.update(formValue);
    }

  }

  //add
  add(formValue){
    this.objetivos = {
      descripcion:formValue.descripcion,
      notas:formValue.notas,
      status:(this.statusForm == true) ? 1 : 0,
    }
    console.log("data: ", this.objetivos);
    //this.validate();

    //si es valido
    //if(this.form.valid) {
      this._objetivosService.add(this.token, this.objetivos).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            var i = 0;
            for (let err of data) {
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
              document.getElementById(response.field[i]).className = "form-group has-feedback has-error";
              document.getElementById(`icon_${response.field[i]}`).className = "glyphicon glyphicon-remove form-control-feedback";
              i++;
            }

          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
            this.closeModal();
            this.getData(this.token, this.page, this.dataForm);
            this._commonService.msj('success', response.message);
          }

        }, error => {
          console.log(<any>error);
        }
      );



    //}

  }


  //edit
  edit(id) {
    this.displayForm = 1;
    this.display = true;
    this.titleForm = "Editar Objetivo";;
    this.btnForm = "Actualizar";

    this._objetivosService.edit(this.token, id).subscribe(
      response => {
        this.objetivos = {
           id:response.data.id,
           descripcion:response.data.descripcion,
           notas:response.data.notas,
           status:response.data.status
        }

        this.statusForm = (response.data.status === 1) ? true : false;

      }, error => {
        if(error.statusText == 'Unauthorized'){
          this._commonService.token_expired();
        } else {
          console.log(<any>error);
        }
      }
    );
  }

  update(formValue){

    this.objetivos = {
       id:this.objetivos.id,
       descripcion:formValue.descripcion,
       notas:formValue.notas,
       status:(this.statusForm === true) ? 1 : 0
    }
    //this.validate();

    //if(this.form.valid) {
      this._objetivosService.update(this.token, this.objetivos).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            var i = 0;
            for (let err of data) {
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
              document.getElementById(response.field[i]).className = "form-group has-feedback has-error";
              document.getElementById(`icon_${response.field[i]}`).className = "glyphicon glyphicon-remove form-control-feedback";
              i++;
            }

          } else if (response.error == true){
            this._commonService.msj('warn', response.message);
          } else if (response.error.statusText == 'Unauthorized') {
            this._commonService.token_expired();
          } else {
            this.closeModal();
            this.getData(this.token, this.page, this.dataForm);
            this._commonService.msj('success', response.message);
          }

        }, error => {
          console.log(<any>error);
        }
      );



    //}

  }


  //Eliminar
delete(object){
  console.log(object);
  this.confirmationService.confirm({
    message: '¿Estás seguro de eliminar el objetivo ' +object.descripcion+' ?',
    header: 'Eliminar Objetivo',
    icon: 'pi pi-info-circle',
    accept: () => {
        this.confirmdelete(object.id);
    },
    reject: () => {
        console.log("no");
    }
  });
}


confirmdelete(id){
    this._objetivosService.delete(this.token, id).subscribe(
      response => {
        this._commonService.msj('success', response.message);
        this.getData(this.token, this.page, this.dataForm);
      }, error => {
        if (error.statusText == 'Unauthorized') {
          this._commonService.token_expired();
        } else {
          console.log('Error 500');
         console.log(<any>error);
         this._commonService.msj('error', 'Erro interno del servidor');
       /* setInterval(() => {
          location.reload();
        }, 1000); */

        }
      }
    );

}

  //validar formulario
  /*validate(){
    this._commonService.validateForm(this.form);
  }*/


}//end class
