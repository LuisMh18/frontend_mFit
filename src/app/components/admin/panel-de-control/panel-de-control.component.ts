import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-de-control',
  templateUrl: './panel-de-control.component.html',
  styleUrls: ['./panel-de-control.component.scss']
})
export class PanelDeControlComponent implements OnInit {
  titulo: string;
  constructor() {
    this.titulo = 'Panel de control';
  }

  ngOnInit() {
    localStorage.setItem("ruta", "panel-de-control");
    console.log("ruta: ", localStorage.getItem("ruta"));
  }

}
