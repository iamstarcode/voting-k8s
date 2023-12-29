import { promisify } from 'util';
import { RedisClientType, createClient } from 'redis';
import { Client } from 'pg';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Worker {
  private static pgsql: Client;
  private static redisClient: RedisClientType;

  private static async getPgsql(): Promise<Client> {
    if (!Worker.pgsql) {
      Worker.pgsql = new Client({
        connectionString: 'postgres://root:root@localhost:5432/vote',
      });
      await Worker.pgsql.connect();
      console.error('Connected to db');

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS votes (
          id VARCHAR(255) NOT NULL UNIQUE,
          vote VARCHAR(255) NOT NULL
        )`;

      Worker.pgsql.query(createTableQuery);
    }

    return Worker.pgsql;
  }

  private static async getRedisClient() {
    if (!Worker.redisClient) {
      const redisClient = await createClient()
        .on('error', (err) => console.log('Redis Client Error', err))
        .connect();
      return redisClient;
    }

    return Worker.redisClient;
  }

  public start(): void {
    setInterval(async () => {
      await sleep(100);

      const redisClient = await Worker.getRedisClient();
      const pgsql = await Worker.getPgsql();
      const voteString: any = await redisClient.lPop('votes');
      const vote = JSON.parse(voteString);

      if (vote !== null) {
        console.log(`Processing vote for '${vote.vote}' by '${vote.voter_id}'`);
        await this.updateVote(vote.voter_id, vote.vote);
      } else {
        // Execute keep-alive query
        await pgsql.query('SELECT 1');
      }
    }, 100);
  }

  private async updateVote(voterId: string, vote: string): Promise<void> {
    const insertQuery = 'INSERT INTO votes (id, vote) VALUES ($1, $2)';
    const updateQuery = 'UPDATE votes SET vote = $2 WHERE id = $1';

    try {
      await Worker.pgsql.query({
        text: insertQuery,
        values: [voterId, vote],
      });
    } catch (error) {
      await Worker.pgsql.query({
        text: updateQuery,
        values: [voterId, vote],
      });
    }
  }
}
