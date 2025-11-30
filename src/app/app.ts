import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ordutruk');
}
