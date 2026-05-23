import { Component, signal } from '@angular/core';
import { TarjetaCredito } from './tarjeta-credito/tarjeta-credito';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TarjetaCredito],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('FETarjetaCredito');
}
