import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'core-card-structure',
  imports: [MatCard, MatCardContent],
  templateUrl: './card-structure.component.html',
  styleUrl: './card-structure.component.scss',
})
export class CardStructure { 
  @Input() title: string = '';
  @Input() description: string = '';
}
