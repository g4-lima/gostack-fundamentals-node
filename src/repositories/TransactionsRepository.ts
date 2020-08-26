import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const groupBy = (array: Transaction[], key: string) => {
      return array.reduce((result: any, currentValue: any) => {
        // eslint-disable-next-line no-param-reassign
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
          currentValue,
        );
        return result;
      }, {});
    };

    const objectsByType = groupBy(this.transactions, 'type');

    const income = objectsByType.income
      .map((inc: Transaction) => inc.value)
      .reduce((prev: number, next: number) => prev + next);

    const outcome = objectsByType.outcome
      .map((out: Transaction) => out.value)
      .reduce((prev: number, next: number) => prev + next);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
