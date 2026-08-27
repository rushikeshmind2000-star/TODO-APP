import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './index';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', confirmVariant = 'danger' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={false}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant={confirmVariant} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'var(--space-2) 0' }}>
        <div style={{ 
          width: 56, height: 56, borderRadius: '50%', background: '#fee2e2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-4)'
        }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          {title || 'Confirm Action'}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '90%' }}>
          {message}
        </p>
      </div>
    </Modal>
  );
}
