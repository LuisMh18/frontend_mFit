import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  titulo: string;
  constructor() {
    this.titulo = 'Dashboard';
  }

  ngOnInit() {
    localStorage.setItem("ruta", "dashboard");
    console.log("ruta: ", localStorage.getItem("ruta"));
  }

}
