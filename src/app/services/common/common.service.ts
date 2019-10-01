import { Injectable } from '@angular/core';

//notificaciones
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NotificationsService } from 'angular2-notifications';


//https://www.npmjs.com/package/angular5-csv
//import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  identity;//para guardar los datos del usuario logueado
  token;
  public pageCurrent;
  public pagePrev;
  public pages;
  public page;
  public currentPage;
  public pageNext;
  public pNext;
  public tipo;
  constructor(
    private notif: NotificationsService,//notificaciones
  ) { }



  //exportar
  exportdata(data, headers, file){
    //si no ha resultados
    if(!data.length){
      this.msj('warn', 'No se encontraron resultados!');
      return false;
    }

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      //showTitle: true,
      useBom: true,
      /*noDownload: true,*/
      headers: [headers]
    };

    let f = new Date();
    let filename = file+f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

    new Angular5Csv(data, filename, options);

  }


  paginacion(response) {

    if (response.data.current_page == 1) {
      this.pageCurrent = 'null';
      this.pagePrev = 'null';
    } else {
      this.pageCurrent = 1;
      this.pagePrev = response.data.current_page - 1;
    }

    this.currentPage = response.data.current_page;

    //--------------------------------------------------------------------------------------------------------------------------------------
    /*Si el total de los datos es menor o igual a 5 y la variable next_page_url es igual a null ejecutamos esta parte Nota: no se porq aveces la next_page_url viene en null
        por eso no la tome en cuenta a la hora de ir a la pagina siguiente y lo q hice fue a la pagina actual sumarle uno para q e esta manera siempre nos mande a la siguiente pagina*/
    if (response.data.last_page <= 5) {
      //total de paginas
      this.pages = [];
      for (let i = 1; i <= response.data.last_page; i++) {
        this.page = i;
        this.pages.push(i);
      }

    } else {
      let paginacion = 5; //siepre que se liste por primera ves la paginación tendra un valor por defecto de 5
      let indice = 1; //y el indice un valor de 1
      if (response.data.current_page > 3) { //comprobamos su la pagina actual es mayor a 3 para que si es mayor de esta manera vaya cambianod dinamicamente los resultados de la pagina
        if (response.data.last_page - response.data.current_page >= 2) {//si el resultado de la resta da un mayor a 2 o igual siempre habra dos paginas tanto a la izquierda como a la derecha de la pagina actual
          paginacion = response.data.current_page + 2;
          indice = response.data.current_page - 2;
          console.log('dos de cada lado');
        } else if (response.data.last_page - response.data.current_page == 1) { //en caso de que la diferencia sea igual a 1 quiere decir que estamos en la penultima pagina
          paginacion = response.data.current_page + 1;
          indice = response.data.current_page - 3;
          console.log('penultima pagina');
        } else { //y en caso de que el resultado sea 0 quiere decir que estamos en la ultima pagina
          console.log('ultima pagina');
          paginacion = response.data.current_page;
          indice = response.data.current_page - 4;
        }

      }

      //total de paginas
      this.pages = [];
      for (let i = indice; i <= paginacion; i++) {

        this.pages.push(i);

      }
    }


    //------------------------------------------------------------------------------------------------------------------------------------------


    if (response.data.current_page == response.data.last_page) {
      this.pNext = 'null';
      this.pageNext = 'null';
    } else {
      this.pNext = response.data.current_page + 1;
      this.pageNext = response.data.last_page;
    }


    return [
      {
        pages: this.pages,
        pageCurrent: this.pageCurrent,
        pagePrev: this.pagePrev,
        pNext: this.pNext,
        pageNext: this.pageNext,
        currentPage: this.currentPage,
      }
    ];


  }

  //metodo si el token expira, limpiamos el localStorage y redireccionamos al login
token_expired() {
  localStorage.setItem('sesion', 'token_expired');//sesion
  localStorage.removeItem('token');
  localStorage.removeItem('identity');
  this.token = null;
  this.identity = null;
  this.msj('warn', '<div class="font_notif">Tu sesión expiro, ingresa otra vez!</div>');
  setInterval(() => {
    window.location.href = '/login';
  }, 2000);
}


//validar formulario
/*validateForm(form){

  for (const field in form.controls) { // 'field' is a string
    //console.log("field:" + field);
    const control = form.get(field); // 'control' is a FormControl
    //console.log(form.get(field));//
    //console.log("control: "+control);
    let form_group = document.getElementById(field);
    let form_icon = document.getElementById("icon_"+field);
    if(control.status == 'INVALID'){

      form_group.className = "form-group has-feedback has-error";
      form_icon.className = "glyphicon glyphicon-remove form-control-feedback";

      if(control.errors.required){
        this.msj('error', `El campo ${field} es requerido.`);
      }

      if(control.errors.minlength){
        this.msj('error', `El campo ${field} debe de tener al menos 3 caracteres.`);
      }
      if(control.errors.email){
        this.msj('error', `El formato del ${field} es inválido.`);
      }

      if(!control.errors.required && !control.errors.minlength && control.errors.whitespace){
        this.msj('error', `El campo ${field} no puede estar conformado de espacios en blanco.`);
      }
    } else {
      form_group.className = "form-group has-feedback has-success";
      form_icon.className = "glyphicon glyphicon-ok form-control-feedback";
    }

  }
}*/


  //Tipos de mensajes
  //error
  //info
  //Warning
  //success
  msj(tipo, msj){
    console.log("tipo: ", tipo);
    switch(tipo) {
      case 'success':
      this.notif.success(
        'Success',
         msj,
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 50,
        }
      );
      break;
      case 'warn':
      this.notif.warn(
        'Warning',
        msj,
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 50
        }
      );
      break;
      case 'info':
      this.notif.info(
        'Info',
        msj,
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 50
        }
      );
      break;
      case 'error':
      this.notif.error(
        'Error',
        msj,
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 50
        }
      );
      break;
      case 'alert':
      this.notif.alert(
        'Alert',
        msj,
        {
          timeOut: 3000,
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 50
        }
      );
      break;
    }


  }


}
