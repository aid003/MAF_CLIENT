import React from 'react';
import styles from './NotAvailableModal.module.css';

interface NotAvailableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotAvailableModal: React.FC<NotAvailableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2>Функция временно недоступна</h2>
          <p>В данный момент эта функция находится в разработке.</p>
          <p>Пожалуйста, используйте гостевой вход.</p>
          <button className={styles.button} onClick={onClose}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};