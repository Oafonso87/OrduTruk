import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './quienes-somos.html',
  styleUrl: './quienes-somos.scss',
})

export class QuienesSomos {
}
