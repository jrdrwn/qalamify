import DetailNFT from '@/components/explore/detail-nft';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  return (
    <>
      <DetailNFT id={parseInt((await params).id) as unknown as bigint} />
    </>
  );
}
