import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styles: []
})
export class BreadcrumsComponent implements OnInit {

  public titulo: any;
  constructor(private router: Router, private title: Title, private meta: Meta) {

    this.getDataRouter().subscribe( data => {
      console.log(data);
      this.titulo = data.titulo;
      this.title.setTitle(data.titulo);

      const metaTag: MetaDefinition = {
        name: 'description',
        content: this.titulo
      };

      this.meta.updateTag(metaTag);

    });

   }

  ngOnInit() {
  }

  getDataRouter(): Observable <any> {

    return this.router.events.pipe(
      filter(event2 => event2 instanceof ActivationEnd),
      filter( (event2: ActivationEnd ) => event2.snapshot.firstChild === null),
      map( (event2: ActivationEnd) => event2.snapshot.data )
    );
  }

}
