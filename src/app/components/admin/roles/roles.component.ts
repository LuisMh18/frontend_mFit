import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

import { RolesService } from '../../../services/admin/catalogos/roles.service';

import {ConfirmationService} from 'primeng/api';

//forms
//import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
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
  rol;
  statusForm;
  titleForm;
  btnForm;
  //form: FormGroup;
  displayForm;
  export;

  constructor(
    private _commonService: CommonService,
    private _rolesService: RolesService,
    //private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
  ) { 
    this.titulo = "Rol";
  }

  //dialog
  display: boolean = false

  ngOnInit() {

    this.token = localStorage.getItem('token');

    this.rol = {
     id:"",
     nombre:"",
    }

    this.page = null;//para el numero de pagina de la paginacion
    this.numberData = 10; //select para seleccionar el numero de registros de ver por pagina
    this.statusForm = false; //status del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      per_page: this.numberData ,
    }


    //reglas de validacion
    /*this.form = this.formBuilder.group({
      nombre: [
        '',
       [
          Validators.required,
          Validators.minLength(3),
          this.noWhitespaceValidator
      ]
      ]

    });*/


    this.getData(this.token, this.page, this.dataForm);

  }

//validar espacios en blanco
/*noWhitespaceValidator(control: FormControl) {
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
    this._rolesService.getData(token, page, data).subscribe(
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
      per_page: this.numberData,
    }
    this.getData(this.token, this.page, this.dataForm);

  }


    //limpiar formulario
    onResetForm(){
      console.log("Limpiar formulario");
      this.rol = {
        id:"",
        nombre:"",
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
    this._rolesService.getAll(token).subscribe(
      response => {
        this._commonService.exportdata(response.data, ["Id", "Nombre", "Fecha"], "Rol_");
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
      this._commonService.exportdata(data, ["Id", "Nombre", "Fecha"], "Rol_");
      this.export = false;
    }
  
  
  }
  
    //modal add new
    showDialog(){
      this.displayForm = 1;
      this.statusForm = false;
      this.display = true;
      this.titleForm = "Agregar Rol";
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
      document.getElementById("nombre").className = "form-group";
      document.getElementById("icon_nombre").className = "";
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
    this.rol = {
      nombre:formValue.nombre
    }
    //console.log("data: ", this.rol);
    //this.validate();

    //si es valido
    //if(this.form.valid) {
      this._rolesService.add(this.token, this.rol).subscribe(
        response => {
          if (response.error == 'validate') {
            let data = Object.values(response.errors);
            console.log("data");
            console.log(data);
            var i = 0;
            for (let err of data) {
              console.log(err);
              console.log(response.field[i]);
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
    this.titleForm = "Editar Rol";;
    this.btnForm = "Actualizar";

    this._rolesService.edit(this.token, id).subscribe(
      response => {
        this.rol = {
           id:response.data.id,
           nombre:response.data.nombre
        }

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

    this.rol = {
       id:this.rol.id,
       nombre:formValue.nombre
    }
    //this.validate();

    //if(this.form.valid) {
      this._rolesService.update(this.token, this.rol).subscribe(
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



  //  }

  }


    //Eliminar
delete(object){
  console.log(object);
  this.confirmationService.confirm({
    message: '¿Estás seguro de eliminar el rol ' +object.nombre+' ?',
    header: 'Eliminar Rol',
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
    this._rolesService.delete(this.token, id).subscribe(
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
 /* validate(){
    this._commonService.validateForm(this.form);
  }*/


}//end class
