import { computed, inject, Injectable, Signal } from '@angular/core';
import { ModuleService } from '../../layouts/main-layout/services/module.service';
import { Module } from '../../layouts/main-layout/interfaces/modules.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly moduleService = inject(ModuleService);

  /**
   * Retorna un Signal con los slugs de permisos del módulo indicado.
   * Retorna [] mientras los módulos están cargando o si el módulo no existe.
   */
  forModule(slug: string): Signal<string[]> {
    return computed(() => {
      if (this.moduleService.modulesResource.isLoading()) return [];
      const sections = this.moduleService.modulesResource.value()?.data ?? [];
      const mod = sections.flatMap(s => s.modules ?? []).find(m => m.slug === slug);
      return mod?.permissions?.map(p => p.slug) ?? [];
    });
  }

  /**
   * Retorna un Signal booleano que indica si el usuario tiene el permiso dado.
   */
  has(permissionSlug: string): Signal<boolean> {
    const moduleSlug = permissionSlug.split('.')[0];
    const perms = this.forModule(moduleSlug);
    return computed(() => perms().includes(permissionSlug));
  }
}
