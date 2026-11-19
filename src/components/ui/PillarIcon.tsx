import {Blocks, Bot, Cpu, RadioTower, ShieldCheck, type LucideProps} from 'lucide-react';
import type {Pillar} from '@/content/schema';

const icons = {
  cpu: Cpu,
  shield: ShieldCheck,
  radio: RadioTower,
  bot: Bot,
  blocks: Blocks
} as const;

export function PillarIcon({icon, ...props}: {icon: Pillar['icon']} & LucideProps) {
  const Icon = icons[icon];
  return <Icon strokeWidth={1.5} aria-hidden {...props} />;
}
