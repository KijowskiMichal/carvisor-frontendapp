import { Pipe, PipeTransform } from '@angular/core';
import {ListOfUser} from "../services/eco.service";

@Pipe({
  name: 'sortEcoPoints'
})
export class SortEcoPointsPipe implements PipeTransform {

  transform(value: ListOfUser[], ...args: unknown[]): unknown {
    return value.sort((a: ListOfUser, b:ListOfUser) => {
      return a.rate - b.rate;
    });
  }

}
