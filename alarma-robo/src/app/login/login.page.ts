import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  implements OnInit {
  correo = '';
  clave = ''; 
  mostrarSpinner = false;
  mensajeError = '';
  mostrarErrora = false;

  constructor(private auth: AuthService, private router: Router, private toastController: ToastController) { }

  ngOnInit() {}

  ingresar()
  {
    this.mostrarSpinner = true;
    this.auth.login(this.correo, this.clave)
      ?.then(response =>
      {
        console.log("redireccionando...");
        this.correo = '';
        this.clave = '';
        setTimeout(()=>{
          this.mostrarSpinner = false;
          this.router.navigate(['/principal']);
        }, 1500);
        
      })
      .catch(error =>
      {
        setTimeout(()=>{
          console.log(error);
          this.mostrarSpinner = false;
          switch(error.code)
          {
            case 'auth/invalid-email':
              this.mensajeError =  "Correo inválido.";
            break;
            case 'auth/missing-password':
              this.mensajeError = "Contraseña inválida.";
            break;
            case 'auth/invalid-login-credentials':
              this.mensajeError = 'Correo y/o contraseña incorrectos.';
            break;
          }
          this.mostrarError();
          console.log(error);
        }, 1500);
      });
  }

  mostrarError() 
  {
    const errorPopup : any = document.querySelector('.error-popup');
    errorPopup.classList.add('active');
  
    setTimeout(() => {
      errorPopup.classList.remove('active');
    }, 3000);
  }

  cambiarUsuario(usuarioElegido: string)
  {
    switch(usuarioElegido)
    {
      case 'admin':
        this.correo = 'admin@admin.com';
        this.clave = '111111'; 
      break;
      case 'invitado':
        this.correo = 'invitado@invitado.com';
        this.clave = '222222'; 
      break;
      case 'usuario':
        this.correo = 'usuario@usuario.com';
        this.clave = '333333'; 
      break;
      case 'tester':
        this.correo = 'tester@tester.com';
        this.clave = '555555'; 
      break;
      case 'anonimo':
        this.correo = 'anonimo@anonimo.com';
        this.clave = '444444'; 
      break;
    }
  }

  limpiarCampos()
  {
    this.correo = '';
    this.clave = '';
  }

}
