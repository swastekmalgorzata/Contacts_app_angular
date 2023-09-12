import { Component } from '@angular/core';



export let Settings ={
  isDarkmode: false,
  isSurnameFilter: true,
  isSurnameFirst: true

}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {}

  updateSettings(darkmode: boolean, surnameFilter: boolean, isSurnameFirst: boolean){

  }
}
