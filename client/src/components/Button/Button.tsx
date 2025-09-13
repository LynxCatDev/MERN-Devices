import React from 'react';

import './Button.scss';
import { Loading } from '../Loading/Loading';

interface Props {
  children: React.ReactNode;
  value?: string | number;
  onClick?: () => void;
  className?: string;
  type?: 'primary' | 'invert' | 'transparent' | 'icon' | 'black';
  disabled?: boolean;
  isLoading?: boolean;
  generalType?: 'button' | 'submit';
  size?: 'small' | 'medium' | 'large' | 'auto' | 'auth';
}

export const Button = ({
  children,
  onClick,
  className = '',
  type = 'primary',
  generalType = 'button',
  disabled,
  isLoading = false,
  size = 'medium',
  ...props
}: Props) => {
  // const onClickHandler = (): void => {
  //   if (onClick !== undefined) {
  //     return onClick();
  //   }
  // };

  return (
    <button
      className={`button button-type-${type} button-type-${size} ${
        disabled ? 'disabled' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
      type={generalType}
    >
      {isLoading ? <Loading /> : ''}
      {children}
    </button>
  );
};
