'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cat, Dog } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Component() {
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    setVoterId(getCookie('voter_id'));
  }, []);

  const getCookie = (name: any) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }

    return null;
  };

  const handleVote = async () => {
    const body = JSON.stringify({ text: 'this is a body' });
    const res = fetch('/api', { method: 'POST', body });
  };
  return (
    <>
      <main className='flex flex-col items-center justify-center p-8'>
        <h1 className='text-2xl lg:text-4xl font-bold mb-8'>
          Cat vs. Dog Voting App
        </h1>
        <div className='flex flex-col md:flex-row gap-8 mb-8'>
          <Card className='flex flex-col items-center p-8 bg-gray-100 rounded-lg'>
            <Cat size={200} strokeWidth={1} />
            <Badge className='mb-4'>Cats</Badge>
            <p className='text-2xl font-bold' id='cat-votes'>
              0
            </p>
            <Button onClick={handleVote} className='mt-4'>
              Vote
            </Button>
          </Card>
          <Card className='flex flex-col items-center p-8 bg-gray-100 rounded-lg'>
            <Dog size={200} strokeWidth={1} />
            <Badge className='mb-4'>Dogs</Badge>
            <p className='text-2xl font-bold' id='dog-votes'>
              0
            </p>
            <Button className='mt-4'>Vote</Button>
          </Card>
        </div>
        <section className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10'>
            <div className='space-y-3'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Results
              </h2>
              <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400'>
                Total votes for Cats:
                <span className='font-bold' id='total-cat-votes'>
                  0
                </span>
                <br />
                Total votes for Dogs:
                <span className='font-bold' id='total-dog-votes'>
                  0
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
