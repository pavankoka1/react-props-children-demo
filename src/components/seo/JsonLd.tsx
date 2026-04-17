import {
  AUTHOR_NAME,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/seo-config";
import { getSiteUrl } from "@/lib/site-url";

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question:
      "What is the difference between passing a component as a prop vs as children?",
    answer:
      "As a prop, Child receives a function and creates a new React element when Child renders. As children, the parent’s JSX creates the element object and passes it as props.children — ownership of the element object sits with whichever component’s render created it.",
  },
  {
    question: "Why does the inner component sometimes not re-render when Child state updates?",
    answer:
      "If the inner UI was passed as children and only Child’s state changed, props.children may still be the same element reference from the last parent render, so React can skip reconciling that subtree. If the inner was rendered via a prop component type inside Child, Child’s re-render typically creates a new element and the inner runs again.",
  },
  {
    question: "What does React.memo on Child do in the third pattern?",
    answer:
      "React.memo shallow-compares Child’s props before running Child. If ComponentToRender is a stable reference and no other props change, Child and its inner output can be skipped when the parent updates unrelated state.",
  },
  {
    question: "Is children a special React API?",
    answer:
      "No — children is a normal prop. The behavioral differences come from object identity and where JSX creates elements, not from special casing in React.",
  },
];

/**
 * WebSite, Organization, TechArticle, and FAQPage JSON-LD for rich results.
 */
export function JsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        url,
        inLanguage: "en-US",
        publisher: { "@id": `${url}/#organization` },
        potentialAction: {
          "@type": "ReadAction",
          target: [`${url}/guide`, `${url}/demo`],
        },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: SITE_NAME,
        url,
        description: SITE_TAGLINE,
      },
      {
        "@type": "Person",
        "@id": `${url}/#author`,
        name: AUTHOR_NAME,
        jobTitle: "Software engineer",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressCountry: "IN",
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${url}/#article`,
        headline: `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: DEFAULT_DESCRIPTION,
        url,
        inLanguage: "en-US",
        author: { "@id": `${url}/#author` },
        isPartOf: { "@id": `${url}/#website` },
        about: [
          { "@type": "Thing", name: "React elements" },
          { "@type": "Thing", name: "React.memo" },
          { "@type": "Thing", name: "React children prop" },
        ],
        keywords: [
          "React",
          "React elements",
          "React.memo",
          "children",
          "props",
          "re-renders",
        ],
        educationalLevel: "Professional",
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
