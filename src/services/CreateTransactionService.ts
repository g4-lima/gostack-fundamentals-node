import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();

      if (balance.outcome > balance.total) {
        throw Error('Insufficient funds');
      }
    }

    return transaction;
  }
}

export default CreateTransactionService;
