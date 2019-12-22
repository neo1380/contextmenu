import {Component,OnDestroy,Input,Renderer2,Inject,forwardRef, ChangeDetectorRef, AfterViewInit, EventEmitter, Output} from '@angular/core';
import {DomHandler} from '../utils/domhandler';
import {MenuItem} from '../../icontextmenu';
import {IContextMenu} from '../../icontextmenu/icontextmenu';


@Component({
    selector: 'icontextsubmenu',
    templateUrl: './icontextsubmenu.component.html'
})
export class IContextSubMenu implements AfterViewInit, OnDestroy {

    @Output() itemClicked = new EventEmitter<MenuItem>();

    @Input() item: MenuItem;
    
    @Input() root: boolean;

    @Input() autoZIndex: boolean = true;
    
    @Input() baseZIndex: number = 0;

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }
    set parentActive(value) {
        this._parentActive = value;

        if (!value) {
            this.activeItem = null;
        }
    }

    icontextMenu: IContextMenu;

    _parentActive: boolean;

    rootItemClick: boolean;

    documentClickListener: any;

    ngAfterViewInit() {
        if(this.root && !this.icontextMenu.popup) {
            this.bindDocumentClickListener();
        }
    }
    
    constructor(@Inject(forwardRef(() => IContextMenu)) icontextMenu, private cf: ChangeDetectorRef, public renderer: Renderer2) {
        this.icontextMenu = icontextMenu as IContextMenu;
    }

    activeItem: HTMLLIElement;

    onItemMouseEnter(event: Event, item: HTMLLIElement, menuitem: MenuItem) {
        if (this.icontextMenu.popup || (!this.root || this.activeItem)) {
            if (menuitem.disabled) {
                return;
            }

            this.activeItem = item;
            let nextElement:  HTMLElement =  <HTMLElement> item.children[0].nextElementSibling;
            if (nextElement) {
                let sublist:  HTMLElement = <HTMLElement> nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                            
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';
            }
        }
    }
    
    itemClick(event: Event, item: HTMLLIElement, menuitem: MenuItem) {
        if (menuitem.disabled) {
            event.preventDefault();
            return true;
        }
        
        if (!menuitem.url) {
            event.preventDefault();
        }
        
        if (menuitem.command) {            
            menuitem.command({
                originalEvent: event,
                item: item
            });
        }

        if (this.root && !this.activeItem && !this.icontextMenu.popup ) {
            this.activeItem = item;
            let nextElement:  HTMLElement =  <HTMLElement> item.children[0].nextElementSibling;
            if (nextElement) {
                let sublist:  HTMLElement = <HTMLElement> nextElement.children[0];
                if (this.autoZIndex) {
                    sublist.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                sublist.style.zIndex = String(++DomHandler.zindex);
                            
                sublist.style.top = '0px';
                sublist.style.left = DomHandler.getOuterWidth(item.children[0]) + 'px';

                this.rootItemClick = true;
            }
        }

        if (!menuitem.items && this.icontextMenu.popup) {
            this.icontextMenu.hide();
        }

       this.menuItemClicked(menuitem);
    }
    
    menuItemClicked(menuitem){
      this.itemClicked.emit(menuitem);
    }

    listClick(event: Event) {
        if (!this.rootItemClick) {
            this.activeItem = null;
        }
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', () => {
                if (!this.rootItemClick) {
                    this.parentActive = false;
                    this.activeItem = null;
                }

                this.rootItemClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    ngOnDestroy() {
        if (this.root && !this.icontextMenu.popup) {
            this.unbindDocumentClickListener();
        }
    }
}