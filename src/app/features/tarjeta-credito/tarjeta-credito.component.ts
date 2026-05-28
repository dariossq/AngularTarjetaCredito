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
  editingTarjetaId: number | null = null;
  modalTitle = '';
  mensajeExito = '';
  mostrarModal = false;
  // Confirmación de eliminación
  confirmVisible = false;
  confirmMessage = '';
  private confirmTarget: { id: number; index: number } | null = null;
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

    const request$ = this.editingTarjetaId
      ? this.tarjetaService.actualizarTarjeta(this.editingTarjetaId, tarjeta)
      : this.tarjetaService.crearTarjeta(tarjeta);

    request$.subscribe({
      next: (tarjetaGuardada) => {
        this.cargando = false;

        if (this.editingTarjetaId !== null) {
          const index = this.listTarjetas.findIndex(t => t.id === this.editingTarjetaId);
          const tarjetaActualizada = tarjetaGuardada ?? {
            id: this.editingTarjetaId,
            titular: tarjeta.titular,
            numeroTarjeta: tarjeta.numeroTarjeta,
            fechaExpiracion: tarjeta.fechaExpiracion,
            cvv: tarjeta.cvv,
          };

          if (index !== -1) {
            this.listTarjetas[index] = tarjetaActualizada;
          }
          this.modalTitle = '¡Actualización exitosa!';
          this.mensajeExito = 'La tarjeta se actualizó con éxito.';
        } else {
          this.listTarjetas.push(tarjetaGuardada as Tarjeta);
          this.modalTitle = '¡Registro exitoso!';
          this.mensajeExito = 'La tarjeta se registró con éxito.';
        }

        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
        this.resetForm();
      },
      error: (err) => {
        this.cargando = false;
        console.error(this.editingTarjetaId ? 'Error actualizar tarjeta' : 'Error crear tarjeta', err);
        this.modalTitle = 'Error';
        this.mensajeExito = this.editingTarjetaId
          ? 'Error al actualizar la tarjeta. Intente de nuevo.'
          : 'Error al registrar la tarjeta. Intente de nuevo.';
        this.mostrarModal = true;
        if (this.modalTimer) clearTimeout(this.modalTimer);
        this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 5000);
      }
    });
  }

  editarTarjeta(tarjeta: Tarjeta) {
    if (!tarjeta.id) {
      console.warn('Tarjeta sin id, no se puede editar', tarjeta);
      return;
    }

    this.editingTarjetaId = tarjeta.id;
    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv,
    });
  }

  cancelarEdicion() {
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.editingTarjetaId = null;
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

  // Mostrar diálogo de confirmación antes de eliminar
  showConfirmDelete(tarjetaId: number | undefined, index: number) {
    if (!tarjetaId) {
      this.mensajeExito = 'No se puede eliminar: identificador inválido.';
      this.mostrarModal = true;
      if (this.modalTimer) clearTimeout(this.modalTimer);
      this.modalTimer = setTimeout(() => this.zone.run(() => this.closeModal()), 4000);
      return;
    }

    this.confirmTarget = { id: tarjetaId, index };
    this.confirmMessage = '¿Estás seguro que deseas eliminar esta tarjeta?';
    this.confirmVisible = true;
  }

  confirmDelete() {
    if (!this.confirmTarget) return;
    // ocultar confirmación antes de llamar al servicio
    this.confirmVisible = false;
    this.eliminarTarjeta(this.confirmTarget.id, this.confirmTarget.index);
    this.confirmTarget = null;
  }

  cancelConfirm() {
    this.confirmVisible = false;
    this.confirmTarget = null;
  }

  private cargarTarjetas() {
    this.cargando = true;
    this.tarjetaService.listarTarjetas().subscribe({
      next: (data) => {
        this.cargando = false;
        this.listTarjetas = data || [];
        console.debug('cargarTarjetas: datos recibidos', this.listTarjetas);
        // Forzar la detección de cambios por si la vista no se actualiza inmediatamente
        try {
          this.cdr.detectChanges();
        } catch (e) {
          console.warn('detectChanges falló en cargarTarjetas', e);
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error cargar tarjetas', err);
      }
    });
  }

}