import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public display: boolean = false;

  constructor() {}

  public openSidebar(): void {
    this.display = true;
  }
}
