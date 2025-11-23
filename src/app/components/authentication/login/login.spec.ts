import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login'; // ← Cambia Login por LoginComponent

describe('LoginComponent', () => { // ← Cambia 'Login' por 'LoginComponent'
  let component: LoginComponent;   // ← Cambia Login por LoginComponent
  let fixture: ComponentFixture<LoginComponent>; // ← Cambia Login por LoginComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent] // ← Asegúrate de que sea LoginComponent
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent); // ← Cambia aquí
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});