import { TranslateDefaultParser } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class TranslateAppParser extends TranslateDefaultParser {
  getValue(target: any, key: string): any {
    target = super.getValue(target, key);
    if (target instanceof Array) {
      target = target.join(' ');
    }
    return target;
  }
}
