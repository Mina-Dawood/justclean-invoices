import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagination',
  pure: false
})
export class PaginationPipe implements PipeTransform {
  transform(arr: Array<any>, page: number): Array<any> {
    if (arr && page === undefined) return arr;
    return arr.slice(page * 50, page * 50 + 50);
  }

}
