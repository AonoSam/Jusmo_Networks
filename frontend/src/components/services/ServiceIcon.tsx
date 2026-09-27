import {
  Cable,
  Camera,
  ClipboardList,
  Code2,
  Headphones,
  Network,
  Settings2,
  Wifi,
  type LucideIcon,
} from "lucide-react";

// Maps a known icon key (e.g. set via the `service.icon` field in the admin)
// to its Lucide component. Extend this as new service categories are added.
const ICON_BY_KEY: Record<string, LucideIcon> = {
  network: Network,
  fibre: Cable,
  fiber: Cable,
  cable: Cable,
  telecom: Headphones,
  consultancy: Headphones,
  system: Code2,
  software: Code2,
  development: Code2,
  cctv: Camera,
  security: Camera,
  surveillance: Camera,
  project: ClipboardList,
  management: ClipboardList,
  wifi: Wifi,
};

function resolveIcon(name: string, iconKey?: string | null): LucideIcon {
  const key = iconKey?.toLowerCase().trim();
  if (key && ICON_BY_KEY[key]) return ICON_BY_KEY[key];

  // Fall back to guessing from the service name itself, so services
  // added without an explicit icon still get something sensible.
  const value = name.toLowerCase();
  const match = Object.keys(ICON_BY_KEY).find((k) => value.includes(k));
  return match ? ICON_BY_KEY[match] : Settings2;
}

interface ServiceIconProps {
  name: string;
  icon?: string | null;
  size?: number;
  className?: string;
}

function ServiceIcon({ name, icon, size = 22, className }: ServiceIconProps) {
  const Icon = resolveIcon(name, icon);
  return <Icon size={size} className={className} aria-hidden="true" />;
}

export default ServiceIcon;