import { Component, OnInit } from '@angular/core';
import { IonicModule, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover-component',
  templateUrl: './popover-component.component.html',
  styleUrls: ['./popover-component.component.scss'],
})
export class PopoverComponentComponent  implements OnInit {

  list:any=[
    "Edit Contact",
    "Delete Contact"
  ]

  constructor(private popCtrl: PopoverController) { }

  ngOnInit() {}

  _dismiss(item: string){
    this.popCtrl.dismiss({
      "fromPopover": item
    })
  }

}
