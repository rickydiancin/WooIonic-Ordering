import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = "";
  WooCommerce: any;
  products: any[] = [];
  page: number = 2;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    console.log(this.navParams.get("searchQuery"));
    this.searchQuery = this.navParams.get("searchQuery");

    this.WooCommerce = WC({
      url: "http://app.tinkertech.biz",
      consumerKey: "ck_443268489763fa3622be2c9a7721ae33d3e24833",
      consumerSecret: "cs_4fe14a3953f4b4abfdb44e4a0ab3d61f4d5ca2e5"
    });

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery).then((searchData)=> {
      this.products = JSON.parse(searchData.body).products;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  loadMoreProducts(event) {

    this.WooCommerce.getAsync("products?filter[q]=" + this.searchQuery + "&page=" + this.page).then((searchData)=> {
      this.products = this.products.concat(JSON.parse(searchData.body).products);

      if(JSON.parse(searchData.body).products < 10) {
        event.enable(false);

        // this.toastCtrl.create({
        //   message: "No more products.",
        //   duration: 3000
        // }).present();
      }

      event.complete();
      this.page ++;
    });

  }

  openProductPage(product) {
    this.navCtrl.push('ProductDetailsPage', {"product": product});
  }
  

}
