import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RolesStateService } from '../../services/roles-state.service';

@Component({
  selector: 'roles-uncheck-all',
  imports: [MatButtonModule],
  templateUrl: './uncheck-all.component.html',
  styleUrl: './uncheck-all.component.scss',
})
export class UncheckAll {
  private rolesStateService = inject(RolesStateService);
  
  uncheckAll() {
    this.rolesStateService.uncheckAll();
  }
}
