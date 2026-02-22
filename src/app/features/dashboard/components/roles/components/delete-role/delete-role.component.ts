import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'roles-delete-role',
  imports: [MatButtonModule],
  templateUrl: './delete-role.component.html',
  styleUrl: './delete-role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRole {}
