import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import * as WC from 'woocommerce-api';

@IonicPage({})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  badge: any;
  loggedIn: boolean;
  user: any;
  homePage = 'HomePage';
  orderPage = 'CartPage';
  billoutPage = 'CheckoutPage';
  accountPage = 'AccountInfoPage';
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public http: Http) {

    this.storage.get("cart").then( (data)=> {
      this.badge = data.length;
    });

  }

  ionViewDidLoad() {
    this.storage.ready().then( ()=> {

      this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
        if(userLoginInfo !=null) {
          console.log("User logged in..");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        } else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }
      })

    })
  }

  opencart() {
    this.modalCtrl.create('CartPage').present();
    //this.navCtrl.setRoot(CartPage);
  }

  // openProfile() {
  //   if(this.loggedIn == true) {
  //     this.accountPage = AccountInfoPage;
  //   }
  //   else {
  //     this.accountPage = LoginPage;
  //   }
  // }


}


