import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-common-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-component.component.html',
  styleUrl: './common-component.component.css',
})
export class CommonComponentComponent {}
