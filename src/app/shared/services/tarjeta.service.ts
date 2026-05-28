import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Tarjeta } from '../models/tarjeta.interface';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private apiUrl = '/api/Tarjeta';

  constructor(private http: HttpClient) {}

  // Obtener una tarjeta por ID
  obtenerTarjeta(id: number): Observable<Tarjeta> {
    return this.http.get<Tarjeta>(`${this.apiUrl}/${id}`);
  }

  // Obtener todas las tarjetas
  listarTarjetas(): Observable<Tarjeta[]> {
    return this.http.get<Tarjeta[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  // Crear una nueva tarjeta
  crearTarjeta(tarjeta: Tarjeta): Observable<Tarjeta> {
    return this.http.post<Tarjeta>(this.apiUrl, tarjeta);
  }

  // Actualizar una tarjeta existente
  actualizarTarjeta(id: number, tarjeta: Tarjeta): Observable<Tarjeta | null> {
    return this.http.put<Tarjeta | null>(`${this.apiUrl}/${id}`, tarjeta);
  }

  // Eliminar una tarjeta
  eliminarTarjeta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
