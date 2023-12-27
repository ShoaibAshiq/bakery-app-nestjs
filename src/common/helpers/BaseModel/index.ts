// import { plainToInstance, instanceToPlain } from 'class-transformer';

// export abstract class BaseModel<T> {
//   static from(data: T): this {
//     // Obtain the concrete class name:
//     const modelClass = this as any;
//     // Use the class name to create an instance:
//     return plainToInstance(modelClass, instanceToPlain(data));
//   }

//   static fromMany(data: T[]): this[] {
//     // Obtain the concrete class name:
//     const modelClass = this as any;
//     // Map data to instances using the class name:
//     return data.map((item) => modelClass.from(item));
//   }
// }
