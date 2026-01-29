import Swal from 'sweetalert2';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export async function DeleteConfirmationModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmOptions): Promise<boolean> {
  const result = await Swal.fire({
    html: `
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full border-2 border-orange-300 flex items-center justify-center">
          <span class="text-orange-500 text-xl font-bold">!</span>
        </div>
        <h2 class="text-lg font-semibold text-gray-900 mt-2">${title}</h2>
        <p class="text-sm text-gray-600 text-center">${message}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-lg',
      actions: 'flex justify-center gap-3 mt-4',
      confirmButton:
        'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700',
      cancelButton:
        'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300',
    },
  });

  return result.isConfirmed;
}
