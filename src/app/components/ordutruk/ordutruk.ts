import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-ordutruk',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ordutruk.html',
  styleUrl: './ordutruk.scss',
})

export class Ordutruk implements OnInit {

  public token : String | null = '';

  ngOnInit(): void {
    this.token = localStorage.getItem('access_token');
  }

}
