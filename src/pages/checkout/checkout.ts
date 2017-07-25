import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC  from 'woocommerce-api';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@IonicPage({})
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public payPal: PayPal) {

    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      {
        method_id: "bacs", method_title: "Direct Bank Transfer"
      },
      {
        method_id: "cheque", method_title: "Cheque Payment"
      },
      {
        method_id: "cod", method_title: "Cash on Delivery"
      },
      {
        method_id: "paypal", method_title: "PayPal"
      },
    ];

    this.WooCommerce = WC({
      url: "http://app.tinkertech.biz",
      consumerKey: "ck_443268489763fa3622be2c9a7721ae33d3e24833",
      consumerSecret: "cs_4fe14a3953f4b4abfdb44e4a0ab3d61f4d5ca2e5"
    });

    this.storage.get("userLoginInfo").then( (userLoginInfo)=> {
      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then( (data)=> {
        this.newOrder = JSON.parse(data.body).customer;
        console.log(this.newOrder);
      })

    });

  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if(this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }
  }
  
  placeOrder() {
    let orderItems: any[] = [];
    let data: any = {};
    let paymentData: any = {};

    this.paymentMethods.forEach( (element, index)=> {
      if(element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });
    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },
      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };

    if(paymentData.method_id == "paypal") {
      
      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'AUNVk5DF94MaQcnyi3aMI8bsHtr_xwdKBXn05vznlorZgORtqchTi17aGjdY0ZhahJwVPZLhzycJKTJB'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {

          this.storage.get("cart").then( (cart)=> {
            let total = 0.00;
            cart.forEach((element, index)=> {
              orderItems.push({product_id: element.product.id, quantity: element.qty});
              total = total + (element.product.price * element.qty);
            });
            let payment = new PayPalPayment(total.toString(), 'PHP', 'Description', 'sale');
              this.payPal.renderSinglePaymentUI(payment).then((response) => {
                // Successfully paid
                alert(JSON.stringify(response));
                
                data.line_items = orderItems;
                //console.log(data);
                let orderData: any = {};

                orderData.data = data;

                this.WooCommerce.post('orders', orderData, function(err, data, res) {
                  console.log(res);
                  alert("Order placed successfully");
                });
                
          })

          
          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });

    } else {
      this.storage.get("cart").then( (cart)=> {
        cart.forEach( (element,index)=> {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};
        orderData.order = data;
    
        this.WooCommerce.postAsync("orders", orderData).then((data) => {
          let response = (JSON.parse(data.body).order);
          console.log(response);
          this.storage.set("cart", []).then( ()=> {
            console.log("Cart is empty.");
          })

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
               this.navCtrl.setRoot('MenuPage');
              }
            }]
          }).present();

        });
        
      })
  
    }

  }




}
