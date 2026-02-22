import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SelectRole } from './components/select-role/select-role.component';
import { CreateRole } from './components/create-role/create-role.component';
import { DeleteRole } from './components/delete-role/delete-role.component';

@Component({
  selector: 'dashboard-roles',
  imports: [
    MatCardModule,
    SelectRole,
    CreateRole,
    DeleteRole,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class Roles {

}
