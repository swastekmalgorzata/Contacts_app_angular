import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiRequest, ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  contacts: any[] = [];
  userInput: ApiRequest = {
    phoneNumber: '',
    name: '',
    surname: '',
    email: '',
    password: '',
    category: '',
    birthday: ''
  };  
  constructor(private conatctsService: ContactsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts(){
    const loading =  await this.loadingCtrl.create({
      message: 'Loading..',
      spinner:'bubbles'

    });
    await loading.present();

    this.conatctsService.getContacts().subscribe((res) => {
      loading.dismiss();
      this.contacts = [...this.contacts, ...res.result];
      console.log(res);
      
    });  } 
    createContact(userInput: ApiRequest)
    {
      this.conatctsService.createContact(userInput).subscribe((res)=>
      {
        console.log(res);
      })
    }
}
