import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { MyApp } from './app.component';
import { HomePage } from './pages/home/home';
import { AddCardPage } from './pages/add-card/add-card';

import { ComponentsModule } from './components/components.module';
import { AppService } from "./app.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddCardPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: AppService.DB_NAME,
    }),
    ComponentsModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp,
    HomePage,
    AddCardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    Camera,
    Geolocation,
    NativeGeocoder,
    AppService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
