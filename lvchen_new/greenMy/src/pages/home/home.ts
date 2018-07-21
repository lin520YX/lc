import { Component} from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { AppService, AppGlobal } from '../../providers/service-public-service/service-public-service'
import { OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

/**
 * @author() 2018-05-28 modify by linyunfu
 * 对项目进行懒加载处理
 * */ 
export class HomePage implements OnInit {
  public config:any;
  storeName = '';
  storeMap = [];
  identity = 0; //-1业务员，1员工，2、3导购
  public complainListPage = 'ComplainListPage';
  public ScannerPage = 'ScannerPage';
  public CompanyInfoPage = 'CompanyInfoPage';
  public OrderListPage = 'OrderListPage';
  public customerReturn = 'CustomerReturnPage';
  public CustomerLoggingPage = 'CustomerLoggingPage';
  public MyCustomerPage = 'MyCustomerPage';
  public slider: Array<any>;
  public len: any;
  public unread: string = '';
  public unreadComplain: string = '';
  public validate: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private appService: AppService,
    public appUrl: AppGlobal,
    private platform: Platform) {
     

    // 首页广告、未读资讯
    this.appService.httpPost('home_adJson.api', {}, data => {
      this.unread = data.map.unread;
      this.slider = data.map.adList;
      this.len = data.map.adList.length;
    })

    this.appService.getItem('userInfo', val => {
      this.identity = val['tag'];
    })

  }


  // 寄存
  openDeposit() {
    this.navCtrl.push('DepositsPage');
  }
  // 销售
  scan() {
    this.navCtrl.push('ScannerPage', {}, {
      animation: 'md-transition'
    });
  }
  // 公司资讯
  companyInfo() {
    this.navCtrl.push('CompanyInfoPage')
  }
  // 订单详情
  orderList() {
    this.navCtrl.push('OrderListPage')
  }
  // 还顾客赠品
  repayGift() {
    this.navCtrl.push('RepayGiftPage')
  }

  SalesReturn() {

    if (this.identity > 1) {
      this.appService.alert("没有操作权限");
    } else {
      this.navCtrl.push('SalesReturnPage')
    }
  }
  showRadio() {

    let alert = this.alertCtrl.create({ enableBackdropDismiss: false });

    alert.setTitle('选择');

    for (var i = 0; i < this.storeMap.length; ++i) {
      alert.addInput({
        type: 'radio',
        label: this.storeMap[i].storeName,
        value: i + '',
        checked: false
      });
    }

    alert.addButton({
      text: '确定',
      handler: data => {
        if (!data) {
          return false;
        }
        var pos = parseInt(data);
        this.storeName = this.storeMap[pos].storeName;

        // 原生js储存门店或者门店组id
        this.appService.setItem('curStore', this.storeMap[pos])
      }
    });
    alert.present();
  }

  ngOnInit() {
    this.appService.getItem('userInfo', (val) => {
      console.log(val);
      this.storeMap = val.storeMap;
      if (this.storeMap.length > 1) {
        this.showRadio();
      } else if (this.storeMap.length == 1) {
        this.storeName = this.storeMap[0].storeName;
        // 原生js储存门店或者门店组id
        this.appService.setItem('curStore', this.storeMap[0])
      }

      const params = new URLSearchParams();

      params.append('userId', val.id);

    });
  }
  ionViewWillEnter() {
    this.appService.httpPost('home_adJson.api',{},data=>{
      this.unread=data.map.unread;
    })
    //投诉有无未读
    this.appService.httpPost('complaintInformation.api', {}, data => {
      if (data.code == 1) {
        this.unreadComplain = "true";
      } else {
        this.unreadComplain = "";
      }

    })
    try {
      // 删除销售本地储存
      this.appService.removeItem('sc');
      this.appService.removeItem('pre')
    } catch (e) {

    }
  }
  ionViewDidEnter() {
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
    });
    this.validate = true;
  }

  // 点击打开顾客录入模块
  customerPage() {
    if (this.validate) {
      this.validate = false;
      this.appService.httpPost("findAllMemberLabel.api", {}, (res) => {
        if (res.code == 1) {
          this.navCtrl.push('CustomerLoggingPage');
        }
        else {
          this.appService.alert(res.msg);
          this.validate = true;
          return;
        }
      }, true);
    }
  }
  
}