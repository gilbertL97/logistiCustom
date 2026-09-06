export class ActivateRequestDto {
  constructor(
    public code: string,
    public installId: string,
    public fingerprint: string,
    public platform?: string,
    public appVersion?: string,
  ) {}
}