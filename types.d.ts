// define your mf types here

declare module "aos";

declare module "*.svg" {
  const content: string;
  export default content;
}
interface SVGProps {
  fill?: string;
  className?: string;
  onClick?: () => void;
}
type Props = {
  show?: boolean;
};

type InputProps = {
  id?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
} & (
  | React.InputHTMLAttributes<HTMLInputElement>
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  noDefault?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "primary" | "default" | "secondary" | "danger" | "google";
}

type ModalProps = {
  close?: boolean;
  title?: string;
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
};

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
};

type Tab = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
  defaultValue?: string;
  buttonClassName?: string;
  onChange?: (value: string) => void;
};

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

type TextareaProps = {
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  className?: string;
};

type OTPState = {
  [key: string]: string;
};

interface SpeedTestResult {
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  ping: number | null;
  timestamp: Date;
}

interface NetworkInfoData {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
  isp: string;
  regionalSpeeds: {
    averageDownload: number;
    averageUpload: number;
    averagePing: number;
  };
}

interface ISPAverageSpeedData {
  pingAvg: number;
  samples: number;
  provider: string;
  uploadAvg: number;
  downloadAvg: number;
}

interface NetworkInfoData {
  ip: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
  provider: string;
  regionalSpeeds?: {
    averageDownload: number;
    averageUpload: number;
    averagePing: number;
  };
  timezone?: string;
}

interface NetworkInfo {
  ip: string;
  provider: string;
  location: {
    city: string;
    region: string;
    country: string;
    loc: string;
  };
}

interface AverageSpeedData {
  provider: string;
  downloadAvg: number;
  uploadAvg: number;
  pingAvg: number;
  samples: number;
  averageDownload?: number | null;
  averageUpload?: number | null;
  averagePing?: number | null;
}
