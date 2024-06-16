import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private firestore: FireService, 
    private router: Router) {}
  
  usuarioPerfil: any;

  async ngOnInit(): Promise<void> {
    const id = await this.firestore.getUserUid() || "";
    console.log(id);
    this.usuarioPerfil = await this.firestore.getUserNameByUID(id);
    console.log(this.usuarioPerfil);
  }

  altaUsuario() {
    // Lógica para dar de alta un usuario aquí
    // Puedes redirigir a la página de alta de usuario o mostrar un modal, por ejemplo.
    this.router.navigate(['/alta']);
  }

  irAListadoUsuarios() {
    // Redirigir a la página del listado de usuarios
    this.router.navigate(['/listado']);
  }

  logout()
  {
    this.firestore.logOut();
    this.router.navigateByUrl("/login");
  }
}
