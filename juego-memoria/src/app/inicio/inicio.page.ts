import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  irHacia(ruta: string)
  {
    this.router.navigate([ruta]);
  }

  cerrarSesion()
  {
    this.auth.logout()?.then(()=>{
      this.router.navigate(['/login']);
    });
  }
}
