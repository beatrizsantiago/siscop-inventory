import Goal from '@domain/entities/Goal';

export interface GoalRepository {
  findPendingProductionGoals(
    farmId: string,
    before: Date
  ): Promise<Goal[]>;

  markAsFinished(goalId: string): Promise<void>;
};
