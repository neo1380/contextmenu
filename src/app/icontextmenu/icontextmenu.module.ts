import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IContextMenu} from './icontextmenu';
import {IContextSubMenu} from './icontextsubmenu/icontextsubmenu.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [CommonModule,RouterModule],
  exports: [IContextMenu,RouterModule],
  declarations: [IContextMenu,IContextSubMenu]
})
export class IContextMenuModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IContextMenuModule
    };
  }
}