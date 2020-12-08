import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'null'
})
export class NullPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return (!!value || value === 0) ? value : '--';
  }

}
