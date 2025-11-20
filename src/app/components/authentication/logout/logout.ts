import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {
  constructor(private router: Router,) {
  }

  ngOnInit() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']).then(() => {
    })
  }


}
