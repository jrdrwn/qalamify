import DetailNFT from '@/components/explore/detail-nft';
import EndCTA from '@/components/shared/end-cta';
import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  return (
    <>
      <Header />
      <DetailNFT id={parseInt((await params).id)} />
      <EndCTA />
      <Footer />
    </>
  );
}
