import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  titulo: string;
  user;
  loginForm: FormGroup;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder
  ) {
    this.titulo = 'Inicia Sesión';
  }

  ngOnInit() {
      console.log('Login Cargado');

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
    console.log(this.user);
    this.onResetForm();
  }

  onResetForm(){
    console.log("Limpiar formulario");
    this.loginForm.reset();
  }

}
