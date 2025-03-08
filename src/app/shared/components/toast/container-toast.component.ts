import { Component, inject } from '@angular/core';
import { NgbToastModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toasts-container',
    imports: [NgbToastModule, NgbTooltipModule],
    template: `
		@for (toast of toastService.toasts; track toast) {
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 2000"
				(hidden)="toastService.remove(toast)"
			>
				{{ toast.message }}
			</ngb-toast>
		}
	`,
    host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' }
})
export class ToastsContainerComponent {
	toastService = inject(ToastService);

	ngOnDestroy(){
		// this.toastService.removeAll();
	}
}
