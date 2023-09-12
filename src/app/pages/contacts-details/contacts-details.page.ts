import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LoadingController, IonModal  } from '@ionic/angular';
import { ApiRequest, ContactsService } from 'src/app/services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';


@Component({
  selector: 'app-contacts-details',
  templateUrl: './contacts-details.page.html',
  styleUrls: ['./contacts-details.page.scss'],
  
})

export class ContactsDetailsPage implements OnInit {

  
  userInput: ApiRequest = {
    phoneNumber: '',
    name: '',
    surname: '',
    email: '',
    category: '',
    birthday: ''
  };  


  constructor(private conatctsService: ContactsService, private loadingCtrl: LoadingController, private route: ActivatedRoute,
    private router: Router) { }
  

    
  id:any;
  contact:any= [];
  birthday: string =this.contact.birthday
  errorMessage: any;

  ngOnDestroy(){
    this.contact= [];
    this.id=''
  }

  ngOnInit() {
    
    
    this.loadContact();

  }

  async loadContact(){
    const loading =  await this.loadingCtrl.create({
      message: 'Loading..',
      spinner:'bubbles'

    });
    await loading.present();
    this.id=this.route.snapshot.queryParamMap.get('id')
    if(!!this.id){
    this.conatctsService.getContactDetails(this.id).subscribe((res) => {
      loading.dismiss();
      let data = Object(res);

        for (let element in data){
          
          if(!data[element]){
            data[element]='';
          }
                   
        }   
        if(!data.name && !data.surname){
          data.name = data.phoneNumber
        }

      this.userInput = data
      
      this.contact = data;  
      this.birthday=this.contact.birthday
      if(!this.birthday){
        console.log('here')
        this.birthday=new Date().toISOString()
      }
      if(!!this.contact.birthday){
  
        this.contact.birthday=(new Date(Date.parse(this.contact.birthday))).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" })
      }   
      
      
      console.log(this.contact)
      console.log(this.userInput)

    });
  }
  }  

  editContact(userInput: ApiRequest)
  {
    this.conatctsService.editContacts(this.id, userInput)
  }

  editContact2(userInput: ApiRequest)
    {
      this.conatctsService.editContacts(this.id, userInput).subscribe({
        next: data => {
        this.id = data.id;
    },
    error: error => {
        this.errorMessage = error.message;
        console.error('There was an error!', error);
    }
      })
      this.loadContact()
    }



    // Editing CONTACT

@ViewChild(IonModal) modal!: IonModal;

categoryChoosen: string=''
newCategory: string ='custom'
categorySet: string=''




cancel() {
  this.modal.dismiss(null, 'cancel');
}

confirm() {
  console.log(this.userInput.birthday)
  
  if(!!this.userInput.phoneNumber){
    this.modal.dismiss(this.userInput, 'confirm');
  }
  else{
    this.setOpen(true) 
  }
  
}

onWillDismiss(event: Event) {
  const ev = event as CustomEvent<OverlayEventDetail<string|null>>;
  
  if (ev.detail.role === 'confirm'&& !!this.userInput.phoneNumber ) {
    this.userInput.birthday=this.birthday

    
     if(!this.userInput.birthday){
      this.userInput.birthday=null
     }
     if(!this.userInput.email){
      this.userInput.email=null
     }
     if(!this.userInput.category){
      this.userInput.category=null
     }
     if(!this.userInput.surname){
      this.userInput.surname=null
     }
    this.editContact(this.userInput);
   
  }
}


isAlertOpen = false;
public alertButtons = ['OK'];

setOpen(isOpen: boolean) {
  this.isAlertOpen = isOpen;
}



}
