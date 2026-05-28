import { ChangeDetectorRef, Component, NgZone, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Para usar *ngFor en el HTML
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TarjetaService } from '../../shared/services/tarjeta.service';
import { Tarjeta } from '../../shared/models/tarjeta.interface';

@Component({
  standalone: true,
  selector: 'app-tarjeta-credito',
  // IMPORTANTE: Agregamos las herramientas aquí para que este componente standalone las reconozca
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css'],
})
export class TarjetaCreditoComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Lista de tarjetas obtenidas del backend
  listTarjetas: Tarjeta[] = [];

  // Definimos la propiedad para controlar nuestro formulario reactivo
  form: FormGroup;
  modalTitle = '';
  mensajeExito = '';
  mostrarModal = false;
  cargando = false;
  private modalTimer?: ReturnType<typeof setTimeout>;

  // Inyectamos FormBuilder, ChangeDetectorRef, NgZone y TarjetaService en el constructor
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private tarjetaService: TarjetaService
  ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarTarjetas();
    }
  }

  // Método que procesa el envío de la información y llama al backend
  agregarTarjeta() {
    if (!this.form.valid) return;

    const tarjeta: Tarjeta = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    };

    this.cargando = true;
    this.tarjetaService.crearTarjeta(tarjeta).subscribe({
      next: (tarjetaCreada) => {
        this.cargando = false;
        this.listTarjetas.push(tarjetaCreada);
        this.modalTitle = '¡Registro exitoso!';
        this.mensajeExito = 'La tarjeta se registró con éxito.';
        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
        this.form.reset();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error crear tarjeta', err);
        this.modalTitle = 'Error';
        this.mensajeExito = 'Error al registrar la tarjeta. Intente de nuevo.';
        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
      }
    });
  }

  closeModal() {
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
      this.modalTimer = undefined;
    }
    this.mostrarModal = false;
    this.mensajeExito = '';
    this.cdr.detectChanges();
  }

  eliminarTarjeta(tarjetaId: number | undefined, index: number) {
    if (!tarjetaId) return;
    this.cargando = true;
    this.tarjetaService.eliminarTarjeta(tarjetaId).subscribe({
      next: () => {
        this.cargando = false;
        this.listTarjetas.splice(index, 1);
        this.mensajeExito = 'La tarjeta fue eliminada con éxito!';
        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error eliminar tarjeta', err);
        this.mensajeExito = 'Error al eliminar la tarjeta. Intente de nuevo.';
        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
      }
    });
  }

  private cargarTarjetas() {
    this.cargando = true;
    this.tarjetaService.listarTarjetas().subscribe({
      next: (data) => {
        this.cargando = false;
        this.listTarjetas = data || [];
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error cargar tarjetas', err);
      }
    });
  }

}