import { Component, computed, inject } from '@angular/core';
import { ModuleService } from '../../services/module.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class Sidebar {
  private moduleService = inject(ModuleService);
  sections = computed(() => this.moduleService.modulesResource.value()?.data ?? []);
}
