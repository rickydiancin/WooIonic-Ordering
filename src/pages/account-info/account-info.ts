import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-account-info',
  templateUrl: 'account-info.html',
})
export class AccountInfoPage {

  WooCommerce: any;
  WooCommerce2: any;
  newOrder: any;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController) {

    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};

    this.WooCommerce = WC({
      url: "http://localhost/woocommercestore",
      consumerKey: "ck_91260d8413594f2a968e120c2646f5d0f1112793",
      consumerSecret: "cs_18af990b31a0fbb5eab46767ead504a3caaaf201"
    });

    this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then( (data)=> {
        this.newOrder = JSON.parse(data.body).customer;
      })
    })

  }

}
