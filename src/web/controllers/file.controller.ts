import { Controller, Post } from "@nestjs/common"
import {
  MultipartFastify,
  MultipartFastifyData,
} from "@web/utils/decorators/multipart.decorator"
import { Public } from "@web/utils/decorators/public.decorator"
import { extractFileDetails } from "@web/utils/file.util"

@Public()
@Controller("/api/form")
export class FileController {
  @Post("/file")
  async uploadfile(@MultipartFastify() body: MultipartFastifyData) {
    const { buff } = await extractFileDetails(body.file)
    return { totalbytes: buff.byteLength }
  }
}
