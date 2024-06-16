import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Usuario } from '../clases/usuario';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {

  constructor(private firestore: FireService) { 
    this.listaUsuarios = [];
  }

  listaUsuarios : Usuario[];

  ngOnInit() {
    this.firestore.getUsers().subscribe(usuarios => 
      {
        this.listaUsuarios = usuarios;
      })   
  }

}
