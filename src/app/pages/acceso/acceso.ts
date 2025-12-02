import { Component } from '@angular/core';
import { Button } from '../../components/button/button';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [Button, Header, Footer, RouterLink],
  templateUrl: './acceso.html',
  styleUrl: './acceso.css',
})
export class Acceso {

}
