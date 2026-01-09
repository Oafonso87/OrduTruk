import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { Button } from '../../components/button/button';
import { Header } from "../../components/header/header";
import { Footer } from '../../components/footer/footer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, Header, Footer, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private titulo: Title) {
    this.titulo.setTitle("OrduTruk");
  }


}