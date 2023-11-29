import type { Request } from 'express'
import { AnyZodObject, ZodError, z } from 'zod'
import { ErrorHandler } from './errorHandler'

// 2nd approach
export const zodeAsyncParse = async <T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> => {
  try {
    return await schema.parseAsync(req)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ErrorHandler(error.message, 400)
    }
    throw new ErrorHandler(error as string, 400)
  }
}


// export async function zodeAsyncParse1<T extends AnyZodObject>(
//     schema: T,
//     req: Request
//   ): Promise<z.infer<T>> {
//     try {
//       return schema.parseAsync(req)
//     } catch (error) {
//       if (error instanceof ZodError) {
//         throw new ErrorHandler(error.message,400)
//       }
//       throw new ErrorHandler(error,400)
//     }
// }
