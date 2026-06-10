import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseService } from "../database/supabase.service";

@Injectable()
export class UploadsService {
  constructor(private readonly supabase: SupabaseService) {}

  async uploadReviewImages(userId: string, files: Express.Multer.File[]) {
    if (files.length < 1 || files.length > 5) {
      throw new BadRequestException("Upload from 1 to 5 images");
    }

    const urls: string[] = [];

    for (const [index, file] of files.entries()) {
      if (!file.mimetype.startsWith("image/")) {
        throw new BadRequestException("Only image files are allowed");
      }

      const safeName = file.originalname.replace(/[^\w.\-]+/g, "_");
      const path = `${userId}/${Date.now()}-${index}-${safeName}`;
      const { error } = await this.supabase.admin().storage.from("review-images").upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

      if (error) throw error;

      const { data } = this.supabase.admin().storage.from("review-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }
}
