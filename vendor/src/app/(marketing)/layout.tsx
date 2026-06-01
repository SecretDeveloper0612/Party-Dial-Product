import Header from "@/vendor/components/Header";
import Footer from "@/vendor/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
// cache bust
