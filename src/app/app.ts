import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaCredito } from './tarjeta-credito/tarjeta-credito';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, TarjetaCredito],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('FETarjetaCredito');
}
