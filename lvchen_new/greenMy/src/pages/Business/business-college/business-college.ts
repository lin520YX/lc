import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AppGlobal, AppService } from '../../../providers/service-public-service/service-public-service';

/**
 * Generated class for the BusinessCollegePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business-college',
  templateUrl: 'business-college.html',
})
export class BusinessCollegePage {
  public slider: Array<any> = [];
  public newCourse: object = {};
  public myCourses: Array<any> = [];
  public collNum: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appUrl: AppGlobal,
    public appService: AppService,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    // 获取轮播图和新课程
    this.getSlideAndNewCourse();
  }

  // 获取轮播图和新课程
  getSlideAndNewCourse() {
    this.appService.httpPost("business_index.api", {}, (res) => {
      console.log(res);
      if (res.code == 1) {
        let map = res.map;
        // 获取轮播图
        this.slider = map.adList;
        // 获取新课程
        this.newCourse = map.newCourse;
        // 获取我的收藏
        if (map.collCourse) {
          this.myCourses = map.collCourse.slice(0, 4);
          this.collNum = map.collCourse.length;
        }
        else {
          this.myCourses = [];
          this.collNum = 0;
        }
      }
      else {
        this.appService.alert(res.msg);
      }
    });
  }

  // 打开搜索模块
  openSearchModal() {
    this.navCtrl.push('BusinessCourseSerachPage', {}, {
      animation: 'md-transition'
    });
  }

  // 点击导航到下一页
  goNextPage(type) {
    if (type == 1) {
      this.navCtrl.push('BusinessLearnPage', {}, {
        animation: 'md-transition'
      });
    }
    if (type == 2) {
      this.navCtrl.push('BusinessExamPage', { practice: false });
    }
    if (type == 3) {
      this.navCtrl.push('BusinessExamPage', { practice: true });
    }
  }

  // 展开详情页
  goToCourseDetail(id) {
    this.navCtrl.push('BusinessCourseDetailPage', { id: id });
  }

  // 我的课程
  goToMycourse() {
    if (this.collNum <= 0) {
      return;
    }
    this.navCtrl.push('BusinessMyCoursePage');
  }

  // 我的成就
  openModal() {
    this.navCtrl.push('BusinessMyAchievementPage', {}, {
      animation: 'md-transition'
    });
  }
}