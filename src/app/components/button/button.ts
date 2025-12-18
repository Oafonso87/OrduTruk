import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label: string = '';
  @Input() class: string = '';
  @Input() routerLink: string = '';
  @Input() icon: string = '';

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate([this.routerLink]);
  }
}
