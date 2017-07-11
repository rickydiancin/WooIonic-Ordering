import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {

  newUser: any = {};
  billing_shipping_same: boolean;
  WooCommerce: any;
  res: any;
  userName: any;
  passWord: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public alertCtrl: AlertController,
    public http: Http,
    public storage: Storage
    ) {

    this.newUser.billing_address = {};
    this.newUser.shipping_address = {};
    this.billing_shipping_same = false;

    this.WooCommerce = WC({
      url: "http://localhost/woocommercestore",
      consumerKey: "ck_91260d8413594f2a968e120c2646f5d0f1112793",
      consumerSecret: "cs_18af990b31a0fbb5eab46767ead504a3caaaf201"
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;
  }

  checkEmail() {

    let validEmail = false;
    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(reg.test(this.newUser.email)) {
      this.WooCommerce.getAsync('customers/email/' + this.newUser.email).then( (data)=> {
        let res= (JSON.parse(data.body));
        console.log(res);

        if(res.errors) {
          validEmail = true;
          this.toastCtrl.create({
            message: "Email is valid to use.",
            duration: 3000
          }).present();
        }else {
          validEmail = false;
          this.toastCtrl.create({
            message: "Invalid email address or email is already in used.",
            showCloseButton: true
          }).present();
        }

        console.log(validEmail);

      })
    } else {
      validEmail = false;
      this.toastCtrl.create({
        message: "Invalid email address or email is already in used.",
        showCloseButton: true
      }).present();
      console.log(validEmail);
    }

  }

   signup(){

      let customerData = {
        customer : {}
      }

      customerData.customer = {
        "email": this.newUser.email,
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "username": this.newUser.username,
        "password": this.newUser.password,
        "billing_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.billing_address.address_1,
          "address_2": this.newUser.billing_address.address_2,
          "city": this.newUser.billing_address.city,
          "state": this.newUser.billing_address.state,
          "postcode": this.newUser.billing_address.postcode,
          "country": this.newUser.billing_address.country,
          "email": this.newUser.email,
          "phone": this.newUser.billing_address.phone
        },
        "shipping_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.shipping_address.address_1,
          "address_2": this.newUser.shipping_address.address_2,
          "city": this.newUser.shipping_address.city,
          "state": this.newUser.shipping_address.state,
          "postcode": this.newUser.shipping_address.postcode,
          "country": this.newUser.shipping_address.country
        }
      }

      if(this.billing_shipping_same){

        customerData.customer = {
        "email": this.newUser.email,
        "first_name": this.newUser.first_name,
        "last_name": this.newUser.last_name,
        "username": this.newUser.username,
        "password": this.newUser.password,
        "billing_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.billing_address.address_1,
          "address_2": this.newUser.billing_address.address_2,
          "city": this.newUser.billing_address.city,
          "state": this.newUser.billing_address.state,
          "postcode": this.newUser.billing_address.postcode,
          "country": this.newUser.billing_address.country,
          "email": this.newUser.email,
          "phone": this.newUser.billing_address.phone
        },
        "shipping_address": {
          "first_name": this.newUser.first_name,
          "last_name": this.newUser.last_name,
          "company": "",
          "address_1": this.newUser.billing_address.address_1,
          "address_2": this.newUser.billing_address.address_2,
          "city": this.newUser.billing_address.city,
          "state": this.newUser.billing_address.state,
          "postcode": this.newUser.billing_address.postcode,
          "country": this.newUser.billing_address.country
        }
      }

    }

    this.WooCommerce.postAsync('customers', customerData).then( (data) => {
      this.userName = this.newUser.username;
      this.passWord = this.newUser.password;

      let response = (JSON.parse(data.body));

      if(response.customer){
        this.alertCtrl.create({
          title: "Account successfully created",
          message: "Click OK to proceed",
          buttons: [{
            text: "Ok",
            handler: ()=> {
              this.http.get("http://localhost/woocommercestore/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.userName + "&password=" + this.passWord)
                .subscribe( (res)=> {
                  console.log(res.json());

                  let response = res.json();

                  this.storage.set("userLoginInfo", response).then( (data)=> {
                    
                    if(this.navParams.get("next")) {
                      this.navCtrl.push(this.navParams.get("next"));
                    } else {
                      this.navCtrl.pop();
                    }

                  })

                })
              
            }
          }]
        }).present();
      } else if(response.errors){
        this.toastCtrl.create({
          message: response.errors[0].message,
          showCloseButton: true
        }).present();
      }

    })
    
    }

  



}
