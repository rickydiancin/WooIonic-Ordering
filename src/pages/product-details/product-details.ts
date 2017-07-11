import { Component } from '@angular/core';
import { NavController, NavParams ,ToastController, ModalController} from 'ionic-angular';
import * as WC from 'woocommerce-api';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public storage: Storage, public modalCtrl: ModalController) {

    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/woocommercestore",
      consumerKey: "ck_91260d8413594f2a968e120c2646f5d0f1112793",
      consumerSecret: "cs_18af990b31a0fbb5eab46767ead504a3caaaf201"
    });

    this.WooCommerce.getAsync('products/' +this.product.id+ '/reviews').then((data)=> {
      this.reviews = JSON.parse(data.body).product_reviews;
      console.log("Reviews: "+this.reviews);
    }, (err)=> {
      console.log(err);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product){
    
    this.storage.get("cart").then((data)=> {
      
      if(data==null || data.length==0){
        data = [];
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else{
        let added = 0;
        for(let i=0; i<data.length; i++) {
          if(product.id == data[i].product.id) {
            console.log("Product is already in the cart.");
            let qty = data[i].qty;
            data[i].qty = qty+1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].price);
            added = 1;
          }
        }
        if(added==0){
          data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
          });
        }
      }

      this.storage.set("cart", data).then( ()=> {
        console.log("Cart updated.");
        console.log(data);
        this.toastCtrl.create({
          message: "Product added to cart.",
          duration: 3000
        }).present();
      })

    });

  }

  openCart() {
    this.modalCtrl.create(CartPage).present();
  }

}
