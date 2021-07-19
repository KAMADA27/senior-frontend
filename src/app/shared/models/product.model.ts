import { UnitMeasurement } from "../enums/unit-measurement.enum";

export class Product {
    constructor(
        public name: string, 
        public unitMeasurement: UnitMeasurement, 
        public quantity: number,
        public price: number,
        public perishable: boolean,
        public validityDate: string,
        public manufacturingDate: string
    ) {}
}