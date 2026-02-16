import { Component, inject } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class Sidebar {
  private moduleService = inject(ModuleService);
  sections = toSignal(
    this.moduleService.getModulesByUser().pipe(
      map(response => response.data)
    ), { initialValue: [] });
}
