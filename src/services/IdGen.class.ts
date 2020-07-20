import { v4 } from "uuid";

export default class IdGenerator {

    public generateId = (): string => (v4());
};