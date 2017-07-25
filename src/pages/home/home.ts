import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, ToastController, ModalController } from 'ionic-angular';

import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';

@IonicPage({})
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
  categories: any[];
  loggedIn: boolean;
  
    @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public modalCtrl: ModalController, public storage: Storage) {
    this.categories = [];

    this.page = 2;

    this.WooCommerce = WC({
      url: "http://app.tinkertech.biz",
      consumerKey: "ck_443268489763fa3622be2c9a7721ae33d3e24833",
      consumerSecret: "cs_4fe14a3953f4b4abfdb44e4a0ab3d61f4d5ca2e5"
    });

    // this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      this.products = JSON.parse(data.body).products;
      console.log(JSON.parse(data.body));
    }, (err) => {
      console.log(err);
    })

    this.WooCommerce.getAsync("products/categories").then((data) => {
      // console.log(JSON.parse(data.body).product_categories);
      let temp: any[] = JSON.parse(data.body).product_categories;

      for(let i=0; i<temp.length; i++){
        if(temp[i].parent==0){
          this.categories.push(temp[i]);
        }
      }
      console.log(this.categories);
    }, (err) =>{
      console.log(err);
    })

  }

  ionViewDidLoad() {
    // setInterval(()=> {
    //   if(this.productSlides.getActiveIndex()== this.productSlides.length()-1)
    //     this.productSlides.slideTo(0);
    //     this.productSlides.slideNext();
    // }, 3000)
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
        // this.toastCtrl.create({
        //   message: "No more products.",
        //   duration: 3000
        // }).present();
      }

    }, (err) => {
      console.log(err);
    })
  }

  openProductPage(product) {
    this.navCtrl.push('ProductDetailsPage', {"product": product});
  }

  onSearch(event) {
    if(this.searchQuery.length > 0) {
      this.navCtrl.push('SearchPage', {"searchQuery": this.searchQuery});
    }
  }

  openCategoryPage(category) {
    this.navCtrl.push('ProductsByCategoryPage',{"category": category});
  }

  openCart() {
    this.modalCtrl.create('CartPage').present();
  }


}
