import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCredito } from './tarjeta-credito';

describe('TarjetaCredito', () => {
  let component: TarjetaCredito;
  let fixture: ComponentFixture<TarjetaCredito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaCredito],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaCredito);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
