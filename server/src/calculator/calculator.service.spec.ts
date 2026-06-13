import { CalculatorService } from "./calculator.service";

describe("CalculatorService", () => {
  it("calculates total by service price and quantity", async () => {
    const service = new CalculatorService({
      findCalculatorItems: async () => [
        { id: "calc-cosmetic-renovation", title: "Косметический ремонт", price: 2000, unit: "м²", category: "Основной ремонт", isActive: true, sortOrder: 10 }
      ]
    } as never);

    await expect(service.estimate({ items: [{ serviceId: "calc-cosmetic-renovation", quantity: 10 }] })).resolves.toEqual({ total: 20000 });
  });
});
