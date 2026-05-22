import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor en el HTML
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Herramientas de formularios

@Component({
  standalone: true,
  selector: 'app-tarjeta-credito',
  // IMPORTANTE: Agregamos las herramientas aquí para que este componente standalone las reconozca
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './tarjeta-credito.html',
  styleUrls: ['./tarjeta-credito.css'],
})
export class TarjetaCredito {
  // Aquí colocas tu arreglo de tarjetas
  listTarjetas: any[] = [
    { titular: 'Juan Perez', numeroTarjeta: '252525262', fechaExpiracion: '11/23', cvv: '123' },
    { titular: 'Miguel Gonzalez', numeroTarjeta: '252525262', fechaExpiracion: '11/24', cvv: '312' }
  ];

  // Definimos la propiedad para controlar nuestro formulario reactivo
  form: FormGroup;

  // Inyectamos FormBuilder en el constructor para armar la estructura del formulario
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });
  }

  // Método que procesa el envío de la información
  agregarTarjeta() {
    console.log(this.form.value); // Para verificar que los datos se están capturando correctamente
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    };

    console.log(tarjeta);

    // Agregamos el objeto al arreglo para refrescar el listado
     this.listTarjetas.push(tarjeta);

    // Limpiamos los campos del formulario
    this.form.reset();
  }
}