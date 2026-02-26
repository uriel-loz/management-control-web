import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, skip, take } from 'rxjs';
import { RolesStateService } from '../../services/roles-state.service';
import { CreateRoleDialogComponent } from '../dialogs/create-role-dialog/create-role-dialog.component';
import { Roles } from '../../interfaces/roles.interfaces';

@Component({
  selector: 'roles-create-role',
  imports: [MatButtonModule],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.scss',
})
export class CreateRole {
  private readonly dialog = inject(MatDialog);
  private readonly stateService = inject(RolesStateService);
  readonly roles = computed(() => this.stateService.rolesResource.value() ?? []);

  private readonly isLoading$ = toObservable(this.stateService.rolesResource.isLoading);

  openDialog(): void {
    this.dialog
      .open(CreateRoleDialogComponent)
      .afterClosed()
      .subscribe({
        next: (createdId: string | undefined) => {
          if (!createdId) return;

          this.stateService.rolesResource.reload();

          this.isLoading$
            .pipe(
              skip(1),
              filter((loading) => loading === false),
              take(1),
            )
            .subscribe({
              next: () => {
                const select = this.roles().find((role: Roles) => role.id === createdId) ?? null;
                this.stateService.selectRole(select);
              },
            });
        },
      });
  }
}
