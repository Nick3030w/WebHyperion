import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-homei',
  imports: [],
  templateUrl: './homei.html',
  styleUrl: './homei.css',
})
export class Homei {
constructor(private renderer: Renderer2) { }

  ngOnInit() {
    // Usa Renderer2 para añadir la clase de forma segura
    // Este estilo 'bg-gradient-primary' hace que el fondo sea azul
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }
}
