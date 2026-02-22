import SVG from 'react-inlinesvg';

type LegacyIconProps = {
  className?: string;
  type?: string;
  color?: string;
  height?: string | number;
  width?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  [key: string]: unknown;
};

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
}: LegacyIconProps) {
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
