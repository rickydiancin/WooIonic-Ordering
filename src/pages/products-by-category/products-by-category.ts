import { Component } from '@angular/core';
import { NavController, NavParams ,ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage } from "../product-details/product-details";

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {

    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "http://localhost/woocommercestore",
      consumerKey: "ck_91260d8413594f2a968e120c2646f5d0f1112793",
      consumerSecret: "cs_18af990b31a0fbb5eab46767ead504a3caaaf201"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      this.products = JSON.parse(data.body).products;
      console.log(JSON.parse(data.body));
    }, (err) => {
      console.log(err);
    })
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {

    if(event==null) {
      this.page = 1;
    }
    else
      this.page ++;
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then( (data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products);

      if(JSON.parse(data.body).products.length < 10) {
        event.enable(false);
        this.toastCtrl.create({
          message: "No more products.",
          duration: 3000
        }).present();
      }
      
    }, (err) => {
      console.log(err);
    })
  }

  openProductPage(product) {
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }

}
