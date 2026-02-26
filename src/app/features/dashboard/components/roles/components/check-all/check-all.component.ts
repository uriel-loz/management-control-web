import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RolesStateService } from '../../services/roles-state.service';

@Component({
  selector: 'roles-check-all',
  imports: [MatButtonModule],
  templateUrl: './check-all.component.html',
  styleUrl: './check-all.component.scss',
})
export class CheckAll {
  private rolesStateService = inject(RolesStateService);

  checkAll() {
    this.rolesStateService.checkAll();
  }
}
