import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AppService } from '../../../providers/service-public-service/service-public-service';

/**
 * Generated class for the ConsignStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consign-statistics',
  templateUrl: 'consign-statistics.html',
})
export class ConsignStatisticsPage {
  public consignOrderDetail = 'ConsignOrderDetailPage';
  public consignSumDetail = 'ConsignSumDetailPage';
  public consignRemainderDetail = 'ConsignRemainderDetailPage';

  public sections: string[]; 
  public defaultSection: string;
  // 本身的storeId
  public storeId:any;
  public storeName: string;
  
  public data = [];
  //单数总数
  public depositNoNum: number;
  //余量总数
  public surplus: number;
  //总量总数
  public goodsNum: number;

  public storeMap;
  public storeMapLength;

  //用户身份
  public identity;

  public pushOrderPage;
  public pushSumPage;
  public pushReminderPage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,  
    public appService:AppService,
    public loadingCtrl: LoadingController) {
    this.appService.getItem('curStore',val=>{
      this.storeId=val['id'];
      this.storeName=val['storeName'];
      // console.log(this.storeId)
    })

    this.appService.getItem('userInfo', val => {
      this.identity = val['tag'];
    }) 
  }

  ionViewDidLoad() {
    this.presentLoading();
    //this.defaultSection = '绿臣总部';
    this.consignStatistics();
    this.OrgUser();
  }

  consignStatistics(){
    this.appService.httpPost('findMamDeposit.api',{storeId: this.storeId},data=>{
      console.log(data);
      this.data = data['data'];
      this.depositNoNum = data['depositNoNum'];
      this.surplus = data['surplus'];
      this.goodsNum = data['goodsNum'];
    })
  }
  
  //跳转到单数详情，导购跳转
  orderPage(){
    if(this.identity === 2 || this.identity === 3){
      this.pushOrderPage = '';
    }else{
      this.pushOrderPage = this.consignOrderDetail;
    }
  }

  
  // sumPage(){
  //   if(this.identity === 2 || this.identity === 3){
  //     this.pushSumPage = '';
  //   }else{
  //     this.pushSumPage = this.consignSumDetail;
  //   }
  // }

  // reminderPage(){
  //   if(this.identity === 2 || this.identity === 3){ 
  //     this.pushReminderPage = '';
  //   }else{
  //     this.pushReminderPage = this.consignRemainderDetail;
  //   }
  // }


    // 判断是否为总部
    OrgUser() {
    this.appService.httpPost('getNextOrg.api', { storeId: this.storeId }, data => {
      //console.log(data)
      this.storeMap = data['data'] || [];
      //if(this.storeMap.length > 0){}
        this.storeMap.unshift({orgId:this.storeId,orgName: this.storeName});
      
      this.storeMapLength = this.storeMap.length > 0 ? true : false;;
    })
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      duration: 1000
    });
    loader.present();
  }

  //选择下级门店
  selectGroup(){
    this.presentLoading();
    this.appService.httpPost('findMamDeposit.api',{storeId: this.storeId},data=>{
      console.log(data);
      this.data = data['data'];
      this.depositNoNum = data['depositNoNum'];
      this.surplus = data['surplus'];
      this.goodsNum = data['goodsNum'];
    })
  }
}