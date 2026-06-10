import { CalculatorService } from "./calculator.service";

describe("CalculatorService", () => {
  it("calculates total by service price and quantity", async () => {
    const service = new CalculatorService({
      findAll: async () => [
        { id: "cosmetic-renovation", title: "Косметический ремонт", description: "", price: 2000, unit: "м²", icon: "", category: "" }
      ]
    } as never);

    await expect(service.estimate({ items: [{ serviceId: "cosmetic-renovation", quantity: 10 }] })).resolves.toEqual({ total: 20000 });
  });
});
