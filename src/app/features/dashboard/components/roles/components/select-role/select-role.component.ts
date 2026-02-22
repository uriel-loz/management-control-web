import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'roles-select-role',
  imports: [MatSelectModule],
  templateUrl: './select-role.component.html',
  styleUrl: './select-role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRole { 
  private apiService = inject(ApiService);
  roles = toSignal(
    this.apiService.getRoles().pipe(
      map(response => response.data)
    ), 
    { initialValue: null }
  );
}
