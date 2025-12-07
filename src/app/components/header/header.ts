import { Component } from '@angular/core';
import { Ordutruk } from '../ordutruk/ordutruk';
import { Menu } from '../menu/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Ordutruk, Menu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    class: 'header',
  },
})
export class Header {

}
