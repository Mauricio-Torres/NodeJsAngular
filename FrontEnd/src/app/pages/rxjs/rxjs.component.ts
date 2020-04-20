import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription, } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  suscription: Subscription;

  constructor() {


    this.suscription = this.returnObserver().pipe(
      retry(2) ).subscribe(
      numero => { console.log('Imprimir: ' + numero)},
      error => console.error('fallo Algo en el observer'),
      () => console.log('finaliza observer')

      );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  returnObserver(): Observable<any> {

    return new Observable ( (observer) => {
      let count = 0;
      let interval = setInterval(() => {
        count++;

        const salida = { valor: count };

        observer.next(salida);

        if ( count === 3) {
          clearInterval(interval);
          observer.complete();
        }

       /* if( count === 2) {
          clearInterval(interval);
          observer.error('Auxilio !!! ');
        } */

      }, 1000);

    }).pipe(

       map( (response: any) =>  response.valor ),
       filter( (data: any, index:number) => {
        if (data % 2 === 0) {
          return true;
        } else {
          return false;
        }
       }));
  }

}
