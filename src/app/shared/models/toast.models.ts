export class ToastConfig {
  constructor(
    public duration?: number,
    public isOpened?: boolean,
    public type?: ToastType,
    public text?: string
  ) {}

  public static createNewObject(): ToastConfig {
    return new ToastConfig(5000, false, 'success', '');
  }
}

export type ToastType = 'success' | 'warning' | 'error';
