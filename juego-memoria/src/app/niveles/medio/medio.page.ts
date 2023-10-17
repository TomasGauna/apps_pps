import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-medio',
  templateUrl: './medio.page.html',
  styleUrls: ['./medio.page.scss'],
})
export class MedioPage implements OnInit {

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

  imagenes = ['assets/herramientas/cerrucho.png', 
              'assets/herramientas/cerrucho.png', 
              'assets/herramientas/destornillador.png', 
              'assets/herramientas/destornillador.png', 
              'assets/herramientas/hacha.png', 
              'assets/herramientas/hacha.png',
              'assets/herramientas/llave-inglesa.png', 
              'assets/herramientas/llave-inglesa.png',
              'assets/herramientas/sierra-de-calados.png', 
              'assets/herramientas/sierra-de-calados.png'];

  constructor(private auth: AuthService, private firestore : Firestore, private router : Router) { }

  ngOnInit() 
  {
    this.empezarTiempo();
    this.desordenar();
  }

  darVuelta(numero: number)
  {
    if(numero != this.id1)
    {
      
        let carta: any = document.getElementById(`${numero}`);
        carta.src = this.imagenes[numero-1];
        
        if(this.contador == 0)
        {
          this.path1 = carta.src;
          this.id1 = numero;
          this.contador++;
        }
        else
        {
          if(this.contador == 1 && this.id1 != this.id2)
          {
            this.path2 = carta.src;
            this.id2 = numero;

            this.verificarImagenes();
          }
        }
      
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
    let tarjeta1 : any = document.getElementById(`${this.id1}`);
    let tarjeta2 : any = document.getElementById(`${this.id2}`);

    if(this.path1 != this.path2)
    {
      //this.sePuedeGirar = false;
      tarjeta1.src = this.carta;
      tarjeta2.src = this.carta;
      
      // setTimeout(()=>{
      //   tarjeta1.src = this.carta;
      //   tarjeta2.src = this.carta;
      //   this.sePuedeGirar = true;
      // },1500);
    }
    else
    {
      if(this.id1 != this.id2)
      {
        this.contadorEncontrados++;
        tarjeta1.pointerEvents='none';
        tarjeta2.pointerEvents='none';
        if(this.contadorEncontrados === 5)
        {
          this.pararTiempo();

          FirestoreService.guardarFs('memoriaMedio', this.email, this.tiempo, this.firestore);
          
          FirestoreService.traerFs('memoriaMedio', this.firestore).then((data)=>{
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
    this.contador = 0;
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
    // setTimeout(() => {
      this.router.navigate(['/inicio']);
    // }, 1500);
  }

  setearImagenes()
  {
    for(let i = 0; i < 10; i++)
    {
      (<HTMLImageElement>document.getElementById(`${i+1}`)).src = this.carta;
    }
  }
}
