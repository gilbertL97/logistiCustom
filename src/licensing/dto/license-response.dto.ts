export class LicenseResponseDto {
  constructor(
    public token: string,
    public deviceId: string,
    public trialEndsAt: Date,
    public serverTime: Date,
  ) {}
}