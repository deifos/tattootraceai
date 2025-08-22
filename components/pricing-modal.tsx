"use client";

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure 
} from '@heroui/modal';


import { PricingTable } from './pricing-table';

interface PricingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ isOpen, onOpenChange }: PricingModalProps) {

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Pricing</h2>
                <p className="text-sm text-gray-600 font-normal">
                  Get AI-powered tattoo designs and simulations
                </p>
              </div>
            </ModalHeader>
            
            <ModalBody className="p-6">
              <PricingTable variant="modal" />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Hook for easy usage
export function usePricingModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return {
    isOpen,
    onOpen,
    onOpenChange,
    PricingModal: (props: Omit<PricingModalProps, 'isOpen' | 'onOpenChange'>) => (
      <PricingModal {...props} isOpen={isOpen} onOpenChange={onOpenChange} />
    ),
  };
}