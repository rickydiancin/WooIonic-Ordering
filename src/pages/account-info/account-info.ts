import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { SearchPage } from '../search/search';
import { QRCodeComponent } from 'angular2-qrcode';

@IonicPage({})
@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
})
export class AccountInfoPage {

  WooCommerce: any;
  userInfo: any;
  searchQuery: string = "";
  profile: any;
  value : string = "";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {

    this.profile = {};
    this.profile.billing_address = {};
    this.profile.shipping_address = {};

    this.WooCommerce = WC({
      url: "http://app.tinkertech.biz",
      consumerKey: "ck_443268489763fa3622be2c9a7721ae33d3e24833",
      consumerSecret: "cs_4fe14a3953f4b4abfdb44e4a0ab3d61f4d5ca2e5"
    });

    this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then( (data)=> {
        this.profile = JSON.parse(data.body).customer;
        console.log(this.profile);
        this.value = this.profile.id + " " + this.profile.first_name + " " + this.profile.last_name;
        console.log(this.value);
      })
    })
    
  }

  onSearch(event) {
    if(this.searchQuery.length > 0) {
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
    }
  }

  signout() {
    this.storage.remove("userLoginInfo").then( ()=> {
    })
  }

}
