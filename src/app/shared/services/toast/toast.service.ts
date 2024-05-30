import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastConfig } from '../../models/toast.models';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public toastConfig = new Subject<ToastConfig>();
  public toastConfig$: Observable<ToastConfig> =
    this.toastConfig.asObservable();
}
