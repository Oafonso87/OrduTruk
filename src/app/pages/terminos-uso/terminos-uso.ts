import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-terminos-uso',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './terminos-uso.html',
  styleUrl: './terminos-uso.scss',
})
export class TerminosUso {

}
