import { Hero } from '@/components/explore/hero';
import ListNFT from '@/components/explore/list-nft';
import EndCTA from '@/components/shared/end-cta';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <ListNFT />
      <EndCTA />
      <Footer />
    </>
  );
}
