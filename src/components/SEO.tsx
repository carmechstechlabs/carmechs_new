import { Helmet } from "react-helmet-async";
import { useData } from "@/context/DataContext";

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
  slug?: string;
}

export function SEO({ title, description, keywords, ogImage, noIndex, slug }: SeoProps) {
  const { uiSettings, settings } = useData();
  const defaults = uiSettings.seo;

  const seoTitle = title || defaults.metaTitle;
  const seoDescription = description || defaults.metaDescription;
  const seoKeywords = keywords || defaults.keywords;
  const seoOgImage = ogImage || defaults.ogImage;
  const shouldIndex = noIndex !== undefined ? !noIndex : defaults.enableIndexing;

  const domain = settings.domainName || "carmechs.in";
  const url = `https://${domain}${slug ? (slug === 'home' ? '' : '/' + slug) : ''}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      {!shouldIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      {seoOgImage && <meta property="og:image" content={seoOgImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      {seoOgImage && <meta property="twitter:image" content={seoOgImage} />}
    </Helmet>
  );
}
