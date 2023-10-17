import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-dificil',
  templateUrl: './dificil.page.html',
  styleUrls: ['./dificil.page.scss'],
})
export class DificilPage implements OnInit {

  email = this.auth.get_email();
  sePuedeGirar = true;
  mostrarModal = false;
  corriendo = false;
  tiempo = 0;
  interval: any;
  jugadores : any = [];
  carta = "assets/carta.png";
  path1 = "";
  path2 = "";
  id1 = 0;
  id2 = 0;
  contador = 0;
  contadorEncontrados = 0;

  imagenes = ['assets/frutas/bosque.png', 
              'assets/frutas/bosque.png', 
              'assets/frutas/fresa.png', 
              'assets/frutas/fresa.png', 
              'assets/frutas/kiwi.png', 
              'assets/frutas/kiwi.png',
              'assets/frutas/manzana.png', 
              'assets/frutas/manzana.png',
              'assets/frutas/pera.png', 
              'assets/frutas/pera.png',
              'assets/frutas/sandia.png',
              'assets/frutas/sandia.png',
              'assets/frutas/uvas.png',
              'assets/frutas/uvas.png',
              'assets/frutas/naranja.png',
              'assets/frutas/naranja.png',];

  constructor(private auth: AuthService, private firestore : Firestore, private router : Router) { }

  ngOnInit() 
  {
    this.empezarTiempo();
    this.desordenar();
  }

  darVuelta(numero: number)
  {
    if(this.sePuedeGirar)
    {
      let carta: any = document.getElementById(`${numero}`);
      carta.src = this.imagenes[numero-1];
      
      if(this.contador == 0)
      {
        this.path1 = carta.src;
        this.id1 = numero;
      }
      else
      {
        if(this.contador == 1)
        {
          this.path2 = carta.src;
          this.id2 = numero;

          this.verificarImagenes();
        }
      }

      this.contador++;
    }
  }

  empezarTiempo() 
  {
    if (!this.corriendo) 
    {
      this.interval = setInterval(() => {
        this.tiempo++;
      }, 1000);
      this.corriendo = true;
    }
  }
  
  pararTiempo() 
  {
    if (this.corriendo) 
    {
      clearInterval(this.interval);
      this.corriendo = false;
    }
  }

  verificarImagenes()
  {
    if(this.path1 != this.path2)
    {
      this.sePuedeGirar = false;
      let tarjeta1 : any = document.getElementById(`${this.id1}`);
      let tarjeta2 : any = document.getElementById(`${this.id2}`);
      setTimeout(()=>{
        tarjeta1.src = this.carta;
        tarjeta2.src = this.carta;
        this.sePuedeGirar = true;
      },1500);
    }
    else
    {
      if(this.id1 != this.id2)
      {
        this.contadorEncontrados++;

        if(this.contadorEncontrados === 8)
        {
          this.pararTiempo();

          FirestoreService.guardarFs('memoriaDificil', this.email, this.tiempo, this.firestore);
          
          FirestoreService.traerFs('memoriaDificil', this.firestore).then((data)=>{
            this.jugadores = data;
            this.jugadores.sort((a:any,b:any)=>{a - b});
            this.mostrarModal = true;
          });
        }
      }
    }

    this.path1 = "";
    this.path2 = "";
    this.id1 = 0;
    this.id2 = 0;
    this.contador = -1;
  }

  desordenar()
  {
    for (let i = this.imagenes.length - 1; i > 0; i--) 
    {
      const j = Math.floor(Math.random() * (i + 1));
      [this.imagenes[i], this.imagenes[j]] = [this.imagenes[j], this.imagenes[i]];
    }
  }

  volver()
  {
    this.setearImagenes();
    this.mostrarModal = false;
    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 1500);
  }

  setearImagenes()
  {
    for(let i = 0; i < 16; i++)
    {
      (<HTMLImageElement>document.getElementById(`${i+1}`)).src = this.carta;
    }
  }
}
