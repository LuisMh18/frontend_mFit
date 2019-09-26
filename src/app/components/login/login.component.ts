import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

//los (..) es para salir de una carpeta, saimos de la carpeta login, luego de la carpeta components y entramos en la carpeta services donde tenemos nuestros servicios
import { CommonService } from '../../services/common/common.service';
import { LoginService } from '../../services/login/login.service';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  titulo: string;
  user;
  loginForm: FormGroup;
  identity;//para guardar los datos del usuario logueado
  token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _loginService: LoginService
  ) {
    this.titulo = 'Inicia Sesión';
  }

  ngOnInit() {
      console.log('Login Cargado');

      this.token = localStorage.getItem('token');
      console.log(this.token);
      //comprobamos si existe la variable token quiere decir que estamos logueados y restringimos el acceso al login
      if (this.token){
        this._router.navigate([localStorage.getItem("ruta")]); //redirigimos a la home
      }
      localStorage.setItem("ruta", "login");
      console.log("ruta: ", localStorage.getItem("ruta"));

      this.user = {
        "email": "",
        "password": ""
      }

      //reglas de validación
      this.loginForm = this.formBuilder.group({
        email: [
          '',
         [
           Validators.required,
           Validators.email
         ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],

      });

  }//end ngOnInit

  //accceder
  onSubmit() {

    console.log("Acceder");
    //console.log(this.user);
    //validamos el formulario
    this.validate();

    //si el formulario es valido
    console.log(this.loginForm.valid);
    if(this.loginForm.valid) {
      //para mostarr la barra de cargando que aparece en la parte superior de la pantalla
      $.mpb("show",{value: [0,100],speed: 8});
      let interval = setInterval(() => {
        $.mpb("show",{value: [0,100],speed: 8});
      }, 1200);

      //deshabilitamos el botón de Acceder
      document.getElementById("acceder").className = "btn btn-info btn-block disabled";
      //console.log(this.user);
      //llamamos al servicio del login y le pasamos los datos del usuario
      this._loginService.signup(this.user).subscribe(
        response => {
          console.log(response);
          //habilitamos el botón de acceder
          document.getElementById("acceder").className = "btn btn-info btn-block";

          //limpiamos la barra de cargando
          clearInterval(interval);
          setTimeout(() => {
              $(".mpb").fadeOut(200,function(){
                  $(this).remove();
              });
        }, 500);
          if (response.error == 'validate') {
            //converitmos el objeto en un array para acceder mas facil  a sus valores
            let data = Object.values(response.errors);
            console.log(data);
            for (let err of data) {
              console.log("validate: " + err[0]);
              this._commonService.msj('error', `<div class="font_notif">${err[0]}</div>`);
            }

          } else {
            if (response.error == true) {
              document.getElementById("form-group-email").className = "form-group has-feedback has-error";
              document.getElementById("email").className = "form-control input-error";
              document.getElementById("icon_email").className = "glyphicon glyphicon-remove form-control-feedback";

              document.getElementById("form-group-password").className = "form-group has-feedback has-error";
              document.getElementById("password").className = "form-control input-error";
              document.getElementById("icon_password").className = "glyphicon glyphicon-remove form-control-feedback";

              this._commonService.msj('error', response.message);
            } else { //si no hay errores
              document.getElementById("form-group-email").className = "form-group has-feedback has-success";
              document.getElementById("email").className = "form-control input-success";
              document.getElementById("icon_email").className = "glyphicon glyphicon-ok form-control-feedback";

              document.getElementById("form-group-password").className = "form-group has-feedback has-success";
              document.getElementById("password").className = "form-control input-success";
              document.getElementById("icon_password").className = "glyphicon glyphicon-ok form-control-feedback";
              this._commonService.msj('success', 'Te has logueado correctamente!');

              this.token = response.token;
              this.identity = response.data;
              // como es un objeto lo convertimos en una cadena de texto con JSON.stringify para poder guardarlo en el local storage
              localStorage.setItem('identity', JSON.stringify(this.identity));
              localStorage.setItem('token', this.token);
              /* Rol de usuarios ------
              * 1 - Administrador
              * 2 - Usuario
              */
              //comprobamos el rol del usuario
              if (this.identity.rol_id === 1){
                console.log(this.identity.rol_id);
                console.log('Eres administrador');
                window.location.href = 'dashboard';
              } else {
                console.log(this.identity.rol_id);
                console.log('Eres usuario');
                window.location.href = 'panel-de-control';
              }
              //this._router.navigate(['/']); //redirigimos a la home
              //window.location.href = 'reservations';
            }

          }

        }, error => {
          console.log(<any>error);
        }
      );
    }

  }//end onSubm+

  //limpiar formulario
  onResetForm(){
    console.log("Limpiar formulario");
    this.loginForm.reset();
  }


  //funcion para mostrar los errores del formulario
  validate(){
    console.log(this.loginForm.controls);//contiene todo lo del formulario, como los tipos de errores, etc.
    for (const field in this.loginForm.controls) { // 'field' is a string
      const control = this.loginForm.get(field); // 'control' is a FormControl
      console.log(control);
      console.log("campo: ",field);//nombre del campo del formulario

      let input = document.getElementById(field);
      let form_group = document.getElementById("form-group-"+field);
      let form_icon = document.getElementById("icon_"+field);
      //validamos si los datos del formulario son invalidos
      console.log(control.status);
      if(control.status == 'INVALID'){

        form_group.className = "form-group has-feedback has-error";
        input.className = "form-control input-error";
        form_icon.className = "glyphicon glyphicon-remove form-control-feedback";

        //si los campos requeridos estan vacios
        console.log("required: ",control.errors.required);
        if(control.errors.required){
          if(field == 'password'){ //llamamos al servicio _commonService
            this._commonService.msj('error', `El campo contraseña es requerido.`);
          } else {
            this._commonService.msj('error', `El campo ${field} es requerido.`);
          }
        }

        if(control.errors.minlength){
          this._commonService.msj('error', `El campo contraseña debe de tener al menos 6 caracteres.`);
        }

        if(control.errors.email){
          let erros_email = Object.values(control.errors);
          if(erros_email.length == 1){
            this._commonService.msj('error', `El formato del ${field} es inválido.`);
          }
        }
      } else { //si son validos
        form_group.className = "form-group has-feedback has-success";
        input.className = "form-control input-ok";
        form_icon.className = "glyphicon glyphicon-ok form-control-feedback";
      }

    }
  }


}
