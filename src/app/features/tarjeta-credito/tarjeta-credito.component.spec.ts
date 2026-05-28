import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCreditoComponent } from './tarjeta-credito.component';

describe('TarjetaCreditoComponent', () => {
  let component: TarjetaCreditoComponent;
  let fixture: ComponentFixture<TarjetaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaCreditoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaCreditoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
