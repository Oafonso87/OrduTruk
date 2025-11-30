import { Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Button],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {

}
