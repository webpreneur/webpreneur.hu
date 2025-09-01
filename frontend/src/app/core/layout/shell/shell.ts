import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent, ColComponent, RowComponent, GutterDirective } from '@coreui/angular';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'webpreneur-shell',
  imports: [Header, Footer, RouterOutlet, ContainerComponent, ColComponent, RowComponent, GutterDirective],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
