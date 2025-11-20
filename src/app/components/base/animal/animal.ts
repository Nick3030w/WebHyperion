import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalService } from '../../../services/animal-service';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Menu } from '../../menu/menu';


@Component({
  selector: 'app-animal',
  imports: [CommonModule, ReactiveFormsModule, Menu],
  templateUrl: './animal.html',
  styleUrl: './animal.css',
})
export class Animal {

  constructor(private animalService: AnimalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {


  }

  titlePage: string = 'Animalitos';
  animalList: any = [];
  animalForm!: FormGroup;
  editableAnimal: boolean = false;
  idAnimal: any;
  user = 'Usuario';



  ngOnInit() {
    const token = localStorage.getItem("accessToken");

    if (token) {
      this.animalForm = this.formBuilder.group({
        nombre: '',
        edad: 0,
        tipo: '',
        fecha: Date
      });
      this.getAllAnimals();
    } else {
      this.router.navigate(['/'])
    }

  }


  getAllAnimals() {
    this.animalService.getAllAnimalsData(localStorage.getItem('accessToken')).subscribe(
      (data: {}) => {
        this.animalList = data
        console.log(data)
      }
    );
  }

  newAnimalEntry() {
    this.animalService.newAnimal(localStorage.getItem('accessToken'), this.animalForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /animal y recargando la ventana
        this.router.navigate(['/animal']).then(() => {
          this.newMessage('Registro exitoso');
        })
      }
    );
  }


  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  updateAnimalEntry() {
    //Removiendo valores vacios del formulario de actualización
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] === '') {
        this.animalForm.removeControl(key);
      }
    }
    this.animalService.updateAnimal(localStorage.getItem('accessToken'), this.idAnimal, this.animalForm.value).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal editado");
      }
    );
  }

  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log(this.idAnimal)
    this.animalService.getOneAnimal(localStorage.getItem('accessToken'), id).subscribe(
      data => {
        this.animalForm.setValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
          fecha: this.getValidDate(data.fecha)
        });
      }
    );
    this.editableAnimal = !this.editableAnimal;
  }

  getValidDate(fecha: Date) {
    const fechaFinal: Date = new Date(fecha);
    //separado los datos
    var dd = fechaFinal.getDate() + 1;//fue necesario porque siempre daba un día antes
    var mm = fechaFinal.getMonth() + 1; //porque Enero es 0
    var yyyy = fechaFinal.getFullYear();
    var mes = '';
    var dia = '';

    //Como algunos meses tienen 31 días dd puede dar 32
    if (dd == 32) {
      dd = 1;
      mm++;
    }
    //Transformación de fecha cuando el día o mes son menores a 10
    //se le coloca un cero al inicio
    //Día
    if (dd < 10) {
      dia += `0${dd}`;
    } else {
      dia += `${dd}`;
    }
    //Mes
    if (mm < 10) {
      mes += `0${mm}`;
    } else {
      mes += `${mm}`;
    }
    //formatDate para colocar la fecha en un formato aceptado por el calendario
    //GMT-0500 es para Colombia
    var finalDate = formatDate(new Date(yyyy + '-' + mes + '-' + dia + ' GMT-0500'), 'yyyy-MM-dd', "en-US");
    return finalDate;
  }

  deleteAnimalEntry(id: any) {
    console.log(id)
    this.animalService.deleteAnimal(localStorage.getItem('accessToken'), id).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal eliminado");
      }
    );
  }
}
