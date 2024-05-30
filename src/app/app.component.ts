import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { ToastType } from './shared/models/toast.models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from './shared/services/toast/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'toastifyz';
  durationCtrl: FormControl<number | null>;
  typeCtrl: FormControl<ToastType | null>;
  textCtrl: FormControl<string | null>;

  public toastForm?: FormGroup<{
    duration: FormControl<number | null>;
    text: FormControl<string | null>;
    type: FormControl<ToastType | null>;
  }>;
  public toastConfig = inject(ToastService).toastConfig;

  constructor(
    public formBuilder: FormBuilder,
    public toastService: ToastService
  ) {
    this.durationCtrl = this.formBuilder.control(5000, Validators.required);
    this.typeCtrl = this.formBuilder.control<ToastType>(
      'success',
      Validators.required
    );
    this.textCtrl = this.formBuilder.control(
      'Great ! You just created a user',
      Validators.required
    );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm() {
    this.toastForm = this.formBuilder.group({
      duration: this.durationCtrl,
      text: this.textCtrl,
      type: this.typeCtrl,
    });
  }

  public launchToast() {
    this.toastService.toastConfig.next({
      ...this.toastForm!.value,
      isOpened: true,
    } as any);
  }
}
