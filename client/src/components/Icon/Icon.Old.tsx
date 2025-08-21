import SVG from 'react-inlinesvg';
import { IconInterface } from './Icon.interface';

export function Icon({
  className = '',
  type,
  color = '#a0a0a0',
  height = '20px',
  width = '20px',
  onClick,
  disabled,
  active,
  ...props
}: IconInterface) {
  const defaultProps = {
    className: `icon-${type} ${active ? ' active' : ''}${
      disabled ? ' disabled' : ''
    } ${className}`,
    width: width,
    height: height,
    fill: color,
    onClick,
  };
  switch (type) {
    default:
      return <SVG src={`/svg/${type}.svg`} {...defaultProps} {...props} />;
  }
}
