import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'roles-uncheck-all',
  imports: [MatButtonModule],
  templateUrl: './uncheck-all.component.html',
  styleUrl: './uncheck-all.component.scss',
})
export class UncheckAll {}
