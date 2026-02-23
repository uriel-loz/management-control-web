import { Component, inject } from '@angular/core';
import { MatCheckbox } from "@angular/material/checkbox";
import { ApiService } from '../../services/api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'roles-permissions',
  imports: [MatCheckbox],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class Permissions { 
  private apiService = inject(ApiService);
  
  sectionsModules = toSignal(
    this.apiService.getModules().pipe(
      map(response => response.data)
    ),
    { initialValue: null }
  );
}
