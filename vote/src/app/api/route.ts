import { createClient } from 'redis';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = cookies();

  const voter_id = cookieStore.get('voter_id');

  const client = await createClient()
    .on('error', (err) => console.log('Redis Client Error', err))
    .connect();

  client.RPUSH(
    'votes',
    JSON.stringify({ vote: 'dog', voter_id: voter_id?.value })
  );

  return Response.json({});
}
