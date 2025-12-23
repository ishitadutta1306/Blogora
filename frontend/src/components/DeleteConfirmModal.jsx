const DeleteConfirmModal=({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/40 shadow-lg flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border-red-700 p-4 w-72">
                <p className="text-sm mb-4">
                    Are you sure you want to delete this blog?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="text-sm hover:cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="text-sm text-red-600 font-semibold hover:cursor-pointer"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
