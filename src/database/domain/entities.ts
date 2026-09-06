export interface Device {
  id: string;
  fingerprint: string;          // sha256 normalizado
  installId: string;
  platform: 'android';
  appVersion: string;
  firstSeenAt: Date;
  trialDays: number;
  trialEndsAt: Date;            // siempre calculada en servidor
  renewals: number;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Code {
  id: string;
  code: string;                 // normalizado uppercase
  createdBy: string | null;
  createdAt: Date;
  usedAt: Date | null;
  usedByDeviceId: string | null;
  maxUses: number;
}

export interface License {
  id: string;
  deviceId: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface Attempt {
  id: string;
  deviceId: string | null;
  codeTried: string;
  ip: string;
  userAgent: string;
  success: boolean;
  createdAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export enum TrialResult {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  ALREADY_TRIALED = 'ALREADY_TRIALED',
  CODE_INVALID = 'CODE_INVALID',
  CODE_ALREADY_USED = 'CODE_ALREADY_USED',
  DEVICE_ALREADY_TRIALED = 'DEVICE_ALREADY_TRIALED',
  RENEWAL_LIMIT_REACHED = 'RENEWAL_LIMIT_REACHED',
}

export enum CodeStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
}