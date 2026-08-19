export class IAPService {
  static async initialize(): Promise<void> {
    console.log('IAP Service ready');
  }
  static async getOfferings(): Promise<any[]> { return []; }
  static async purchasePackage(_pkg: any): Promise<{ success: boolean }> {
    return { success: true };
  }
  static async restorePurchases(): Promise<boolean> { return false; }
}
