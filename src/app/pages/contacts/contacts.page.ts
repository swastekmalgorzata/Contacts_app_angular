import { Component, OnInit, ViewChildren, QueryList, ElementRef, ViewChild } from '@angular/core';
import { IonItemGroup, LoadingController, IonModal } from '@ionic/angular';
import { ApiRequest, ContactsService } from 'src/app/services/contacts.service';
import { Router} from '@angular/router';
import { OverlayEventDetail } from '@ionic/core/components';
import {Settings, AppComponent} from 'src/app/app.component';
import { MenuController } from '@ionic/angular';


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
    category: '',
    birthday: ''
  };  
  filteredContacts: any[]= [] //this.contacts;
  groupedContacts: any[] =[]

  

  @ViewChildren(IonItemGroup, { read: ElementRef })
  itemGroups!: QueryList<any>;

  constructor(private conatctsService: ContactsService, private loadingCtrl: LoadingController, private router: Router, private menuCtrl: MenuController, private appComponent: AppComponent) { }
  

  isDarkmode: boolean = Settings.isDarkmode
  isSurnameFirst: boolean = Settings.isSurnameFirst

  groupBySurname: boolean = Settings.isSurnameFilter
  filteredBy: string='All';

  alphabet: string[] = [];
  categories: string[]=[];
  searchText: string ='';
  
  searching:boolean=false;
  scroll: boolean = false;

  sortBy ='Surname'
  maxId=0

  ngOnInit() {
    this.loadContacts();    
    this.changeSettings(Settings.isSurnameFilter, Settings.isSurnameFirst)

  }

  async loadContacts(){
    const loading =  await this.loadingCtrl.create({
      message: 'Loading..',
      spinner:'bubbles'

    });
    await loading.present();


    

    this.conatctsService.getContacts().subscribe((res) => {
      loading.dismiss();
      let result = Object(res);
    
      for (let data of result){
        if(data.id>this.maxId){
          this.maxId=data.id
        }
        for (let element in data){
          
          if(!data[element]){
            data[element]='';
          }
        }
          if(!data.name && !data.surname){
            data.name = data.phoneNumber
          }
        
      }
          
      this.contacts = result; 
      this.GetCategories();
      this.SortAlphabetically(); 
      this.filteredContacts = this.contacts;
      this.GroupContacts();


    });  

  } 

  getMaxId(){
    this.conatctsService.getContacts().subscribe((res) => {
      
      let result = Object(res);
    
      for (let data of result){
        if(data.id>this.maxId){
          this.maxId=data.id
        }}
    });   
  }

  createContact(userInput: ApiRequest)
    {
      this.conatctsService.createContact(userInput).subscribe((res)=>
      {
        this.maxId=res.id
        this.ViewContact(''+(this.maxId))
      })
    }
  

    
    changeSettings(surnameFilter:boolean, surnameFirst: boolean){
      
      let changed=false
      if(this.isSurnameFirst!=surnameFirst){
          changed=true
      }
      this.groupBySurname = surnameFilter
      this.isSurnameFirst = surnameFirst

      if(this.groupBySurname){
        this.sortBy = 'Name'
      }
      else{
        this.sortBy ='Surname'
      }
      
      this.appComponent.updateSettings(Settings.isDarkmode, this.groupBySurname, this.isSurnameFirst)
      this.loadContacts();  
      if(changed){
        this.router.navigateByUrl('/contacts', {skipLocationChange: true}).then(() => {
          this.router.navigate(["/contacts"]);
          });
      }
      
    }

   
    

    openMenu() {
      // Open the menu by menu-id
      this.menuCtrl.enable(true, 'menu');
      this.menuCtrl.open('menu');
    }


    IsOther(word: string){
      if(!!word){
        word=word[0]
      }
      return !/^[a-zA-Z]/.test(word)
    }

    SortAlphabetically(){
      if (this.groupBySurname){
        this.contacts.sort((a,b) => {
          let nameA = a.name
          let nameB = b.name;
          
          if (!this.IsOther(a.name)){
            nameA = a.name.toLowerCase();
          }
          if (!this.IsOther(b.name)){
            nameB = b.name.toLowerCase();
          } 

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        this.contacts.sort((a,b) => {
          if(a.name==a.phoneNumber || b.name==b.phoneNumber){
            if (a.name!=a.phoneNumber){
              return -1;
            }
            else if(b.name!=b.phoneNumber){
              return 1;
            }
            return 0;
          }

          let nameA = a.surname;
          let nameB = b.surname;
          if (!this.IsOther(a.surname)){
            
            nameA = a.surname.toLowerCase();
          }
          if (!this.IsOther(b.surname)){
            nameB = b.surname.toLowerCase();
          }
      
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      }
      else{
        this.contacts.sort((a,b) => {
          let nameA = a.surname;
          let nameB = b.surname;
          if (!this.IsOther(a.surname)){
            
            nameA = a.surname.toLowerCase();
          }
          if (!this.IsOther(b.surname)){
            nameB = b.surname.toLowerCase();
          }
      
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

        this.contacts.sort((a,b) => {
          let nameA = a.name
          let nameB = b.name;
          if(nameA ==a.phoneNumber || nameB ==b.phoneNumber){
            if (nameA !=a.phoneNumber){
              return -1;
            }
            else if(nameB!=b.phoneNumber){
              return 1;
            }
          }
          else{
            if (!this.IsOther(a.name)){
              nameA = a.name.toLowerCase();
            }
            
            if (!this.IsOther(b.name)){
              nameB = b.name.toLowerCase();
            } 
          }

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });

      }
    }



    GroupContacts(){
      
      let contacts = this.filteredContacts;
      this.groupedContacts= []
    
      let firstLetter = null;
      
      
      for (let i = 0; i<contacts.length; i++){
        let groupBy = contacts[i].surname
        if(!this.groupBySurname){
          groupBy = contacts[i].name
        }
        if (!this.IsOther(groupBy)){
          if (!firstLetter || firstLetter != groupBy[0] ){
            firstLetter = groupBy[0]
            this.groupedContacts.push({key: firstLetter, contacts: []})
          }
        }
        else{
          let letter ='&'
          if(contacts[i].name == contacts[i].phoneNumber){
            letter ="#"
          }
          if (!firstLetter || firstLetter != letter ){
            firstLetter = letter
            this.groupedContacts.push({key: firstLetter, contacts: []})
          }
        }
        this.groupedContacts[this.groupedContacts.length -1].contacts.push(contacts[i])
      }

      
    }




    
   GetCategories(){
    let categories = []
    for (let contact of this.contacts){
      if(!contact.category){
        contact.category=''
      } 
      if(contact.category!='')
      categories.push(contact.category)
    }
    this.categories = categories.filter((value, index, array) => array.indexOf(value) === index).sort();
    
   }
    
  

   scrollToLetter(letter: any){
    
    let letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    
    for (let j=0; j<letters.length;j++){
        for (let i = 0; i<this.groupedContacts.length; i++){
          const group = this.groupedContacts[i]
          if(group.key == letter){
            const group = this.itemGroups.filter((element,index) =>index==i );
            if (group && group.length>0){
              const el = group[0];
              el.nativeElement.scrollIntoView(true);

            }
            return;
          }
          else if (letters[j]==letter){
            letter = letters[j+1]

        }
      }
    }    
  }
    
  letterScrollActive(active: boolean){
    this.scroll = active
    console.log(this.scroll)

  }
   

  

  
   
   Search(){
    
    let searchText = this.searchText.toLowerCase();
    console.log(this.filteredContacts)
    this.filterByCategory(this.filteredBy)
    let contacts = this.filteredContacts


    if(searchText.length>1){
      
         this.filteredContacts =  contacts.filter(contact => {
          let searched= false
          
          
          if (!!contact.name && !searched){
            
            let name= contact.name
            name=name.toLowerCase()
            searched=name.includes(searchText) 
            
            
          }
          if (!!contact.surname && !searched){
            
            let surname= contact.surname
            surname=surname.toLowerCase()
            searched=surname.includes(searchText)
          }
          if(!searched)
          searched = contact.phoneNumber.includes(searchText);
          
          
          return searched
            
     })
    }
       
    
    this.GroupContacts()
  }

  filterByCategory(category:string){
    this.filteredBy=category
    
    let contacts = this.contacts
    if (category!='All'){
      this.filteredContacts =  contacts.filter((contact: { category: string; }) => {return contact.category ==category}) 
    }
    else{
      this.filteredContacts = contacts;
    }
    this.GroupContacts()
      
  }
  ViewContact(contactID:string){
    this.router.navigateByUrl('/contacts-details?id='+contactID)
    //window.location.href="src/app/pages/contacts-details/contacts-details.page.html"
}

// CREATING NEW CONTACT

@ViewChild(IonModal) modal!: IonModal;

categoryChoosen: string=''
newCategory: string ='custom'
categorySet: string=''




cancel() {
  this.isModalOpen = false;
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
    this.userInput.category=this.categorySet

    console.log(this.userInput)
     if(!this.userInput.birthday){
      this.userInput.birthday=null
     }
     if(!this.userInput.email){
      this.userInput.email=null
     }
     if(!this.userInput.category){
      this.userInput.category=null
     }
     console.log(this.userInput)
    this.createContact(this.userInput);
    this.isModalOpen = false;
    
  }
}


isAlertOpen = false;
public alertButtons = ['OK'];

setOpen(isOpen: boolean) {
  this.isAlertOpen = isOpen;
}

isModalOpen = false;
openModal(isOpen: boolean){
  this.isModalOpen = isOpen;
}


isPopoverOpen=false


}





