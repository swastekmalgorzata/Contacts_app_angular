import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { LoadingController, IonModal, PopoverController, IonAlert  } from '@ionic/angular';
import { ApiRequest, ContactsService } from 'src/app/services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';


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


  constructor(private contactsService: ContactsService, private loadingCtrl: LoadingController, private route: ActivatedRoute,
    private router: Router, private popCtrl: PopoverController) { }
  

    
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
    if(this.id){
    this.contactsService.getContactDetails(this.id).subscribe((res) => {
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
        this.birthday=new Date().toISOString()
      }
      if(!!this.contact.birthday){
  
        this.contact.birthday=(new Date(Date.parse(this.contact.birthday))).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" })
      }   
      
    });
  }
  }  

  editContact(userInput: ApiRequest)
  {
    this.contactsService.editContacts(this.id, userInput).subscribe((res)=>
    {
      this.loadContact()
    })
  }


  deleteContact(){
    this.contactsService.deleteContact(this.id).subscribe((res)=>
    {
      console.log(res)
      this.router.navigateByUrl('/contacts')
    })
    
  }


    // Editing CONTACT

@ViewChild(IonModal) modal!: IonModal;

isModalOpen:boolean=false
categoryChoosen: string=''
newCategory: string ='custom'
categorySet: string=''
editBirthday: boolean=false



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

    if(this.editBirthday){
      this.userInput.birthday=this.birthday
    }
    
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


//popover
async _openPopover(ev: any){
  console.log("popover")
const popover= await this.popCtrl.create({
  component: PopoverComponentComponent,
  event: ev
})

popover.onDidDismiss().then((data:any)=>{
  if(data.data){
    if(data.data.fromPopover=="Edit Contact"){
      this.isModalOpen=true
    }
    else if(data.data.fromPopover=="Delete Contact"){
      this.isDeleteAlertOpen = true;
    }
  }

})

return await popover.present()

}

@ViewChild(IonAlert) deleteAlert!: IonAlert;
isDeleteAlertOpen = false;
public deleteAlertButtons = [{
  text: 'Cancel',
  role: 'cancel',
  handler: () => {
    console.log('Alert canceled');
  },
},
{
  text: 'Delete',
  role: 'confirm',
  handler: () => {
    console.log('Alert confirmed');
  },
},
];

setResult(ev: any) {
if(ev.detail.role=='confirm'){
this.deleteContact()
};
};


}
