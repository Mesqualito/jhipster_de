import {LOCALE_ID, NgModule} from '@angular/core';
import {DatePipe, registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {CookieService} from 'ngx-cookie-service';
import {MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateParser} from '@ngx-translate/core';
import { TranslateAppParser } from 'app/shared/translateappparser.module';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {
  JhiConfigService,
  JhiLanguageService,
  missingTranslationHandler,
  NgJhipsterModule,
  translatePartialLoader
} from 'ng-jhipster';
import locale from '@angular/common/locales/de';

import * as moment from 'moment';
import {NgbDateAdapter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateMomentAdapter} from 'app/shared/util/datepicker-adapter';

import {AuthInterceptor} from 'app/blocks/interceptor/auth.interceptor';
import {AuthExpiredInterceptor} from 'app/blocks/interceptor/auth-expired.interceptor';
import {ErrorHandlerInterceptor} from 'app/blocks/interceptor/errorhandler.interceptor';
import {NotificationInterceptor} from 'app/blocks/interceptor/notification.interceptor';

import {fontAwesomeIcons} from './icons/font-awesome-icons';

export function createTranslateParser():any {
  return new TranslateAppParser();
}

@NgModule({
  imports: [
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    NgJhipsterModule.forRoot({
      // set below to true to make alerts look like toast
      alertAsToast: false,
      alertTimeout: 5000,
      i18nEnabled: true,
      defaultI18nLang: 'de',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translatePartialLoader,
        deps: [HttpClient],
      },
      parser: { provide: TranslateParser, useFactory: createTranslateParser },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useFactory: missingTranslationHandler,
        deps: [JhiConfigService],
      },
    }),
  ],
  providers: [
    Title,
    CookieService,
    {
      provide: LOCALE_ID,
      useValue: 'de',
    },
    { provide: NgbDateAdapter, useClass: NgbDateMomentAdapter },
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
  ],
})
export class JhipsterDeCoreModule {
  constructor(iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig, languageService: JhiLanguageService) {
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
    languageService.init();
  }
}
