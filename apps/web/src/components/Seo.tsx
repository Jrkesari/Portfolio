import { site } from "@jrk/content";

// One page's <head>: title, description, canonical, link previews and structured data.
// React hoists the tags into <head>; the build prerenders every page with them
// (scripts/prerender.ts), so crawlers that don't run JavaScript see the same thing.

const PERSON = `${site.url}/#person`;
const WEBSITE = `${site.url}/#website`;

export const absolute = (path: string) => (path === "/" ? `${site.url}/` : `${site.url}${path}`);

/** Who this site is about. The home page carries it in full; every other page points at it by @id. */
export const person = {
  "@type": "Person",
  "@id": PERSON,
  name: site.name,
  alternateName: site.alternateNames,
  url: `${site.url}/`,
  email: `mailto:${site.email}`,
  description: site.description,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.worksFor },
  alumniOf: { "@type": "CollegeOrUniversity", name: site.alumniOf },
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "IN" },
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: site.knowsAbout,
};

export const website = {
  "@type": "WebSite",
  "@id": WEBSITE,
  name: site.name,
  alternateName: ["jayesh.cv", ...site.alternateNames.slice(0, 1)],
  url: `${site.url}/`,
  inLanguage: "en",
  publisher: { "@id": PERSON },
};

export const author = { "@type": "Person", "@id": PERSON, name: site.name, url: `${site.url}/` };

/** Home › … › this page, as a trail search results can show. */
const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: absolute(t.path),
  })),
});

type Props = {
  /** The whole title, as the tab and the search result show it. */
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
  /** ISO dates, for articles. */
  published?: string;
  tags?: string[];
  /** The schema.org type of this page: WebPage, AboutPage, ProfilePage, CollectionPage. */
  kind?: string;
  /** The trail from Home to here, for breadcrumbs. */
  crumbs?: { name: string; path: string }[];
  /** More schema.org nodes for this page (an article, the site, its author). */
  graph?: object[];
  noindex?: boolean;
};

export function Seo(props: Props) {
  const {
    title,
    description,
    path,
    type = "website",
    published,
    tags,
    kind = "WebPage",
    crumbs,
    graph,
    noindex,
  } = props;
  const url = absolute(path);
  const ld = !noindex && {
    "@context": "https://schema.org",
    "@graph": [webPage(path, title, description, kind), ...(crumbs ? [breadcrumbs(crumbs)] : []), ...(graph ?? [])],
  };
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={url} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {published && <meta property="article:published_time" content={published} />}
      {type === "article" && <meta property="article:author" content={`${site.url}/`} />}
      {tags?.map((t) => (
        <meta key={t} property="article:tag" content={t} />
      ))}
      {ld && (
        <script
          type="application/ld+json"
          // A data block, never run; `<` is escaped so no string in it can close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
        />
      )}
    </>
  );
}

/** A page that's part of the site and about its author. */
const webPage = (path: string, name: string, description: string, kind: string) => ({
  "@type": kind,
  "@id": `${absolute(path)}#page`,
  url: absolute(path),
  name,
  description,
  isPartOf: { "@id": WEBSITE },
  about: { "@id": PERSON },
  ...(kind === "ProfilePage" && { mainEntity: { "@id": PERSON } }),
  inLanguage: "en",
});
