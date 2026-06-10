import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../database/supabase.service";
import { UploadsService } from "../uploads/uploads.service";
import { CreateReviewDto } from "./dto";

type ReviewRow = {
  id: string;
  client_name: string;
  review_text: string;
  rating: number;
  avatar_url: string | null;
  created_at: string;
  review_images?: { url: string; sort_order: number }[];
};

@Injectable()
export class ReviewsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly uploads: UploadsService
  ) {}

  async findAll() {
    if (!this.supabase.configured) return [];

    const { data, error } = await this.supabase
      .admin()
      .from("reviews")
      .select("id, client_name, review_text, rating, avatar_url, created_at, review_images(url, sort_order)")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data as ReviewRow[]).map((review) => this.mapReview(review));
  }

  async create(userId: string, dto: CreateReviewDto, files: Express.Multer.File[]) {
    const profile = await this.findProfile(userId);
    const imageUrls = await this.uploads.uploadReviewImages(userId, files);

    const { data, error } = await this.supabase
      .admin()
      .from("reviews")
      .insert({
        user_id: userId,
        client_name: profile.username ?? profile.email ?? "Клиент",
        review_text: dto.reviewText,
        rating: dto.rating,
        avatar_url: profile.avatar_url,
        status: "published"
      })
      .select("id, client_name, review_text, rating, avatar_url, created_at")
      .single();

    if (error) throw error;

    await this.supabase.admin().from("review_images").insert(
      imageUrls.map((url, index) => ({
        review_id: data.id,
        url,
        sort_order: index
      }))
    );

    return this.mapReview({ ...(data as ReviewRow), review_images: imageUrls.map((url, sort_order) => ({ url, sort_order })) });
  }

  private async findProfile(userId: string) {
    const { data } = await this.supabase
      .admin()
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    const { data: user } = await this.supabase.admin().auth.admin.getUserById(userId);

    return {
      username: data?.username as string | null,
      avatar_url: data?.avatar_url as string | null,
      email: user.user?.email
    };
  }

  private mapReview(review: ReviewRow) {
    return {
      id: review.id,
      clientName: review.client_name,
      reviewText: review.review_text,
      rating: review.rating,
      avatarUrl: review.avatar_url,
      images: [...(review.review_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url),
      createdAt: review.created_at
    };
  }
}
