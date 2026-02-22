import type { SVGProps } from 'react';

export interface IconInterface
  extends Omit<SVGProps<SVGSVGElement>, 'type' | 'color'> {
  type?: string;
  color?: string;
  disabled?: boolean;
  active?: boolean;
}

export type IconSvgProps = IconInterface;
