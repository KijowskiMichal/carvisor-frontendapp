import { Pipe, PipeTransform } from '@angular/core';
import {ListOfUser} from "../services/safety.service";

@Pipe({
  name: 'sortSafetyPoints'
})
export class SortSafetyPointsPipe implements PipeTransform {

  transform(value: ListOfUser[], ...args: unknown[]): unknown {
    return value.sort((a: ListOfUser, b:ListOfUser) => {
      return b.rate - a.rate;
    });
  }

}
