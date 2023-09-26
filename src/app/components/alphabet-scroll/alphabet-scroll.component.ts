import { Component, AfterViewInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GestureController } from '@ionic/angular';
import {Haptics, ImpactStyle} from '@capacitor/haptics'

@Component({
  selector: 'app-alphabet-scroll',
  templateUrl: './alphabet-scroll.component.html',
  styleUrls: ['./alphabet-scroll.component.scss'],
})
export class AlphabetScrollComponent  implements AfterViewInit {

  @ViewChild('bar')
  sidebar!: ElementRef;

  letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  lastOpen = null;
  @Output() letterSelected = new EventEmitter<string>();
  @Output() scrollingLetter = new EventEmitter<boolean>()
  

  constructor(private gestureCtrl: GestureController) { }

  ngAfterViewInit() {
    const moveGesture = this.gestureCtrl.create({
      el: this.sidebar.nativeElement,
      direction: 'y',
      threshold: 0,
      gestureName: 'move',
      onStart: ev =>{

      },
      onMove: ev =>{
        console.log('letter')
        const closestEle: any=document.elementFromPoint(ev.currentX, ev.currentY)
        if(closestEle && ['LI', 'A'].indexOf(closestEle.tagName)>-1){
          const letter = closestEle.innerText;
          if(letter){
            if(letter != this.lastOpen){
              Haptics.impact({style: ImpactStyle.Light})
            }
            this.goToLetter(letter);
            
          }
        }
      },
      onEnd: ev =>{

      }
    })
  }
  goToLetter(letter:any){
    
    this.letterSelected.emit(letter);
    

  }

}
