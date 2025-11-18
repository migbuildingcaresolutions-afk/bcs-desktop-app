/**
 * Xactimate Pricing Engine - Professional Construction Estimating
 * Handles pricing calculations, markups, and tax for 2020+ line items
 */

export interface XactimateLineItem {
  xactimate_code: string;
  item_name: string;
  category: string;
  description: string;
  unit: string;
  unit_price: number;
  labor_hours: number;
  material_cost: number;
  equipment_cost: number;
  tax_rate: number;
  overhead_rate?: number;
  profit_margin?: number;
}

export interface EstimateLineItem extends XactimateLineItem {
  quantity: number;
  subtotal: number;
  total_labor: number;
  total_materials: number;
  total_equipment: number;
  tax_amount: number;
  line_total: number;
}

export class XactimatePricingEngine {
  private defaultOverheadRate = 15; // 15%
  private defaultProfitMargin = 20; // 20%
  private laborRate = 65.00; // $65/hour

  /**
   * Calculate total cost for a single line item with quantity
   */
  calculateLineItem(
    item: XactimateLineItem,
    quantity: number,
    overrideOverhead?: number,
    overrideProfit?: number
  ): EstimateLineItem {
    const overhead = overrideOverhead ?? item.overhead_rate ?? this.defaultOverheadRate;
    const profit = overrideProfit ?? item.profit_margin ?? this.defaultProfitMargin;

    // Base calculations
    const totalLabor = (item.labor_hours * this.laborRate) * quantity;
    const totalMaterials = item.material_cost * quantity;
    const totalEquipment = item.equipment_cost * quantity;

    // Subtotal before overhead and profit
    const subtotalBeforeMarkup = totalLabor + totalMaterials + totalEquipment;

    // Apply overhead
    const overheadAmount = subtotalBeforeMarkup * (overhead / 100);

    // Subtotal after overhead
    const subtotalWithOverhead = subtotalBeforeMarkup + overheadAmount;

    // Apply profit margin
    const profitAmount = subtotalWithOverhead * (profit / 100);

    // Subtotal before tax
    const subtotal = subtotalWithOverhead + profitAmount;

    // Calculate tax
    const taxAmount = subtotal * (item.tax_rate / 100);

    // Final line total
    const lineTotal = subtotal + taxAmount;

    return {
      ...item,
      quantity,
      subtotal,
      total_labor: totalLabor,
      total_materials: totalMaterials,
      total_equipment: totalEquipment,
      tax_amount: taxAmount,
      line_total: lineTotal,
      overhead_rate: overhead,
      profit_margin: profit
    };
  }

  /**
   * Calculate estimate total from multiple line items
   */
  calculateEstimate(lineItems: EstimateLineItem[]): {
    subtotal: number;
    totalLabor: number;
    totalMaterials: number;
    totalEquipment: number;
    totalTax: number;
    grandTotal: number;
    itemCount: number;
  } {
    const totals = lineItems.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.subtotal,
        totalLabor: acc.totalLabor + item.total_labor,
        totalMaterials: acc.totalMaterials + item.total_materials,
        totalEquipment: acc.totalEquipment + item.total_equipment,
        totalTax: acc.totalTax + item.tax_amount,
        grandTotal: acc.grandTotal + item.line_total,
      }),
      {
        subtotal: 0,
        totalLabor: 0,
        totalMaterials: 0,
        totalEquipment: 0,
        totalTax: 0,
        grandTotal: 0,
      }
    );

    return {
      ...totals,
      itemCount: lineItems.length,
    };
  }

  /**
   * Search Xactimate items by code or name
   */
  searchItems(
    allItems: XactimateLineItem[],
    searchTerm: string
  ): XactimateLineItem[] {
    const term = searchTerm.toLowerCase();
    return allItems.filter(
      (item) =>
        item.xactimate_code.toLowerCase().includes(term) ||
        item.item_name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    );
  }

  /**
   * Filter items by category
   */
  filterByCategory(
    allItems: XactimateLineItem[],
    category: string
  ): XactimateLineItem[] {
    return allItems.filter((item) => item.category === category);
  }

  /**
   * Get all unique categories
   */
  getCategories(allItems: XactimateLineItem[]): string[] {
    const categories = new Set(allItems.map((item) => item.category));
    return Array.from(categories).sort();
  }

  /**
   * Apply bulk discount to estimate
   */
  applyDiscount(
    estimate: { grandTotal: number; subtotal: number; totalTax: number },
    discountPercent: number
  ): {
    originalTotal: number;
    discountAmount: number;
    newSubtotal: number;
    newTax: number;
    newGrandTotal: number;
  } {
    const discountAmount = estimate.subtotal * (discountPercent / 100);
    const newSubtotal = estimate.subtotal - discountAmount;
    const taxRate = estimate.totalTax / estimate.subtotal;
    const newTax = newSubtotal * taxRate;
    const newGrandTotal = newSubtotal + newTax;

    return {
      originalTotal: estimate.grandTotal,
      discountAmount,
      newSubtotal,
      newTax,
      newGrandTotal,
    };
  }

  /**
   * Convert units (e.g., SF to SY, LF to EA)
   */
  convertUnits(
    quantity: number,
    fromUnit: string,
    toUnit: string
  ): number {
    const conversionTable: { [key: string]: { [key: string]: number } } = {
      SF: { SY: 1 / 9, SQ: 1 / 100 }, // Square feet to square yards or squares
      SY: { SF: 9 }, // Square yards to square feet
      LF: { FT: 1 }, // Linear feet (same as feet)
      GAL: { QT: 4, PT: 8 }, // Gallons to quarts or pints
      HR: { MIN: 60 }, // Hours to minutes
    };

    if (fromUnit === toUnit) return quantity;

    const conversion = conversionTable[fromUnit]?.[toUnit];
    if (!conversion) {
      throw new Error(`Conversion from ${fromUnit} to ${toUnit} not supported`);
    }

    return quantity * conversion;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Generate estimate PDF data structure
   */
  generateEstimatePDF(
    clientInfo: {
      name: string;
      address: string;
      phone: string;
      email: string;
    },
    lineItems: EstimateLineItem[],
    notes?: string
  ): {
    client: typeof clientInfo;
    items: EstimateLineItem[];
    totals: ReturnType<typeof this.calculateEstimate>;
    notes?: string;
    date: string;
    estimateNumber: string;
  } {
    const totals = this.calculateEstimate(lineItems);
    const estimateNumber = `EST-${Date.now()}`;

    return {
      client: clientInfo,
      items: lineItems,
      totals,
      notes,
      date: new Date().toISOString(),
      estimateNumber,
    };
  }
}

// Export singleton instance
export const pricingEngine = new XactimatePricingEngine();
