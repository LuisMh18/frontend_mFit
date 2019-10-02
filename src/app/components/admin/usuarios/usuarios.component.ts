import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

import { UsuariosService } from '../../../services/admin/catalogos/usuarios.service';

import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
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
  usuarios;
  statusForm;
  titleForm;
  btnForm;
  //form: FormGroup;
  displayForm;

  export;
  constructor(
    private _commonService: CommonService,
    private _usuariosService: UsuariosService,
    //private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
  ) {
    this.titulo = "Usuarios";
  }

  //dialog
  display: boolean = false;

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.page = null;//para el numero de pagina de la paginacion
    this.numberData = 10; //select para seleccionar el numero de registros de ver por pagina
    this.statusForm = false; //status del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      status:"",
      per_page: this.numberData,
      rol:""
    }

    this.getData(this.token, this.page, this.dataForm);

  }//end OnInit



   //buscar ---
 onSearch() {
  this.loader = '';
  this.getData(this.token, this.page = null, this.dataForm);
}

getData(token, page, data) {
  this._usuariosService.getData(token, page, data).subscribe(
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
        //this.confirmexportdata(response.data.data);
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
    rol:""
  }
  this.getData(this.token, this.page, this.dataForm);

}


  //limpiar formulario
  onResetForm(){
    console.log("Limpiar formulario");
    //this.form.reset();
    /*this.objetivos = {
      id:"",
      descripcion:"",
      notas:"",
      status:0
     }
    this.statusForm = false;*/
  }


  //modal add new
  showDialog(){
    this.displayForm = 1;
    this.statusForm = false;
    this.display = true;
    this.titleForm = "Agregar Usuario";
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


}
