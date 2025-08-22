"use client"

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal"
import { Button } from "@heroui/button"
import { type GalleryItem } from "@/lib/gallery-storage"

interface DeleteConfirmationState {
  isOpen: boolean
  type: 'item' | 'bulk'
  itemId?: string
  bulkType?: GalleryItem['type']
  itemName?: string
}

interface DeleteConfirmationDialogProps {
  deleteConfirmation: DeleteConfirmationState
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({
  deleteConfirmation,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <Modal 
      isOpen={deleteConfirmation.isOpen} 
      onOpenChange={(open: boolean) => !open && onCancel()}
      isDismissable
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {deleteConfirmation.type === 'item' ? 'Delete Item' : 'Clear Gallery'}
            </ModalHeader>
            <ModalBody>
              <p>
                {deleteConfirmation.type === 'item' ? (
                  <>Are you sure you want to delete &quot;{deleteConfirmation.itemName}&quot;? This action cannot be undone.</>
                ) : (
                  <>
                    {deleteConfirmation.bulkType ? (
                      <>Are you sure you want to clear all {deleteConfirmation.bulkType} images? This will permanently delete all {deleteConfirmation.bulkType} items from your gallery.</>
                    ) : (
                      <>Are you sure you want to clear the entire gallery? This will permanently delete all items from your gallery.</>
                    )}
                  </>
                )}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onCancel}>
                Cancel
              </Button>
              <Button 
                color="danger" 
                onPress={onConfirm}
              >
                {deleteConfirmation.type === 'item' ? 'Delete' : 'Clear'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export type { DeleteConfirmationState }