import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphabetScrollComponent } from './alphabet-scroll/alphabet-scroll.component';
import { PopoverComponentComponent } from './popover-component/popover-component.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [AlphabetScrollComponent, PopoverComponentComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [AlphabetScrollComponent, PopoverComponentComponent]
})
export class SharedComponentsModule { }
