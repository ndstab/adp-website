import {Cloud, Cpu, Drone, Server, ShieldCheck, type LucideProps} from 'lucide-react';
import type {Pillar} from '@/content/schema';

const icons = {
  cpu: Cpu,
  shield: ShieldCheck,
  cloud: Cloud,
  server: Server,
  drone: Drone
} as const;

export function PillarIcon({icon, ...props}: {icon: Pillar['icon']} & LucideProps) {
  const Icon = icons[icon];
  return <Icon strokeWidth={1.5} aria-hidden {...props} />;
}
