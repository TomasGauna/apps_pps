import { Component } from '@angular/core';
import { getStorage, ref, uploadString } from 'firebase/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  algo()
  {
    let storage = getStorage();
    alert(storage)
  }

}
