import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsDetailsPageRoutingModule } from './contacts-details-routing.module';

import { ContactsDetailsPage } from './contacts-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsDetailsPageRoutingModule
  ],
  declarations: [ContactsDetailsPage]
})
export class ContactsDetailsPageModule {}
