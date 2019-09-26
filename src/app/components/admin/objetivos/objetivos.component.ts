import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../services/common/common.service';

import { ObjetivosService } from '../../../services/admin/catalogos/objetivos.service';

//forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  statusForm;
  dataForm;

  export;
  constructor(
    private _commonService: CommonService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _objetivosService: ObjetivosService,
    private formBuilder: FormBuilder
  ) {
    this.titulo = "Objetivos";
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.page = null;//para el numero de pagina de la paginacion
    this.numberData = 10; //select para seleccionar el numero de registros de ver por pagina
    this.statusForm = false; //estatus del formulario
    this.export = false;
    this.loader = '';

    this.dataForm = {
      search: "",
      order: "desc",
      status:"",
      per_page: this.numberData ,
    }

    this.getData(this.token, this.page, this.dataForm);

  }//end ngOnInit


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


  //Mostrar numero de paginas
  onChange() {
    this.loader = '';
    console.log(this.numberData);
    this.dataForm.per_page = this.numberData;
    this.getData(this.token, this.page, this.dataForm);
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


}//end class
