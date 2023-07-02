import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsDetailsPage } from './contacts-details.page';

const routes: Routes = [
  {
    path: '',
    component: ContactsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsDetailsPageRoutingModule {}
