import { useEffect, useState } from 'react';
import { Text } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <main className="grid h-lvh grid-cols-12">
      <AuthBanner />
      <AuthForm />
    </main>
  );
}

const AuthBanner = () => {
  const [activeContent, setActiveContent] = useState<number>(0);
  const [contentIsHover, setContentIsHover] = useState<boolean>(false);
  const interval = useInterval(() => setActiveContent((e) => (e === 3 ? 0 : e + 1)), 5000);

  const contents = [
    {
      title: 'Proses Pengadaan Lebih Transparan',
      description:
        'Kelola seluruh proses e-procurement secara digital dan terstruktur. Setiap tahapan dapat dipantau secara real-time untuk meningkatkan transparansi dan akuntabilitas pengadaan.',
    },
    {
      title: 'Pengadaan Lebih Cepat dan Terpusat',
      description:
        'Mulai dari pengajuan kebutuhan, evaluasi, hingga persetujuan dilakukan dalam satu sistem terpusat. Proses lebih cepat, efisien, dan minim hambatan operasional.',
    },
    {
      title: 'Keamanan dan Kepatuhan Terjamin',
      description:
        'Sistem dirancang dengan standar keamanan yang andal serta audit trail yang lengkap. Mendukung kepatuhan terhadap kebijakan internal dan regulasi pengadaan perusahaan.',
    },
    {
      title: 'Kontrol Penuh dalam Satu Dashboard',
      description:
        'Pantau status pengadaan, kinerja vendor, dan laporan secara real-time melalui dashboard terpadu. Membantu pengambilan keputusan yang lebih cepat dan tepat.',
    },
  ];

  function onContentDotClick(index: number) {
    interval.stop();
    setActiveContent(index);
    console.info(contentIsHover);
    if (!contentIsHover) interval.start();
  }

  function mouseEnterContent() {
    interval.stop();
    setContentIsHover(true);
  }

  function mouseLeaveContent() {
    interval.start();
    setContentIsHover(false);
  }

  useEffect(() => {
    // TODO: add function to redirect to home if user already login

    interval.start();
    return interval.stop();
  }, []);

  return (
    <div className="col-span-6 hidden md:block xl:col-span-8">
      <div className="relative h-lvh w-full overflow-clip xl:p-12 xl:pr-0">
        <img
          src="https://images.unsplash.com/photo-1554232456-8727aae0cfa4?q=80&w=735&auto=format&fit=crop"
          className="h-full w-full object-cover xl:rounded-2xl"
        />
        <div className="absolute inset-0 z-10 overflow-clip xl:m-12 xl:mr-0 xl:rounded-2xl">
          <div className="bg-linear-to-t h-full from-black/70 via-black/40 to-white/0">
            <div className="flex h-full flex-col justify-end p-20 text-white">
              <div onMouseEnter={mouseEnterContent} onMouseLeave={mouseLeaveContent}>
                <Text className="mb-1 text-2xl font-bold">{contents[activeContent].title}</Text>
                <Text className="mb-6 text-white/70 xl:max-w-[70%]">
                  {contents[activeContent].description}
                </Text>
                <div className="flex">
                  {contents.map((_, key) => {
                    const active = activeContent == key;
                    return (
                      <div
                        key={key}
                        onClick={() => onContentDotClick(key)}
                        className={`mr-1.5 cursor-pointer ${active ? 'h-2.5 w-16 bg-white' : 'size-2.5 bg-white/60'} rounded-2xl transition-all duration-500 ease-in-out`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthForm = () => {
  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-4">
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="w-full sm:max-w-[60%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[80%] 2xl:max-w-[65%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
