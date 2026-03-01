import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SelectRole } from './components/select-role/select-role.component';
import { CreateRole } from './components/create-role/create-role.component';
import { DeleteRole } from './components/delete-role/delete-role.component';
import { Permissions } from './components/permissions/permissions.component';
import { CheckAll } from './components/check-all/check-all.component';
import { UncheckAll } from './components/uncheck-all/uncheck-all.component';
import { SaveRoles } from './components/save-roles/save-roles.component';
import { RolesStateService } from './services/roles-state.service';
import { CardStructure } from '../../../../core/components/card-structure/card-structure.component';

@Component({
  selector: 'dashboard-roles',
  imports: [
    CardStructure,
    MatDividerModule,
    MatIconModule,
    SelectRole,
    CreateRole,
    DeleteRole,
    Permissions,
    CheckAll,
    UncheckAll,
    SaveRoles,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class Roles {
  readonly stateService = inject(RolesStateService);
}
