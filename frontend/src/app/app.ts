import { Component, signal } from '@angular/core';
import { Shell } from './core/layout/shell/shell';


@Component({
  selector: 'webpreneur-root',
  imports: [Shell],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('webpreneur-hu');
}
