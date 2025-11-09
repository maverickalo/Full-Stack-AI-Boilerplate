import { BaseComponentProps } from '@/types';
import styles from './Button.module.scss';

interface ButtonProps extends BaseComponentProps {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  className,
  disabled = false,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${className || ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}