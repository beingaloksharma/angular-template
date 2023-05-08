import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstletter',
  pure: true
})
export class FirstletterPipe implements PipeTransform {

  transform(value: string): string {
    return value.charAt(0);
  }

}
