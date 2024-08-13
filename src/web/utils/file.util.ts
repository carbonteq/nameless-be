import type { Multipart, MultipartFile } from "@fastify/multipart"
export type AppFileDetails = Pick<
  MultipartFile,
  "mimetype" | "encoding" | "filename"
> & {
  buff: Buffer
}

export const extractFileDetails = async (
  file: MultipartFile,
): Promise<AppFileDetails> => {
  const buff = await file.toBuffer()
  return {
    filename: file.filename,
    mimetype: file.mimetype,
    encoding: file.encoding,
    buff,
  }
}
