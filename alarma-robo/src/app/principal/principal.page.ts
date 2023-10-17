import { Component, OnInit } from '@angular/core';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  showModal = false;
  password = '';
  alarmaActiva = false;
  threshold = 2;
  sensitivity = 3;
  lastXAcceleration = 0;
  alarmaBloqueada = false;
  flashlightAvailable = false;
  flashlightEnabled = false;
  botonDeshabilitado = false;
  path = 'assets/sonidos/';

  constructor(private flashlight: Flashlight, private vibration: Vibration, private screenOrientation: ScreenOrientation, private auth: AuthService) {}

  ngOnInit() 
  {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.handleDeviceMotion.bind(this), false);
    } else {
      console.warn('El dispositivo no es compatible con DeviceMotion.');
    }

    this.flashlight.available()
    .then((isAvailable) => {
      this.flashlightAvailable = isAvailable;
    })
    .catch((error) => {
      console.error('Error al verificar la disponibilidad de la linterna: ', error);
    });

    this.screenOrientation.onChange().subscribe(() => 
    {
      if(this.alarmaActiva && !this.alarmaBloqueada)
      {
        if (this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY) 
        {
          this.vibration.vibrate(5000);
          this.reproducirAudio('horizontal', this.path + "horizontal.mp3", 5000);
          this.bloquearAlarma(5000);
        } 
        else
        {
          if (this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY) 
          {
            this.interactuarFlash(true);
            this.reproducirAudio('vertical', this.path + 'vertical.mp3', 5000);
            this.bloquearAlarma(5000);
            setTimeout(()=>{
              this.interactuarFlash(false);
            }, 5000);
          }
        }
      }
    });
  }

  handleDeviceMotion(event: DeviceMotionEvent)//////////////////REVISAR POR QUE LA LUZ PARPADEA, NO SUENA Y NO SE PUEDE VOLVER A PORTRAIT
  {
    if(this.alarmaActiva && !this.alarmaBloqueada) 
    {
      let acceleration: any = event.accelerationIncludingGravity;
      let xAcceleration = acceleration.x;
      let smoothedAcceleration = this.smoothAcceleration(xAcceleration);
      
      
        if (Math.abs(smoothedAcceleration) > this.threshold) 
        {
          let mensaje = smoothedAcceleration > 0 ? 'derecha' : 'izquierda';
          this.reproducirAudio('lado', this.path + mensaje + ".mp3");
          this.bloquearAlarma(2000);
        }
      

      //this.lastXAcceleration = smoothedAcceleration;
    }
  }

  smoothAcceleration(acceleration: number): number 
  {
    return this.lastXAcceleration * (1 - this.sensitivity) + acceleration * this.sensitivity;
  }

  bloquearAlarma(ms: number) 
  {
    this.alarmaBloqueada = true;
    setTimeout(() => {
      this.alarmaBloqueada = false;
    }, ms);
  }

  activarAlarma() 
  {
    if(this.alarmaActiva)
    {
      this.showModal = true;
      this.alarmaBloqueada = true;
    }
    {
      this.alarmaActiva = true;
    }
  }

  interactuarFlash(accion: boolean)
  {
    if (this.flashlightAvailable) 
    {
      if (accion) {
        this.flashlight.switchOn()
          .then(() => {
            this.flashlightEnabled = true;
          })
          .catch((error) => {
            alert('Error al activar la linterna: ' + error);
          });
      } else {
        this.flashlight.switchOff()
          .then(() => {
            this.flashlightEnabled = false;
          })
          .catch((error) => {
            alert('Error al desactivar la linterna: ' + error);
          });
      }
    }
  }

  closeModal() 
  {
    this.showModal = false;
    this.alarmaBloqueada = false;
    this.password = '';
  }

  submitModal() 
  {
    let ret = this.password === this.auth.get_password();

    if(!ret)
    {
      this.interactuarFlash(true);
      this.vibration.vibrate(5000);
      this.reproducirAudio('error', this.path + 'error.mp3', 5000);
      this.botonDeshabilitado = true;
      this.mostrarError();
      setTimeout(()=>{
        this.interactuarFlash(false);
        this.botonDeshabilitado = false;
      }, 5000);
    }
    else
    {
      this.alarmaActiva = false;
      this.interactuarFlash(false);
      this.vibration.vibrate(0);
      this.closeModal();
    }
  }

  reproducirAudio(id: string, path: string, ms?: number) 
  {
    let audio = document.getElementById(id) as HTMLAudioElement;
    audio.src = path;
    audio.play();

    if(ms != null)
    {
      setTimeout(()=>{
        audio.pause;
      }, ms);
    }
  }

  mostrarError() 
  {
    const errorPopup : any = document.querySelector('.error-popup');
    errorPopup.classList.add('active');
  
    setTimeout(() => {
      errorPopup.classList.remove('active');
    }, 3000);
  }
}
