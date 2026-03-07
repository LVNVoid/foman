import { getActiveBanners } from "../../actions/banner.actions";
import { BannerCarousel } from "./banner-carousel";

export async function BannerSection() {
    const banners = await getActiveBanners();

    if (banners.length === 0) return null;

    return <BannerCarousel banners={banners} />;
}
