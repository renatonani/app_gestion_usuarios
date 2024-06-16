import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Usuario } from '../clases/usuario';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.page.html',
  styleUrls: ['./alta.page.scss'],
})
export class AltaPage implements OnInit {

  constructor(private firestore: FireService, public toastController : ToastController) { 
    this.fotoSubida = "";
    this.rePassword = "";
    this.user = new Usuario("","","","","","","");
    this.registroFallido = "";    
    this.fotoASubir = "";
    this.listaUsuarios = [];
  }

  fotoASubir : string;
  listaUsuarios : Usuario[];
  registroFallido : string;
  rePassword : string;
  user : Usuario;
  fotoSubida : string;
  usandoQR : boolean = false;

  async ngOnInit() {
    this.firestore.getUsers().subscribe(usuarios => 
      {
        this.listaUsuarios = usuarios;
      })   
  }
    
  async leerQR()
  {
    await BarcodeScanner.checkPermission({force : true})
    this.usandoQR = true;
    await BarcodeScanner.hideBackground();
   
    document.querySelector('body')?.classList.add('scanner-active');
   
    const datos = await BarcodeScanner.startScan()
    console.log("datos:", datos);
    if(datos?.hasContent)
    {
      await BarcodeScanner.showBackground();      
      document.querySelector('body')?.classList.remove('scanner-active');
      this.usandoQR = false;
      let datosSeparados = datos.content.split("@");
      this.user.apellidos = (datosSeparados[1]);
      this.user.nombres = (datosSeparados[2]);
      this.user.dni = (datosSeparados[4]);
    }    
  }  

  async cargarFotos()
  {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    })
    if(image.base64String != undefined)
    {
      this.fotoSubida = image.base64String;
    }
  }

  subirUsuario()
  {
    if(this.user.clave == "" || this.user.correo == "" || this.fotoSubida == "" || this.rePassword == "" || this.user.dni == "" || this.user.apellidos == "" || this.user.nombres == "")
    {
      this.imprimirToast("Hay campos sin completar");
      return;
    }
    if(this.user.clave != this.rePassword)
    {
      this.imprimirToast("La contraseñas deben ser iguales");
      return;
    }
    if(isNaN(Number(this.user.dni)) || Number(this.user.dni) >= 100000000  || Number(this.user.dni) <= 9999999)
    {
      this.imprimirToast("El formato del DNI no es correcto");
      return;
    }
    if(this.user.clave.length < 6)
    {
      this.imprimirToast("La contraseña es demasiado corta");
      return;
    }
    if(!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.user.correo))) 
    {
      // La variable 'email' NO tiene un formato válido de correo electrónico
      this.imprimirToast("¡El formato del correo no es válido!");
      return;
    }
    for(let i = 0; i < this.listaUsuarios.length; i++)
    {
      if(this.user.dni == this.listaUsuarios[i].dni)
      {
        this.imprimirToast("El DNI ya está en uso");
        return;
      }
      if(this.user.correo == this.listaUsuarios[i].correo)
      {
        this.imprimirToast("El correo ya está en uso");
        return;
      }
    }

    let objetoASubir = 
    {
      apellidos: this.user.apellidos,
      correo: this.user.correo,
      dni: this.user.dni,
      foto: this.fotoSubida,
      id: "idprovisional",
      nombres: this.user.nombres,
      password: this.user.clave
    }
    console.log(objetoASubir);

    this.firestore.createUser(this.user.correo,this.user.clave);
    this.firestore.subirUser(objetoASubir);
    this.imprimirToast("¡Usuario registrado correctamente!")
  }

  async imprimirToast(mensaje:string)
  {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    })
    await toast.present();
  }
}
