const houses = require("../public/data/houses.json");
describe("House Coordinate Validation", () => {
    test("Every house has coordinates within Louisville bounds", () => {
        expect(houses.length).toBeGreaterThan(0);

        houses.forEach((house) => {
            expect(house).toHaveProperty("latitude");
            expect(house).toHaveProperty("longitude");

            expect(house.latitude).toBeGreaterThanOrEqual(37.0);
            expect(house.latitude).toBeLessThanOrEqual(39.0);

            expect(house.longitude).toBeGreaterThanOrEqual(-86.0);
            expect(house.longitude).toBeLessThanOrEqual(-84.0);
        });
    });
});