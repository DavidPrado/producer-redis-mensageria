import ConsoleQueue from "./log.queue";

const queues = {
    log: ConsoleQueue.getInstance().queue,
}

export default queues;