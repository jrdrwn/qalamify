import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function Feature() {
  return (
    <section className="container mx-auto px-2 py-16">
      <div className="grid grid-flow-row grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <Card className="py-3 sm:py-6 lg:row-span-2 lg:py-4 xl:py-6">
          <CardContent className="flex flex-col gap-4 px-3 sm:px-6 lg:px-4 xl:px-6">
            <Image
              src={
                'https://images.unsplash.com/photo-1620802421041-cfb402036374'
              }
              alt="hero"
              width={800}
              height={800}
              className="h-110 rounded-lg object-cover object-center"
            />
            <CardTitle className="text-xl sm:text-2xl">
              Mengapa Kaligrafi NFT?
            </CardTitle>
            <CardDescription className="text-base xl:text-lg">
              Kaligrafi adalah seni yang melampaui waktu. Dengan NFT, seni ini
              mendapatkan kehidupan baru di dunia digital, memungkinkan kolektor
              untuk memiliki karya yang unik dan autentik.
            </CardDescription>
            <CardDescription className="text-base xl:text-lg">
              Temukan keindahan kaligrafi yang diabadikan dalam teknologi
              blockchain. Setiap karya adalah cerita, setiap goresan adalah
              warisan.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="py-3 sm:py-6 lg:col-span-1 lg:py-4 xl:py-6">
          <CardContent className="flex flex-col gap-4 px-3 sm:px-6 lg:px-4 xl:px-6">
            <Image
              src={
                'https://images.unsplash.com/photo-1600728619239-d2a73f7aa541'
              }
              alt="hero"
              width={800}
              height={800}
              className="rounded-lg object-cover object-center lg:h-45 xl:h-40"
            />
            <CardTitle className="text-xl sm:text-2xl">
              Bukan Sekadar Koleksi Digital
            </CardTitle>
            <CardDescription className="text-base xl:text-lg">
              Kaligrafi NFT adalah perpaduan seni dan teknologi. Ini adalah cara
              baru untuk mendukung seniman dan memiliki karya seni yang abadi.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="py-3 sm:py-6 lg:col-span-1 lg:py-4 xl:py-6">
          <CardContent className="flex flex-col gap-4 px-3 sm:px-6 lg:px-4 xl:px-6">
            <Image
              src={
                'https://images.unsplash.com/photo-1498579687545-d5a4fffb0a9e'
              }
              alt="hero"
              width={800}
              height={800}
              className="h-25 rounded-lg object-cover object-center"
            />
            <CardTitle className="text-xl sm:text-2xl">
              Untuk Pecinta Seni, Bukan untuk Mesin!
            </CardTitle>
            <CardDescription className="text-base xl:text-lg">
              Kami hadir untuk mereka yang menghargai keindahan dan makna di
              balik setiap karya seni. Kaligrafi NFT adalah penghormatan kepada
              tradisi dengan sentuhan modern.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="py-3 sm:py-6 lg:col-span-2 lg:py-4 xl:py-6">
          <CardContent className="flex flex-col gap-4 px-3 sm:px-6 lg:px-4 xl:px-6">
            <Image
              src={
                'https://images.unsplash.com/photo-1572000423136-e94e163fb50b'
              }
              alt="hero"
              width={800}
              height={800}
              className="w-full rounded-lg object-cover object-center lg:h-45 xl:h-50"
            />
            <CardTitle className="text-xl sm:text-2xl">
              Dukung Seniman Kaligrafi Lokal!
            </CardTitle>
            <CardDescription className="text-base xl:text-lg">
              Dengan memiliki Kaligrafi NFT, kamu tidak hanya mendapatkan karya
              seni yang unik, tetapi juga mendukung seniman lokal untuk terus
              berkarya dan berkembang di era digital.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
