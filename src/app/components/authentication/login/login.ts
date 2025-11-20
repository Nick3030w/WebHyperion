import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../../../services/authentication';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private renderer: Renderer2,
    private authenticationService: Authentication,
    private router: Router) { }

  ngOnInit() {
    // Usa Renderer2 para añadir la clase de forma segura
    // Este estilo 'bg-gradient-primary' hace que el fondo sea azul
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }

  onLogin(form: any): void {
    this.authenticationService.login(form.value).subscribe(
      (res) => {
        localStorage.setItem('accessToken',JSON.parse(JSON.stringify(res)).accessToken);
        this.router.navigateByUrl('/animal');
      }
    );
  }
}
