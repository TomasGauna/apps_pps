import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

const routes: Routes = [
  {
    path: 'home', component: SplashScreenComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'facil',
    loadChildren: () => import('./niveles/facil/facil.module').then( m => m.FacilPageModule)
  },
  {
    path: 'medio',
    loadChildren: () => import('./niveles/medio/medio.module').then( m => m.MedioPageModule)
  },
  {
    path: 'dificil',
    loadChildren: () => import('./niveles/dificil/dificil.module').then( m => m.DificilPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
