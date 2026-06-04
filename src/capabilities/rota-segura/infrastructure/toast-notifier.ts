import { toast } from 'react-toastify';

import type { INotifier } from '../domain/ports';

/**
 * Visible-notification adapter wrapping react-toastify. Implements the
 * `INotifier` port so use-cases depend only on the contract; swapping the
 * toast library is a one-file change in the composition root.
 *
 * Port-with-stake vs presentational: kept behind the port because the
 * scaffold's `INotifier` is the shared contract every capability uses.
 */
export const toastNotifier: INotifier = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  warning: (message) => {
    toast.warning(message);
  },
  info: (message) => {
    toast.info(message);
  },
  dismiss: () => {
    toast.dismiss();
  },
};
