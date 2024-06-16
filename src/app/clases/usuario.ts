// user.model.ts
export class Usuario {   
    foto: string;
    apellidos: string;
    nombres: string;
    dni: string;
    correo: string;
    clave: string;
    perfil: string; // Agregar más perfiles si es necesario
  
    constructor(
      foto: string,
      apellidos: string,
      nombres: string,
      DNI: string,
      correo: string,
      clave: string,
      perfil: string,
    ) {
      this.foto = foto;
      this.apellidos = apellidos;
      this.nombres = nombres;
      this.dni = DNI;
      this.correo = correo;
      this.clave = clave;
      this.perfil = perfil;
    }
  }
  
