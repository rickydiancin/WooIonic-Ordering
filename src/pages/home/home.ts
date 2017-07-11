import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';
import { SearchPage } from '../search/search';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any;
  page: number;
  searchQuery: string = "";
  
    @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

    this.page = 2;

    this.WooCommerce = WC({
      url: "http://localhost/woocommercestore",
      consumerKey: "ck_91260d8413594f2a968e120c2646f5d0f1112793",
      consumerSecret: "cs_18af990b31a0fbb5eab46767ead504a3caaaf201"
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      this.products = JSON.parse(data.body).products;
      //console.log(JSON.parse(data.body));
    }, (err) => {
      console.log(err);
    })

  }

  ionViewDidLoad() {
    setInterval(()=> {
      if(this.productSlides.getActiveIndex()== this.productSlides.length()-1)
        this.productSlides.slideTo(0);
        this.productSlides.slideNext();
    }, 3000)
  }

  loadMoreProducts(event) {
    if(event==null) {
      this.page = 2;
      this.moreProducts = [];
    }
    else
      this.page ++;

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event !=null) {
        event.complete();
      }

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

  onSearch(event) {
    if(this.searchQuery.length > 0) {
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
    }
  }


}
