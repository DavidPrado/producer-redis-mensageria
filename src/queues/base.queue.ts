import * as Bull from 'bull';
import { Queues } from '../enums';
import configs from '../configs';

export default class BaseQueue {
    queue: Bull.Queue;

    constructor(queue: Queues) {
        this.queue = new Bull(queue, {
            redis: configs.redis,
            prefix: 'bull',
            settings: {
                retryProcessDelay: 500,
            }
        });

        this.queue.on('failed', this.failed);
        this.queue.on('completed', this.completed);
        this.queue.on('error', (error) => {
            console.error(`Falha nas tasks, verifique suas configurações : ${error}`)
        });
    }
    protected failed(job, err) {
        console.error(`Queue ${job.queue.name} failed, ${job.id} - ${job.failedReason}`);
        console.error(err);
    }

    protected completed(job) {
        console.log(`Queue ${job.queue.name} completed, ${job.id}`);
    }

    add(body: any, opts?: Bull.JobOptions) {
        return this.queue.add(
            body,
            opts || {
                attempts: 5,
                deplay: 2000,
                removeOnFail: false,
                backoff: 5000,
            }
        )
    }
}