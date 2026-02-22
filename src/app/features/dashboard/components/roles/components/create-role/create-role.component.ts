import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'roles-create-role',
  imports: [MatButtonModule],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateRole {}
