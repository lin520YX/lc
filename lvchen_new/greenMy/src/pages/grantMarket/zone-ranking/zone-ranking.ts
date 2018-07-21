import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from '../../../providers/service-public-service/service-public-service';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Generated class for the ZoneRankingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface zoneListData {
  storeId?;
  states: any;
  type: number
}
@IonicPage()
@Component({
  selector: 'page-zone-ranking',
  templateUrl: 'zone-ranking.html',
})
export class ZoneRankingPage {
  @ViewChild(Content) content: Content;
  public storeMap;
  public storeMapLength: boolean;
  public storeSelected: string = '';
  // 合计:
  public amountA: number = 0;
  public amountB: number = 0;
  public amountC: number = 0;
  // tabType
  public tabType: number = 1;
  // senceList
  public senceList: any[] = [];
  // 月份
  public monthly = [];
  // zone
  public zone: any[] = [];
  // 区域索引
  public index = 0;
  // 顶部tab栏
  public tabOption = 1;
  public zoneListHidden = false;
  // country Ranking
  public rank: number = 1;
  public averageSale: number = 0;
  public mySale: number = 0;
  public middleNumberSale: number = 0;
  public percentage: string = '0%';
  public firstDistance: number = 0;
  public lastDistance: number = 0;

  public storeOpt: any = ''

  // 本身的storeId
  public storeId: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appService: AppService) {
    this.zoneList({ states: '', type: this.tabType })
    this.OrgUser();
    this.appService.getItem('curStore', val => {
      this.storeId = val['id']
      // console.log(this.storeId)
    })
  }

  /**
   * @method  Store 业务组选择
   * @param {} 
   * @return {void}
   */
  Store(): void {
    if (this.storeSelected != this.storeOpt || !this.storeSelected) {
      this.zoneList({ storeId: this.storeSelected, states: '', type: this.tabType })
    }
  }

  /**
   * @method  tabSelect tab切换
   * @param {tapOption:number} 1销售额 2会员数
   * @return {boolean}
   */
  tabSelect(tapOption: number): boolean {

    if (this.tabOption === tapOption) {
      return false;
    }
    this.index = 0;
    console.log(tapOption)
    this.tabOption = tapOption;
    this.tabType = tapOption;
    this.monthly = [];

    this.zoneList({ states: '', type: this.tabType })
    this.progress(this.tabType, '');
  }

  /**
   * @method  zoneList 默认进来请求
   * @param {zoneListData} 片区状态，以及类型
   * @return {void} 无返回值
   */

  zoneList(obj: zoneListData): void {
    this.appService.httpPost('findOrgSortAnalysis.api', {
      type: obj.type,
      states: obj.states
    }, data => {
      if (data.code == 1) {
        console.log(data)
        this.senceList = data['listMap'] || [];

        this.amountA = data['data']['amountA'];
        this.amountB = data['data']['amountB'];
        this.amountC = data['data']['amountC'];
        if (data['day']) {
          data['day'].forEach(element => {
            this.monthly.unshift(element.substr(-2).replace(/0/, ''))
          })
        }
        this.zone = data['gradeMap'];
        if (this.zone.length > 0) {
          this.zoneListHidden = true;
        } else {
          this.zoneListHidden = false;
        }
        console.log(this.amountB + '/' + this.amountA + '/' + this.amountC)
      } else {
        this.navCtrl.popToRoot({ animation: 'md-transition' });
        this.appService.alert(`${data.msg}`);
      }
    }, true)
  }

  /**
   * @method  zoneTap 区域选择
   * @param {index索引，zoneId:区域id} 片区状态，以及类型
   * @return {void} 无返回值
   */
  zoneTap(index: any, zoneId: any): boolean {
    if (this.index == index) {
      return false
    }
    this.index = index
    this.monthly = [];
    this.progress(this.tabType, zoneId);
    this.zoneList({ storeId: this.storeSelected, states: zoneId, type: this.tabType })
  }


  /**
 * @method OrgUser 判断事业部
 * @param {} 默认空读取本地储存的userId storeId
 * @return {void} 无返回值
 */
  OrgUser(): void {
    this.appService.httpPost('findOrgUser.api', {}, data => {
      console.log(data)
      this.storeMap = data['orgMap'] || [];
      this.storeMapLength = this.storeMap.length > 0 ? true : false;
      if (!this.storeMapLength) {
        this.progress(this.tabType)
      }
    })
  }


  /**
   * @method progress 全国排名，只有当不存在事业部时候才有
   * @param {states:number,type:tabType}
   * @return {void} 无返回值
   *  // country Ranking
    public rank:number=1;
    public averageSale:number=0;
    public mySale:number=0;
    public middleNumberSale:number=0;
    public percentage:string='0%';
    public firstDistance:number=0;
    public lastDistance:number=0;
   * 
   * 
   */
  progress(tabType: number, zoneId?): void {
    this.appService.httpPost('getOrgSortAnalysis.api', { states: zoneId, type: tabType }, data => {
      this.rank = data['data']['sort'] || 0;
      this.averageSale = data['data']['averageAmount'] || 0;
      this.mySale = data['data']['sumAmount'] || 0;
      this.middleNumberSale = data['data']['medianAmount'] || 0;
      this.firstDistance = data['data']['distancefirst'] || 0;
      this.lastDistance = data['data']['distanceLast'] || 0;
      this.percentage = (data['data']['percentage'] + '%') || '0%';
    })
  }

}