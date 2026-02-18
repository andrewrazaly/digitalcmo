import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Digital CMO. SaaS tool comparisons and reviews for Australian businesses.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">About Digital CMO</h1>
      <div className="prose mt-6">
        <p>
          Digital CMO helps Australian businesses choose the right SaaS tools.
          We publish honest comparisons, in-depth reviews, and practical guides
          for accounting software, CRMs, project management tools, e-commerce
          platforms, and more.
        </p>
        <h2>Affiliate disclosure</h2>
        <p>
          This site contains affiliate links. When you make a purchase through
          our links, we may earn a commission at no extra cost to you. We only
          recommend tools we believe provide value to Australian businesses.
        </p>
        <h2>Contact</h2>
        <p>
          For questions or partnership enquiries, please reach out via our
          contact page.
        </p>
      </div>
    </div>
  );
}
