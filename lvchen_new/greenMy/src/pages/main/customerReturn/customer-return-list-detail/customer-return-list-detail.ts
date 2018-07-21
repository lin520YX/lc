import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnInit } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { AppService } from '../../../../providers/service-public-service/service-public-service';

/**
 * Generated class for the CustomerReturnListDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-return-list-detail',
  templateUrl: 'customer-return-list-detail.html',
})
export class CustomerReturnListDetailPage implements OnInit {
  public customerStore = '';
  public customerStoreGoods: Array<any> = [];
  public customerStorePresent: Array<any> = [];
  public customerStoreGift: Array<any> = [];
  public type: number = 1;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService,
    public popoverCtrl: PopoverController) {
    this.type = this.navParams.get('type');
      console.log(this.type)
  }
  ngOnInit() {
    this.appService.httpPost('getSellCasPosSale.api', {
      posSaleId: this.navParams.get('item'),
      type: this.type
    }, data => {
      if (data.code == 1) {
        this.customerStore = data.data;
        this.customerStoreGoods = data.data.goods || [];
        this.customerStoreGift = data.data.gifts || [];
        this.customerStorePresent = data.data.presentMap || [];
      } else {
        this.appService.toast(data.msg);
        this.navCtrl.pop();
      }
      console.log(data)
    }, true)
  }
  scanCode(code) {
    let ary: Array<string> = [];
    ary.push(code)
    let popover = this.popoverCtrl.create('CodeviewPage', ary);
    popover.present();
  }

  customerReturnScanner() {
    this.navCtrl.push('CustomerReturnScannerPage', { phone: this.customerStore['phone'], receiptNo: this.customerStore['receiptNo'] }, {
      animation: 'md-transition'
    })
  }

}